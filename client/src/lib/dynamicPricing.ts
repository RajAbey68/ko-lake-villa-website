// Dynamic Pricing Logic for Ko Lake Villa
// Handles availability-based offers and midweek discounts

interface BookingRequest {
  checkIn: Date;
  checkOut: Date;
  roomType: 'villa' | 'suite' | 'room';
  basePrice: number;
}

interface PricingResult {
  originalPrice: number;
  discountedPrice: number;
  totalDiscount: number;
  discountPercentage: number;
  offerApplied: string[];
  nights: number;
  breakdown: {
    night: number;
    date: Date;
    dayOfWeek: string;
    basePrice: number;
    discountedPrice: number;
    discounts: string[];
  }[];
}

export class DynamicPricingEngine {
  
  // Check if date is weekday (Monday-Thursday)
  private isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 4; // Monday=1, Thursday=4
  }

  // Check if date is weekend (Friday-Saturday)
  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday=5, Saturday=6
  }

  // Get next 3 days from today
  private getNext3Days(): Date[] {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }
    
    return days;
  }

  // Check if property is available for next 3 weekdays
  private async checkNext3WeekdayAvailability(roomType: string): Promise<boolean> {
    const next3Days = this.getNext3Days();
    const weekdaysOnly = next3Days.filter(date => this.isWeekday(date));
    
    // Need exactly 3 weekdays to qualify for offer
    if (weekdaysOnly.length < 3) return false;
    
    // In production, this would check actual availability
    // For now, assume available if dates are weekdays
    return true;
  }

  // Check if booking span encroaches on Friday/Saturday
  private encroachesWeekend(checkIn: Date, checkOut: Date): boolean {
    const dates = this.getDateRange(checkIn, checkOut);
    return dates.some(date => this.isWeekend(date));
  }

  // Get all dates in range (excluding checkout day)
  private getDateRange(checkIn: Date, checkOut: Date): Date[] {
    const dates = [];
    const current = new Date(checkIn);
    
    while (current < checkOut) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  // Calculate nights between dates
  private calculateNights(checkIn: Date, checkOut: Date): number {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Main pricing calculation logic
  async calculateDynamicPricing(booking: BookingRequest): Promise<PricingResult> {
    const { checkIn, checkOut, roomType, basePrice } = booking;
    const nights = this.calculateNights(checkIn, checkOut);
    const dates = this.getDateRange(checkIn, checkOut);
    
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;
    const offersApplied: string[] = [];
    const breakdown: PricingResult['breakdown'] = [];

    // Check for Next 3 Weekdays Availability Offer
    const qualifiesForAvailabilityOffer = await this.checkNext3WeekdayAvailability(roomType);
    const isMinimum2Nights = nights >= 2;
    const allWeekdays = dates.every(date => this.isWeekday(date));

    // IF: Villa/suite/room available for next 3 weekdays AND minimum 2 nights
    const availabilityOfferApplies = qualifiesForAvailabilityOffer && isMinimum2Nights && allWeekdays;

    // Check for 3+ Night Midweek Bonus (IF booking 3+ nights midweek without weekend encroachment)
    const is3PlusNights = nights >= 3;
    const noWeekendEncroachment = !this.encroachesWeekend(checkIn, checkOut);
    const midweekBonusApplies = is3PlusNights && allWeekdays && noWeekendEncroachment;

    // Calculate pricing for each night
    dates.forEach((date, index) => {
      const nightNumber = index + 1;
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      let nightPrice = basePrice;
      let nightDiscountedPrice = basePrice;
      const nightDiscounts: string[] = [];

      // Apply availability offer (15% off all nights)
      if (availabilityOfferApplies) {
        nightDiscountedPrice = basePrice * 0.85; // 15% off
        nightDiscounts.push('Next 3 Weekdays Offer: 15% off');
      }

      // Apply midweek bonus (additional 5% for nights 3+, total 20%)
      if (midweekBonusApplies && nightNumber > 2) {
        if (availabilityOfferApplies) {
          // Replace 15% with 20% total for nights 3+
          nightDiscountedPrice = basePrice * 0.80; // Total 20% off
          nightDiscounts[nightDiscounts.length - 1] = 'Combined Midweek Offer: 20% off (15% + 5% bonus)';
        } else {
          // Just the 5% midweek bonus for nights 3+
          nightDiscountedPrice = basePrice * 0.95; // 5% off
          nightDiscounts.push('3+ Night Midweek Bonus: 5% off');
        }
      }

      totalOriginalPrice += nightPrice;
      totalDiscountedPrice += nightDiscountedPrice;

      breakdown.push({
        night: nightNumber,
        date: new Date(date),
        dayOfWeek,
        basePrice: nightPrice,
        discountedPrice: nightDiscountedPrice,
        discounts: nightDiscounts
      });
    });

    // Collect applied offers
    if (availabilityOfferApplies) {
      offersApplied.push('Next 3 Weekdays Availability Offer (Min 2 nights)');
    }
    if (midweekBonusApplies) {
      offersApplied.push('3+ Night Midweek Bonus (Additional 5% for nights 3+)');
    }

    const totalDiscount = totalOriginalPrice - totalDiscountedPrice;
    const discountPercentage = totalOriginalPrice > 0 ? (totalDiscount / totalOriginalPrice) * 100 : 0;

    return {
      originalPrice: totalOriginalPrice,
      discountedPrice: totalDiscountedPrice,
      totalDiscount,
      discountPercentage,
      offerApplied: offersApplied,
      nights,
      breakdown
    };
  }

  // Generate offer description for UI
  generateOfferDescription(result: PricingResult): string {
    if (result.offerApplied.length === 0) {
      return "Standard pricing applies";
    }

    const descriptions = [];
    
    if (result.offerApplied.some(offer => offer.includes('Next 3 Weekdays'))) {
      descriptions.push("🎯 Next 3 Weekdays Special: 15% off (minimum 2 nights)");
    }
    
    if (result.offerApplied.some(offer => offer.includes('Midweek Bonus'))) {
      descriptions.push("⭐ 3+ Night Midweek Bonus: Additional 5% off nights 3+ (20% total)");
    }

    return descriptions.join(' + ');
  }

  // Check if booking qualifies for any offers (for UI prompts)
  async checkOfferEligibility(checkIn: Date, checkOut: Date, roomType: string): Promise<{
    availabilityOffer: boolean;
    midweekBonus: boolean;
    recommendations: string[];
  }> {
    const nights = this.calculateNights(checkIn, checkOut);
    const dates = this.getDateRange(checkIn, checkOut);
    const allWeekdays = dates.every(date => this.isWeekday(date));
    const qualifiesForAvailability = await this.checkNext3WeekdayAvailability(roomType);
    
    const recommendations = [];
    
    const availabilityOffer = qualifiesForAvailability && nights >= 2 && allWeekdays;
    const midweekBonus = nights >= 3 && allWeekdays && !this.encroachesWeekend(checkIn, checkOut);
    
    if (qualifiesForAvailability && nights < 2) {
      recommendations.push("Add 1 more night to qualify for 15% weekday offer!");
    }
    
    if (nights === 2 && allWeekdays && !this.encroachesWeekend(checkIn, checkOut)) {
      recommendations.push("Add 1 more night for additional 5% bonus (20% total discount)!");
    }
    
    if (dates.some(date => this.isWeekend(date))) {
      recommendations.push("Choose weekdays only for special pricing offers!");
    }

    return {
      availabilityOffer,
      midweekBonus,
      recommendations
    };
  }
}

// Export singleton instance
export const pricingEngine = new DynamicPricingEngine();

// Helper function for easy use in components
export async function calculateBookingPrice(
  checkIn: Date, 
  checkOut: Date, 
  roomType: 'villa' | 'suite' | 'room', 
  basePrice: number
): Promise<PricingResult> {
  return pricingEngine.calculateDynamicPricing({
    checkIn,
    checkOut,
    roomType,
    basePrice
  });
}

// Pricing logic explanation for transparency
export const PRICING_LOGIC = {
  availabilityOffer: {
    condition: "IF villa/suite/room available for next 3 weekdays AND minimum 2 nights",
    discount: "15% off all nights",
    applies: "Weekday bookings only (Mon-Thu)"
  },
  midweekBonus: {
    condition: "IF 3+ nights midweek AND no Friday/Saturday encroachment",
    discount: "Additional 5% off nights 3+ (total 20% when combined)",
    applies: "Nights beyond the 2nd night only"
  }
} as const;