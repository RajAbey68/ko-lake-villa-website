import { storage } from './storage';

interface PricingResult {
  airbnb_price: string;
  direct_price: string;
  discount_percent: number;
  discount_label: string;
  days_until_checkin: number;
  savings: string;
}

interface RoomPricing {
  roomId: number;
  roomName: string;
  airbnbRate: number;
  directRate: number;
  lastUpdated: Date;
}

class KoLakeVillaPricingEngine {
  /**
   * Calculate Ko Lake Villa direct booking price with dynamic discounts
   * 10% off regular direct booking, 15% off within 3 days
   */
  getDirectBookingPrice(airbnbPrice: number, checkinDateStr: string): PricingResult {
    const basePrice = parseFloat(airbnbPrice.toString());
    const checkinDate = new Date(checkinDateStr);
    const today = new Date();

    // Normalize time values for accurate date comparison
    checkinDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysUntilCheckin = Math.ceil((checkinDate - today) / millisecondsPerDay);

    // Ko Lake Villa pricing strategy
    const discountRate = daysUntilCheckin <= 3 ? 0.15 : 0.10;
    const discountLabel = daysUntilCheckin <= 3 
      ? "Last-Minute Ko Lake Villa Deal (15% off)" 
      : "Direct Booking Discount (10% off)";
    
    const directPrice = (basePrice * (1 - discountRate));
    const savings = (basePrice - directPrice);

    return {
      airbnb_price: basePrice.toFixed(2),
      direct_price: directPrice.toFixed(2),
      discount_percent: discountRate * 100,
      discount_label: discountLabel,
      days_until_checkin: daysUntilCheckin,
      savings: savings.toFixed(2)
    };
  }

  /**
   * Update all Ko Lake Villa room rates every Sunday
   */
  async updateWeeklyRates(): Promise<void> {
    try {
      console.log('🏡 Ko Lake Villa: Starting weekly rate update...');
      
      const rooms = await storage.getRooms();
      const updatedRates: RoomPricing[] = [];

      for (const room of rooms) {
        // Get current Airbnb rate (this would connect to your rate source)
        const currentAirbnbRate = await this.getCurrentAirbnbRate(room.name);
        
        if (currentAirbnbRate) {
          // Calculate 10% direct booking discount as base rate
          const directRate = Math.round(currentAirbnbRate * 0.90);
          
          updatedRates.push({
            roomId: room.id,
            roomName: room.name,
            airbnbRate: currentAirbnbRate,
            directRate: directRate,
            lastUpdated: new Date()
          });
          
          console.log(`📊 ${room.name}: Airbnb $${currentAirbnbRate} → Direct $${directRate} (10% off base)`);
        }
      }
      
      // Store updated rates
      await this.saveUpdatedRates(updatedRates);
      console.log('✅ Ko Lake Villa weekly rates updated successfully!');
      
    } catch (error) {
      console.error('❌ Error updating Ko Lake Villa rates:', error);
    }
  }

  /**
   * Get current Airbnb rate for room (placeholder for your data source)
   */
  private async getCurrentAirbnbRate(roomName: string): Promise<number | null> {
    // This would connect to your Airbnb rate source
    // For now, returning existing rates as baseline
    
    const rateMap: { [key: string]: number } = {
      'Entire Villa Exclusive (KNP)': 1800,
      'Master Family Suite (KNP1)': 450,
      'Triple/Twin Rooms (KNP3)': 180,
      'Group Room (KNP6)': 250
    };
    
    return rateMap[roomName] || null;
  }

  /**
   * Save updated rates to storage
   */
  private async saveUpdatedRates(rates: RoomPricing[]): Promise<void> {
    // Implementation would update room prices in storage
    console.log('💾 Saving updated Ko Lake Villa rates:', rates.length, 'rooms');
  }

  /**
   * Schedule Sunday rate updates
   */
  startWeeklyUpdates(): void {
    const scheduleUpdate = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      // Calculate next Sunday
      const daysUntilSunday = (7 - now.getDay()) % 7;
      nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      nextSunday.setHours(6, 0, 0, 0); // 6 AM on Sunday
      
      const timeUntilSunday = nextSunday.getTime() - now.getTime();
      
      setTimeout(() => {
        this.updateWeeklyRates();
        // Schedule next update
        setInterval(() => this.updateWeeklyRates(), 7 * 24 * 60 * 60 * 1000); // Every 7 days
      }, timeUntilSunday);
      
      console.log(`📅 Ko Lake Villa: Next rate update scheduled for ${nextSunday.toDateString()}`);
    };
    
    scheduleUpdate();
  }

  /**
   * Generate pricing display for website
   */
  generatePricingDisplay(roomName: string, airbnbPrice: number, checkinDate: string): string {
    const pricing = this.getDirectBookingPrice(airbnbPrice, checkinDate);
    
    return `
      <div class="ko-lake-pricing-card">
        <h3>Book Direct with Ko Lake Villa & Save</h3>
        <div class="pricing-comparison">
          <div class="airbnb-price">
            <span class="label">Airbnb Price:</span>
            <span class="price">$${pricing.airbnb_price}</span>
          </div>
          <div class="direct-price">
            <span class="label">Your Direct Price:</span>
            <span class="price highlight">$${pricing.direct_price}</span>
          </div>
          <div class="savings">
            <strong>You Save: $${pricing.savings} (${pricing.discount_percent}%)</strong>
            <p class="deal-label">${pricing.discount_label}</p>
          </div>
        </div>
        <button class="book-direct-btn">Book Direct & Save</button>
      </div>
    `;
  }
}

// Export pricing engine for Ko Lake Villa
export const koLakePricing = new KoLakeVillaPricingEngine();

// Example usage for your accommodation pages
export function calculateRoomSavings(airbnbRate: number, checkinDate: string) {
  return koLakePricing.getDirectBookingPrice(airbnbRate, checkinDate);
}

// Start automatic Sunday updates
export function initializePricingSystem(): void {
  koLakePricing.startWeeklyUpdates();
  console.log('🚀 Ko Lake Villa dynamic pricing system activated!');
}