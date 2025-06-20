// Ko Lake Villa - Booking Calendar Integrity System
// Prevents double bookings and ensures proper room availability

export interface BookingRequest {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
}

export interface ExistingBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Room inventory configuration
export const ROOM_INVENTORY = {
  'Entire Villa (KLV)': {
    quantity: 1,
    includesAll: true, // When booked, all other rooms become unavailable
  },
  'Master Family Suite (KLV1)': {
    quantity: 1,
    includedInVilla: true,
  },
  'Triple/Twin Rooms (KLV3)': {
    quantity: 4, // 4 individual triple rooms available
    includedInVilla: true,
  },
  'Group Room (KLV6)': {
    quantity: 1,
    includedInVilla: true,
  }
};

export class BookingValidator {
  private existingBookings: ExistingBooking[] = [];

  constructor(existingBookings: ExistingBooking[] = []) {
    this.existingBookings = existingBookings.filter(b => b.status === 'confirmed');
  }

  // Check if dates overlap
  private datesOverlap(
    start1: string, end1: string,
    start2: string, end2: string
  ): boolean {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);
    
    return s1 < e2 && e1 > s2;
  }

  // Get conflicting bookings for a date range
  private getConflictingBookings(checkIn: string, checkOut: string): ExistingBooking[] {
    return this.existingBookings.filter(booking =>
      this.datesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)
    );
  }

  // Check if entire villa booking conflicts with any existing bookings
  private validateEntireVilla(checkIn: string, checkOut: string): { available: boolean; conflicts: string[] } {
    const conflicts = this.getConflictingBookings(checkIn, checkOut);
    
    if (conflicts.length > 0) {
      return {
        available: false,
        conflicts: conflicts.map(c => `${c.roomType} (${c.checkIn} to ${c.checkOut})`)
      };
    }
    
    return { available: true, conflicts: [] };
  }

  // Check if individual room booking conflicts with villa or other bookings
  private validateIndividualRoom(
    roomType: string,
    checkIn: string,
    checkOut: string
  ): { available: boolean; conflicts: string[] } {
    const conflicts = this.getConflictingBookings(checkIn, checkOut);
    
    // Check if entire villa is booked during this period
    const villaConflicts = conflicts.filter(c => c.roomType === 'Entire Villa (KLV)');
    if (villaConflicts.length > 0) {
      return {
        available: false,
        conflicts: [`Entire Villa is booked (${villaConflicts[0].checkIn} to ${villaConflicts[0].checkOut})`]
      };
    }

    // Check same room type conflicts
    const sameRoomConflicts = conflicts.filter(c => c.roomType === roomType);
    const roomConfig = ROOM_INVENTORY[roomType as keyof typeof ROOM_INVENTORY];
    
    if (sameRoomConflicts.length >= roomConfig.quantity) {
      return {
        available: false,
        conflicts: [`All ${roomType} rooms are booked during this period`]
      };
    }

    return { available: true, conflicts: [] };
  }

  // Main validation function
  public validateBooking(request: BookingRequest): {
    valid: boolean;
    available: boolean;
    conflicts: string[];
    message: string;
  } {
    // Basic date validation
    const checkInDate = new Date(request.checkIn);
    const checkOutDate = new Date(request.checkOut);
    const today = new Date();
    
    if (checkInDate <= today) {
      return {
        valid: false,
        available: false,
        conflicts: [],
        message: 'Check-in date must be in the future'
      };
    }

    if (checkOutDate <= checkInDate) {
      return {
        valid: false,
        available: false,
        conflicts: [],
        message: 'Check-out date must be after check-in date'
      };
    }

    // Room-specific validation
    if (request.roomType === 'Entire Villa (KLV)') {
      const validation = this.validateEntireVilla(request.checkIn, request.checkOut);
      
      return {
        valid: validation.available,
        available: validation.available,
        conflicts: validation.conflicts,
        message: validation.available 
          ? 'Entire Villa is available for your dates'
          : `Entire Villa not available: ${validation.conflicts.join(', ')}`
      };
    } else {
      // Individual room validation
      const validation = this.validateIndividualRoom(
        request.roomType,
        request.checkIn,
        request.checkOut
      );
      
      return {
        valid: validation.available,
        available: validation.available,
        conflicts: validation.conflicts,
        message: validation.available
          ? `${request.roomType} is available for your dates`
          : `${request.roomType} not available: ${validation.conflicts.join(', ')}`
      };
    }
  }

  // Get availability summary for a date range
  public getAvailabilitySummary(checkIn: string, checkOut: string): {
    [key: string]: { available: boolean; reason?: string }
  } {
    const summary: { [key: string]: { available: boolean; reason?: string } } = {};
    
    Object.keys(ROOM_INVENTORY).forEach(roomType => {
      const validation = this.validateBooking({
        checkIn,
        checkOut,
        roomType,
        guests: 1 // Guests don't affect availability, just capacity
      });
      
      summary[roomType] = {
        available: validation.available,
        reason: validation.available ? undefined : validation.message
      };
    });
    
    return summary;
  }

  // Add a new booking (for testing purposes)
  public addBooking(booking: ExistingBooking): void {
    if (booking.status === 'confirmed') {
      this.existingBookings.push(booking);
    }
  }
}

// Export singleton instance
export const bookingValidator = new BookingValidator();