import axios from 'axios';
import * as ical from 'node-ical';

interface SirVoyBooking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: string;
  totalAmount: number;
}

interface SirVoyAvailability {
  date: string;
  roomType: string;
  available: number;
  price: number;
}

class SirVoyConnector {
  private apiKey: string | undefined;
  private hotelId: string | undefined;
  private baseUrl = 'https://api.sirvoy.com/v1';

  constructor() {
    this.apiKey = process.env.SIRVOY_API_KEY;
    this.hotelId = process.env.SIRVOY_HOTEL_ID;
  }

  /**
   * Check if SirVoy credentials are configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.hotelId);
  }

  /**
   * Fetch current bookings from SirVoy
   */
  async getBookings(startDate?: string, endDate?: string): Promise<SirVoyBooking[]> {
    if (!this.isConfigured()) {
      throw new Error('SirVoy API credentials not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/bookings`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          hotel_id: this.hotelId,
          start_date: startDate,
          end_date: endDate
        }
      });

      return response.data.bookings || [];
    } catch (error: any) {
      console.error('SirVoy API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch bookings from SirVoy');
    }
  }

  /**
   * Check room availability for specific dates
   */
  async checkAvailability(checkIn: string, checkOut: string): Promise<SirVoyAvailability[]> {
    if (!this.isConfigured()) {
      throw new Error('SirVoy API credentials not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/availability`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          hotel_id: this.hotelId,
          check_in: checkIn,
          check_out: checkOut
        }
      });

      return response.data.availability || [];
    } catch (error: any) {
      console.error('SirVoy Availability Error:', error.response?.data || error.message);
      throw new Error('Failed to check availability with SirVoy');
    }
  }

  /**
   * Sync room rates from SirVoy
   */
  async getRoomRates(): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('SirVoy API credentials not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/rates`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          hotel_id: this.hotelId
        }
      });

      return response.data.rates || [];
    } catch (error: any) {
      console.error('SirVoy Rates Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch rates from SirVoy');
    }
  }

  /**
   * Fetch and parse iCal feed from SirVoy
   */
  async getICalBookings(icalUrl: string): Promise<SirVoyBooking[]> {
    try {
      const response = await axios.get(icalUrl);
      return this.parseICalToBookings(response.data);
    } catch (error: any) {
      console.error('iCal Feed Error:', error.message);
      throw new Error('Failed to fetch iCal feed from SirVoy');
    }
  }

  /**
   * Parse iCal data into booking objects
   */
  private parseICalToBookings(icalData: string): SirVoyBooking[] {
    const bookings: SirVoyBooking[] = [];
    
    try {
      const events = ical.parseICS(icalData);
      
      for (const key in events) {
        const event = events[key];
        
        if (event.type === 'VEVENT' && event.start && event.end) {
          // Extract guest name from summary (usually in format "Guest Name - Room Type" or similar)
          const summary = event.summary || 'Unknown Guest';
          const guestName = this.extractGuestName(summary);
          const roomType = this.extractRoomType(summary);
          
          bookings.push({
            id: event.uid || key,
            guestName,
            checkIn: this.formatDate(event.start),
            checkOut: this.formatDate(event.end),
            roomType,
            status: 'confirmed',
            totalAmount: 0 // Not available in iCal typically
          });
        }
      }
    } catch (error) {
      console.error('Error parsing iCal data:', error);
    }
    
    return bookings;
  }

  /**
   * Extract guest name from iCal summary
   */
  private extractGuestName(summary: string): string {
    // Common patterns: "John Doe", "John Doe - Villa", "Booking: John Doe"
    const cleanSummary = summary.replace(/^(Booking:|Reserved:)\s*/i, '');
    const parts = cleanSummary.split(/\s*[-–—]\s*/);
    return parts[0].trim() || 'Guest';
  }

  /**
   * Extract room type from iCal summary
   */
  private extractRoomType(summary: string): string {
    const klvPattern = /\b(KLV\d*|Villa|Suite|Room|Triple|Group)\b/i;
    const match = summary.match(klvPattern);
    return match ? match[0] : 'Standard Room';
  }

  /**
   * Format date for consistent output
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Check if dates are available based on iCal bookings
   */
  async checkICalAvailability(icalUrl: string, checkIn: string, checkOut: string): Promise<boolean> {
    try {
      const bookings = await this.getICalBookings(icalUrl);
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Check if requested dates overlap with any existing bookings
      for (const booking of bookings) {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        
        // Check for date overlap
        if (checkInDate < bookingEnd && checkOutDate > bookingStart) {
          return false; // Dates are not available
        }
      }
      
      return true; // Dates are available
    } catch (error) {
      console.error('Error checking iCal availability:', error);
      return false; // Default to unavailable on error
    }
  }
}

export const sirvoyConnector = new SirVoyConnector();

/**
 * Fallback: Check if we should use sample data or real SirVoy data
 */
export function shouldUseSampleData(): boolean {
  return !sirvoyConnector.isConfigured();
}

/**
 * Get booking status message for admin
 */
export function getIntegrationStatus(): string {
  if (sirvoyConnector.isConfigured()) {
    return 'Connected to SirVoy - Using live booking data';
  } else {
    return 'SirVoy not configured - Using sample data. Add SIRVOY_API_KEY and SIRVOY_HOTEL_ID to connect.';
  }
}