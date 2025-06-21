// 🧠 Ko Lake Villa – Dynamic Baseline Pricing Model

interface AirbnbRates {
  [date: string]: number;
}

interface PricingResult {
  airbnbBase: number;
  directPrice: string;
  discountPercent: number;
  label: string;
  daysToCheckin: number;
  savings: string;
}

class KoLakeSmartPricing {
  // Sample scraped or fetched Airbnb pricing data (can be dynamic later)
  private airbnbRates: AirbnbRates = {
    "2025-06-01": 539, // Sunday
    "2025-06-02": 520, // Monday
    "2025-06-03": 510, // Tuesday
    "2025-06-04": 645, // Wednesday
    "2025-06-05": 700, // Thursday
  };

  /**
   * Pick earliest available Sunday–Tuesday rate as baseline
   */
  private getBaselinePrice(): number {
    const baselineDays = ["2025-06-01", "2025-06-02", "2025-06-03"];
    
    for (const date of baselineDays) {
      if (this.airbnbRates[date]) {
        return this.airbnbRates[date];
      }
    }

    // Fallback if no preferred weekday pricing found
    console.warn("⚠️ No Sunday–Tuesday rate found, using fallback rate.");
    return 539; // Use realistic fallback based on your actual rates
  }

  /**
   * Calculate direct booking price with Ko Lake Villa discounts
   */
  getDirectBookingRate(checkinDateStr: string): PricingResult {
    const today = new Date();
    const checkin = new Date(checkinDateStr);
    const daysToCheckin = Math.ceil((checkin - today) / (1000 * 60 * 60 * 24));

    const baselinePrice = this.getBaselinePrice();
    const discount = daysToCheckin <= 3 ? 0.15 : 0.10;
    const label = daysToCheckin <= 3 ? "Last-Minute Deal (15% off)" : "Book Direct (10% off)";
    const directPrice = (baselinePrice * (1 - discount)).toFixed(2);
    const savings = (baselinePrice - parseFloat(directPrice)).toFixed(2);

    return {
      airbnbBase: baselinePrice,
      directPrice,
      discountPercent: discount * 100,
      label,
      daysToCheckin,
      savings
    };
  }

  /**
   * Update Airbnb rates (for future integration with scraping/PMS)
   */
  updateAirbnbRates(newRates: AirbnbRates): void {
    this.airbnbRates = { ...this.airbnbRates, ...newRates };
    console.log("✅ Airbnb rates updated with new baseline data");
  }

  /**
   * Get pricing display for website
   */
  getPricingDisplay(checkinDate: string): string {
    const pricing = this.getDirectBookingRate(checkinDate);
    
    return `
      💡 Direct booking for ${checkinDate}
      Airbnb Base: $${pricing.airbnbBase}
      Direct Price: $${pricing.directPrice}
      Your Savings: $${pricing.savings}
      Discount Applied: ${pricing.discountPercent}% (${pricing.label})
    `;
  }
}

// Export singleton instance
export const koLakeSmartPricing = new KoLakeSmartPricing();

// Example usage and testing
export function testSmartPricing(): void {
  const checkinDate = "2025-06-05";
  const pricing = koLakeSmartPricing.getDirectBookingRate(checkinDate);
  
  console.log(`💡 Direct booking for ${checkinDate}`);
  console.log(`Airbnb Base: $${pricing.airbnbBase}`);
  console.log(`Direct Price: $${pricing.directPrice}`);
  console.log(`Your Savings: $${pricing.savings}`);
  console.log(`Discount Applied: ${pricing.discountPercent}% (${pricing.label})`);
}

// Export types for use in other files
export type { PricingResult, AirbnbRates };