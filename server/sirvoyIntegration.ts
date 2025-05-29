import axios from 'axios';

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
   * Alternative: Use iCal feed if API is not available
   * Many booking systems provide iCal URLs for calendar integration
   */
  async getICalFeed(icalUrl: string): Promise<any[]> {
    try {
      const response = await axios.get(icalUrl);
      // Parse iCal data (would need an iCal parsing library)
      return this.parseICalData(response.data);
    } catch (error: any) {
      console.error('iCal Feed Error:', error.message);
      throw new Error('Failed to fetch iCal feed');
    }
  }

  private parseICalData(icalData: string): any[] {
    // Simple iCal parser (would need proper library like 'ical.js')
    const events: any[] = [];
    const lines = icalData.split('\n');
    let currentEvent: any = {};

    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('END:VEVENT')) {
        events.push(currentEvent);
      } else if (line.startsWith('DTSTART:')) {
        currentEvent.start = line.split(':')[1];
      } else if (line.startsWith('DTEND:')) {
        currentEvent.end = line.split(':')[1];
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.split(':')[1];
      }
    }

    return events;
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