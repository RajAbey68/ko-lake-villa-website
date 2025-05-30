import { storage } from './storage';

interface WeekdayPricingUpdate {
  roomName: string;
  airbnbRate: number;
  directRate: number;
  effectiveDate: string;
  dayOfWeek: string;
  lastUpdated: Date;
}

class WeekdayPricingManager {
  private readonly WEEKDAY_DISCOUNT = 0.10; // 10% discount for weekdays
  private readonly ROOM_CODES = ['KNP', 'KNP1', 'KNP3', 'KNP6'];

  /**
   * Main function to update weekday rates every Sunday
   */
  async updateWeekdayRates(): Promise<void> {
    const today = new Date();
    
    // Check if today is Sunday (0 = Sunday)
    if (today.getDay() !== 0) {
      console.log('Not Sunday - weekday rate update skipped');
      return;
    }

    console.log('Sunday detected - updating weekday rates (Mon-Thu) for Ko Lake Villa');

    try {
      const weekdays = this.getNextWeekdays();
      const updatedRates: WeekdayPricingUpdate[] = [];

      for (const roomCode of this.ROOM_CODES) {
        const currentAirbnbRate = await this.getCurrentAirbnbRate(roomCode);
        
        if (currentAirbnbRate) {
          const directRate = Math.round(currentAirbnbRate * (1 - this.WEEKDAY_DISCOUNT));
          
          // Create rate updates for each weekday
          weekdays.forEach(weekday => {
            updatedRates.push({
              roomName: roomCode,
              airbnbRate: currentAirbnbRate,
              directRate,
              effectiveDate: weekday.toISOString().split('T')[0], // YYYY-MM-DD format
              dayOfWeek: this.getDayName(weekday.getDay()),
              lastUpdated: new Date()
            });
          });
        }
      }

      if (updatedRates.length > 0) {
        await this.saveWeekdayRates(updatedRates);
        console.log(`Updated weekday rates: ${updatedRates.length} rate entries created`);
        console.log('Pricing control strategy:');
        console.log('- Monday to Thursday: Auto-calculated with manual override option');
        console.log('- Friday, Saturday & Sunday: Manual admin control');
        console.log('- All rates can be manually overridden and saved at any time');
      }

    } catch (error) {
      console.error('Error updating weekday rates:', error);
    }
  }

  /**
   * Get the next 4 weekdays (Monday through Thursday)
   * Friday, Saturday, Sunday remain under manual admin control
   */
  private getNextWeekdays(): Date[] {
    const weekdays: Date[] = [];
    const monday = new Date();
    
    // Calculate next Monday (tomorrow since today is Sunday)
    monday.setDate(monday.getDate() + 1);

    // Add Monday through Thursday only (4 days)
    for (let i = 0; i < 4; i++) {
      const weekday = new Date(monday);
      weekday.setDate(monday.getDate() + i);
      weekdays.push(weekday);
    }

    return weekdays;
  }

  /**
   * Get current Airbnb rate for a room
   * This uses your existing pricing data
   */
  private async getCurrentAirbnbRate(roomCode: string): Promise<number | null> {
    try {
      // Get the current rates from your existing room data
      const rooms = await storage.getRooms();
      const room = rooms.find(r => r.name.includes(roomCode));
      
      if (room && room.airbnbPrice) {
        return room.airbnbPrice;
      }

      // Fallback to your known rates
      const fallbackRates: Record<string, number> = {
        'KNP': 431,  // Entire Villa
        'KNP1': 119, // Master Family Suite
        'KNP3': 70,  // Triple/Twin Rooms
        'KNP6': 250  // Group Room
      };

      return fallbackRates[roomCode] || null;
    } catch (error) {
      console.error(`Error getting Airbnb rate for ${roomCode}:`, error);
      return null;
    }
  }

  /**
   * Save updated weekday rates to storage
   */
  private async saveWeekdayRates(rates: WeekdayPricingUpdate[]): Promise<void> {
    try {
      // Update room prices in your storage system
      for (const rate of rates) {
        await this.updateRoomWeekdayPrice(rate);
      }
      
      console.log('Weekday rates saved successfully');
    } catch (error) {
      console.error('Error saving weekday rates:', error);
    }
  }

  /**
   * Update a specific room's weekday pricing
   */
  private async updateRoomWeekdayPrice(rate: WeekdayPricingUpdate): Promise<void> {
    try {
      const rooms = await storage.getRooms();
      const room = rooms.find(r => r.name.includes(rate.roomName));
      
      if (room) {
        // Update the room's direct booking rate for weekdays
        room.directPrice = rate.directRate;
        room.lastPriceUpdate = rate.lastUpdated;
        
        // You can extend this to store day-specific pricing if needed
        console.log(`Updated ${rate.roomName}: $${rate.airbnbRate} → $${rate.directRate} (${rate.dayOfWeek})`);
      }
    } catch (error) {
      console.error(`Error updating room price for ${rate.roomName}:`, error);
    }
  }

  /**
   * Get day name from day number
   */
  private getDayName(dayNumber: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  }

  /**
   * Check if weekend rates need manual attention
   */
  async checkWeekendRates(): Promise<void> {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Alert on Thursday for weekend rate review
    if (dayOfWeek === 4) { // Thursday
      console.log('🏨 Weekend Rate Reminder: Please review and set Friday & Saturday rates manually');
    }
  }

  /**
   * Start the automated weekday pricing system
   */
  startWeekdayPricingSystem(): void {
    // Run immediately if it's Sunday
    this.updateWeekdayRates();

    // Schedule to run every Sunday at midnight
    const scheduleWeekdayUpdate = () => {
      const now = new Date();
      const nextSunday = new Date();
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));
      nextSunday.setHours(0, 0, 0, 0);
      
      const timeUntilNextSunday = nextSunday.getTime() - now.getTime();
      
      setTimeout(() => {
        this.updateWeekdayRates();
        // Reschedule for next week
        setInterval(() => {
          this.updateWeekdayRates();
        }, 7 * 24 * 60 * 60 * 1000); // Weekly
      }, timeUntilNextSunday);
    };

    scheduleWeekdayUpdate();

    // Weekend rate reminder (Thursday check)
    setInterval(() => {
      this.checkWeekendRates();
    }, 24 * 60 * 60 * 1000); // Daily check

    console.log('Ko Lake Villa Weekday Pricing System activated');
    console.log('- Weekday rates (Mon-Fri) update every Sunday');
    console.log('- Weekend rates (Fri-Sat) remain under manual control');
  }
}

export const weekdayPricingManager = new WeekdayPricingManager();

/**
 * Initialize the weekday pricing system
 */
export function initializeWeekdayPricing(): void {
  weekdayPricingManager.startWeekdayPricingSystem();
}