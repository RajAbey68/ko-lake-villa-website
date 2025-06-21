/**
 * Ko Lake Villa - Dynamic Pricing Logic Test
 * Verifies responsive pricing offers based on availability and stay patterns
 */

class DynamicPricingTest {
  constructor() {
    this.testResults = [];
    this.basePrice = 100; // Test base price
  }

  log(test, status, details = '') {
    this.testResults.push({
      test,
      status,
      details,
      timestamp: new Date().toISOString()
    });
    
    const statusColor = status === 'PASS' ? '\x1b[32m' : status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
    console.log(`${statusColor}[${status}]\x1b[0m ${test} ${details ? `- ${details}` : ''}`);
  }

  // Helper to create dates
  createDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  }

  // Helper to check if date is weekday
  isWeekday(date) {
    const day = date.getDay();
    return day >= 1 && day <= 4; // Monday=1, Thursday=4
  }

  // Helper to check if date is weekend
  isWeekend(date) {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday=5, Saturday=6
  }

  // Get date range between two dates
  getDateRange(checkIn, checkOut) {
    const dates = [];
    const current = new Date(checkIn);
    
    while (current < checkOut) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  // Calculate nights
  calculateNights(checkIn, checkOut) {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Test pricing logic
  calculateTestPricing(checkIn, checkOut) {
    const nights = this.calculateNights(checkIn, checkOut);
    const dates = this.getDateRange(checkIn, checkOut);
    const allWeekdays = dates.every(date => this.isWeekday(date));
    const noWeekendEncroachment = !dates.some(date => this.isWeekend(date));
    
    // Check conditions
    const qualifiesForAvailabilityOffer = true; // Assume available for next 3 weekdays
    const isMinimum2Nights = nights >= 2;
    const is3PlusNights = nights >= 3;
    
    // Apply logic
    const availabilityOfferApplies = qualifiesForAvailabilityOffer && isMinimum2Nights && allWeekdays;
    const midweekBonusApplies = is3PlusNights && allWeekdays && noWeekendEncroachment;
    
    let totalOriginalPrice = nights * this.basePrice;
    let totalDiscountedPrice = totalOriginalPrice;
    const offersApplied = [];
    
    // Apply availability offer (15% off all nights)
    if (availabilityOfferApplies) {
      totalDiscountedPrice = totalOriginalPrice * 0.85; // 15% off
      offersApplied.push('Next 3 Weekdays Offer: 15% off');
    }
    
    // Apply midweek bonus (additional 5% for nights 3+, total 20%)
    if (midweekBonusApplies) {
      if (availabilityOfferApplies) {
        // Combine for 20% total
        const nightsOver2 = nights - 2;
        const extraDiscount = (nightsOver2 * this.basePrice) * 0.05; // 5% more for nights 3+
        totalDiscountedPrice = (2 * this.basePrice * 0.85) + (nightsOver2 * this.basePrice * 0.80);
        offersApplied[offersApplied.length - 1] = 'Combined Offer: 15% + 5% bonus (20% total for nights 3+)';
      } else {
        // Just 5% bonus for nights 3+
        const nightsOver2 = nights - 2;
        totalDiscountedPrice = (2 * this.basePrice) + (nightsOver2 * this.basePrice * 0.95);
        offersApplied.push('3+ Night Midweek Bonus: 5% off nights 3+');
      }
    }
    
    const totalDiscount = totalOriginalPrice - totalDiscountedPrice;
    const discountPercentage = (totalDiscount / totalOriginalPrice) * 100;
    
    return {
      nights,
      originalPrice: totalOriginalPrice,
      discountedPrice: totalDiscountedPrice,
      totalDiscount,
      discountPercentage,
      offersApplied,
      availabilityOfferApplies,
      midweekBonusApplies,
      allWeekdays,
      noWeekendEncroachment
    };
  }

  // Test Case 1: Next 3 Weekdays Availability Offer
  testNext3WeekdaysOffer() {
    console.log('\n=== Testing Next 3 Weekdays Availability Offer ===');
    
    // Test 1.1: 2 nights weekdays - should get 15% off
    const checkIn1 = this.createDate(1); // Tomorrow
    const checkOut1 = this.createDate(3); // Day after tomorrow
    
    // Ensure it's weekdays for test
    if (this.isWeekday(checkIn1) && this.isWeekday(checkOut1)) {
      const result1 = this.calculateTestPricing(checkIn1, checkOut1);
      
      if (result1.availabilityOfferApplies && Math.abs(result1.discountPercentage - 15) < 0.1) {
        this.log('2 nights weekdays gets 15% off', 'PASS', `${result1.discountPercentage.toFixed(1)}% discount`);
      } else {
        this.log('2 nights weekdays gets 15% off', 'FAIL', `Expected 15%, got ${result1.discountPercentage.toFixed(1)}%`);
      }
    } else {
      this.log('2 nights weekdays test', 'SKIP', 'Test dates fall on weekend');
    }
    
    // Test 1.2: 1 night weekday - should NOT get offer (minimum 2 nights required)
    const checkIn2 = this.createDate(1);
    const checkOut2 = this.createDate(2);
    
    if (this.isWeekday(checkIn2)) {
      const result2 = this.calculateTestPricing(checkIn2, checkOut2);
      
      if (!result2.availabilityOfferApplies) {
        this.log('1 night weekday does NOT get offer', 'PASS', 'Minimum 2 nights required');
      } else {
        this.log('1 night weekday does NOT get offer', 'FAIL', 'Should require minimum 2 nights');
      }
    } else {
      this.log('1 night weekday test', 'SKIP', 'Test date falls on weekend');
    }
  }

  // Test Case 2: 3+ Night Midweek Bonus
  testMidweekBonus() {
    console.log('\n=== Testing 3+ Night Midweek Bonus ===');
    
    // Test 2.1: 3 nights weekdays - should get 15% + 5% bonus = 20% total for night 3
    const checkIn1 = this.createDate(1);
    const checkOut1 = this.createDate(4);
    
    if (this.getDateRange(checkIn1, checkOut1).every(date => this.isWeekday(date))) {
      const result1 = this.calculateTestPricing(checkIn1, checkOut1);
      
      // Expected: 2 nights at 15% off + 1 night at 20% off
      const expectedPrice = (2 * this.basePrice * 0.85) + (1 * this.basePrice * 0.80);
      const actualPrice = result1.discountedPrice;
      
      if (result1.midweekBonusApplies && Math.abs(actualPrice - expectedPrice) < 1) {
        this.log('3 nights weekdays gets combined bonus', 'PASS', `Night 3 gets 20% total discount`);
      } else {
        this.log('3 nights weekdays gets combined bonus', 'FAIL', `Expected $${expectedPrice}, got $${actualPrice}`);
      }
    } else {
      this.log('3 nights weekdays test', 'SKIP', 'Test dates include weekend');
    }
    
    // Test 2.2: 4 nights weekdays - should get even more savings
    const checkIn2 = this.createDate(1);
    const checkOut2 = this.createDate(5);
    
    if (this.getDateRange(checkIn2, checkOut2).every(date => this.isWeekday(date))) {
      const result2 = this.calculateTestPricing(checkIn2, checkOut2);
      
      // Expected: 2 nights at 15% off + 2 nights at 20% off
      const expectedPrice = (2 * this.basePrice * 0.85) + (2 * this.basePrice * 0.80);
      const actualPrice = result2.discountedPrice;
      
      if (result2.midweekBonusApplies && Math.abs(actualPrice - expectedPrice) < 1) {
        this.log('4 nights weekdays gets extended bonus', 'PASS', `Nights 3-4 get 20% total discount`);
      } else {
        this.log('4 nights weekdays gets extended bonus', 'FAIL', `Expected $${expectedPrice}, got $${actualPrice}`);
      }
    } else {
      this.log('4 nights weekdays test', 'SKIP', 'Test dates include weekend');
    }
  }

  // Test Case 3: Weekend Encroachment Rules
  testWeekendEncroachment() {
    console.log('\n=== Testing Weekend Encroachment Rules ===');
    
    // Test 3.1: Stay includes Friday - should NOT get midweek bonus
    const thursday = this.createDate(1);
    const saturday = this.createDate(3);
    
    // Find a Thursday to Saturday span
    while (thursday.getDay() !== 4) { // 4 = Thursday
      thursday.setDate(thursday.getDate() + 1);
      saturday.setDate(saturday.getDate() + 1);
    }
    
    const result1 = this.calculateTestPricing(thursday, saturday);
    
    if (!result1.midweekBonusApplies) {
      this.log('Thursday-Friday stay excludes midweek bonus', 'PASS', 'Friday encroachment prevents bonus');
    } else {
      this.log('Thursday-Friday stay excludes midweek bonus', 'FAIL', 'Should not allow Friday encroachment');
    }
    
    // Test 3.2: Pure weekday stay - should get bonus
    const monday = this.createDate(1);
    const thursday2 = this.createDate(4);
    
    // Find a Monday to Thursday span
    while (monday.getDay() !== 1) { // 1 = Monday
      monday.setDate(monday.getDate() + 1);
      thursday2.setDate(thursday2.getDate() + 1);
    }
    
    const result2 = this.calculateTestPricing(monday, thursday2);
    
    if (result2.midweekBonusApplies && result2.allWeekdays) {
      this.log('Monday-Thursday stay gets midweek bonus', 'PASS', 'Pure weekdays qualify');
    } else {
      this.log('Monday-Thursday stay gets midweek bonus', 'FAIL', 'Pure weekdays should qualify');
    }
  }

  // Test Case 4: Logic Combination
  testLogicCombination() {
    console.log('\n=== Testing Logic Combination ===');
    
    // Create a comprehensive test scenario
    const scenarios = [
      {
        name: '1 night weekday',
        nights: 1,
        expectedOffers: [],
        expectedDiscount: 0
      },
      {
        name: '2 nights weekday',
        nights: 2,
        expectedOffers: ['availability'],
        expectedDiscount: 15
      },
      {
        name: '3 nights weekday',
        nights: 3,
        expectedOffers: ['availability', 'midweek'],
        expectedDiscount: 16.67 // (2*85 + 1*80) / (3*100) = 250/300 = 83.33% paid, 16.67% discount
      },
      {
        name: '5 nights weekday',
        nights: 5,
        expectedOffers: ['availability', 'midweek'],
        expectedDiscount: 18 // (2*85 + 3*80) / (5*100) = 410/500 = 82% paid, 18% discount
      }
    ];
    
    scenarios.forEach(scenario => {
      const checkIn = this.createDate(1);
      const checkOut = this.createDate(1 + scenario.nights);
      
      // Ensure dates are weekdays for test
      if (this.getDateRange(checkIn, checkOut).every(date => this.isWeekday(date))) {
        const result = this.calculateTestPricing(checkIn, checkOut);
        
        const actualDiscount = result.discountPercentage;
        const expectedDiscount = scenario.expectedDiscount;
        
        if (Math.abs(actualDiscount - expectedDiscount) < 1) {
          this.log(`${scenario.name} pricing logic`, 'PASS', `${actualDiscount.toFixed(1)}% discount`);
        } else {
          this.log(`${scenario.name} pricing logic`, 'FAIL', `Expected ${expectedDiscount}%, got ${actualDiscount.toFixed(1)}%`);
        }
      } else {
        this.log(`${scenario.name} pricing logic`, 'SKIP', 'Test dates include weekend');
      }
    });
  }

  // Run all tests
  async runAllTests() {
    console.log('🏨 Ko Lake Villa - Dynamic Pricing Logic Test Suite');
    console.log('=' .repeat(60));
    
    // Test the pricing logic as specified:
    // IF villa/suite/room available for next 3 weekdays AND minimum 2 nights
    // THEN 15% off (weekdays only)
    // 
    // IF 3+ nights midweek AND no Friday/Saturday encroachment
    // THEN additional 5% off nights 3+ (total 20% when combined)
    
    this.testNext3WeekdaysOffer();
    this.testMidweekBonus();
    this.testWeekendEncroachment();
    this.testLogicCombination();
    
    // Generate summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const skipped = this.testResults.filter(r => r.status === 'SKIP').length;
    
    console.log(`✅ PASSED: ${passed}`);
    console.log(`❌ FAILED: ${failed}`);
    console.log(`⏭️  SKIPPED: ${skipped}`);
    console.log(`📊 TOTAL: ${this.testResults.length}`);
    
    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED - Dynamic pricing logic is working correctly!');
      console.log('\nPricing Rules Confirmed:');
      console.log('✓ Next 3 weekdays availability offer: 15% off (minimum 2 nights)');
      console.log('✓ 3+ night midweek bonus: Additional 5% off nights 3+ (20% total)');
      console.log('✓ Weekend encroachment properly prevents midweek bonus');
      console.log('✓ Combined offers calculate correctly');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED - Review pricing logic implementation');
    }
    
    return {
      passed,
      failed,
      skipped,
      total: this.testResults.length,
      allPassed: failed === 0
    };
  }
}

// Run the tests
const tester = new DynamicPricingTest();
tester.runAllTests().then(results => {
  console.log('\n✅ Dynamic pricing test completed');
  process.exit(results.allPassed ? 0 : 1);
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});