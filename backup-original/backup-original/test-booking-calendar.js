// Ko Lake Villa - Booking Calendar Integrity Test Suite
// Tests room availability, prevents double bookings, and suggests alternatives

class BookingCalendarTests {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.testResults = [];
  }

  async apiRequest(method, endpoint, body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    return response;
  }

  logTest(testName, passed, details = '') {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}`);
    if (details) console.log(`   ${details}`);
    this.testResults.push({ testName, passed, details });
  }

  // Test 1: Basic room availability check
  async testRoomAvailability() {
    try {
      const response = await this.apiRequest('GET', '/api/rooms');
      const rooms = await response.json();
      
      const hasKLV = rooms.some(room => room.name === 'Entire Villa (KLV)');
      const hasKLV1 = rooms.some(room => room.name === 'Master Family Suite (KLV1)');
      const hasKLV3 = rooms.some(room => room.name === 'Triple/Twin Rooms (KLV3)');
      const hasKLV6 = rooms.some(room => room.name === 'Group Room (KLV6)');
      
      const allRoomsPresent = hasKLV && hasKLV1 && hasKLV3 && hasKLV6;
      
      this.logTest(
        'Room Inventory Check', 
        allRoomsPresent,
        `Found: KLV(${hasKLV}), KLV1(${hasKLV1}), KLV3(${hasKLV3}), KLV6(${hasKLV6})`
      );
      
      return allRoomsPresent;
    } catch (error) {
      this.logTest('Room Inventory Check', false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 2: Booking submission validation
  async testBookingSubmission() {
    try {
      const bookingData = {
        checkInDate: '2025-07-15',
        checkOutDate: '2025-07-20',
        guests: '4',
        roomType: 'Master Family Suite (KLV1)',
        name: 'Test Guest',
        email: 'test@example.com',
        specialRequests: 'Test booking for calendar integrity'
      };

      const response = await this.apiRequest('POST', '/api/booking', bookingData);
      const result = await response.json();
      
      this.logTest(
        'Booking Submission', 
        response.ok,
        `Status: ${response.status}, Response: ${JSON.stringify(result)}`
      );
      
      return response.ok;
    } catch (error) {
      this.logTest('Booking Submission', false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 3: Check for double booking prevention
  async testDoubleBookingPrevention() {
    try {
      // First booking
      const booking1 = {
        checkInDate: '2025-08-01',
        checkOutDate: '2025-08-05',
        guests: '2',
        roomType: 'Master Family Suite (KLV1)',
        name: 'First Guest',
        email: 'first@example.com'
      };

      // Overlapping booking (should be prevented)
      const booking2 = {
        checkInDate: '2025-08-03',
        checkOutDate: '2025-08-07',
        guests: '2',
        roomType: 'Master Family Suite (KLV1)',
        name: 'Second Guest',
        email: 'second@example.com'
      };

      const response1 = await this.apiRequest('POST', '/api/booking', booking1);
      const response2 = await this.apiRequest('POST', '/api/booking', booking2);
      
      // Second booking should be prevented or flagged
      const preventedDoubleBooking = response1.ok && (!response2.ok || response2.status === 409);
      
      this.logTest(
        'Double Booking Prevention',
        preventedDoubleBooking,
        `First: ${response1.status}, Second: ${response2.status}`
      );
      
      return preventedDoubleBooking;
    } catch (error) {
      this.logTest('Double Booking Prevention', false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 4: Villa booking blocks all individual rooms
  async testVillaBookingExclusivity() {
    try {
      const villaBooking = {
        checkInDate: '2025-09-01',
        checkOutDate: '2025-09-05',
        guests: '20',
        roomType: 'Entire Villa (KLV)',
        name: 'Villa Guest',
        email: 'villa@example.com'
      };

      const individualRoomBooking = {
        checkInDate: '2025-09-02',
        checkOutDate: '2025-09-04',
        guests: '2',
        roomType: 'Master Family Suite (KLV1)',
        name: 'Individual Guest',
        email: 'individual@example.com'
      };

      const villaResponse = await this.apiRequest('POST', '/api/booking', villaBooking);
      const roomResponse = await this.apiRequest('POST', '/api/booking', individualRoomBooking);
      
      // Individual room booking should be blocked when villa is booked
      const exclusivityWorking = villaResponse.ok && !roomResponse.ok;
      
      this.logTest(
        'Villa Booking Exclusivity',
        exclusivityWorking,
        `Villa: ${villaResponse.status}, Room: ${roomResponse.status}`
      );
      
      return exclusivityWorking;
    } catch (error) {
      this.logTest('Villa Booking Exclusivity', false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 5: Get current availability and suggest alternatives
  async testAvailabilityAndSuggestions() {
    try {
      // Test availability endpoint
      const availabilityResponse = await this.apiRequest('GET', '/api/availability?checkIn=2025-08-01&checkOut=2025-08-05');
      
      if (availabilityResponse.ok) {
        const availability = await availabilityResponse.json();
        this.logTest(
          'Availability Check',
          true,
          `Availability data: ${JSON.stringify(availability)}`
        );
        return true;
      } else {
        // If endpoint doesn't exist, that's what we need to fix
        this.logTest(
          'Availability Check',
          false,
          'Availability endpoint not implemented - needs creation'
        );
        return false;
      }
    } catch (error) {
      this.logTest('Availability Check', false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 6: Guest capacity validation
  async testGuestCapacityValidation() {
    try {
      const oversizedBooking = {
        checkInDate: '2025-10-01',
        checkOutDate: '2025-10-05',
        guests: '30', // More than villa capacity (25)
        roomType: 'Entire Villa (KLV)',
        name: 'Large Group',
        email: 'large@example.com'
      };

      const response = await this.apiRequest('POST', '/api/booking', oversizedBooking);
      
      // Should reject or warn about capacity
      const capacityValidated = !response.ok || response.status === 400;
      
      this.logTest(
        'Guest Capacity Validation',
        capacityValidated,
        `Status: ${response.status} for 30 guests in villa (max 25)`
      );
      
      return capacityValidated;
    } catch (error) {
      this.logTest('Guest Capacity Validation', false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 7: Date validation
  async testDateValidation() {
    try {
      const pastDateBooking = {
        checkInDate: '2024-01-01', // Past date
        checkOutDate: '2024-01-05',
        guests: '2',
        roomType: 'Master Family Suite (KLV1)',
        name: 'Past Guest',
        email: 'past@example.com'
      };

      const response = await this.apiRequest('POST', '/api/booking', pastDateBooking);
      
      // Should reject past dates
      const dateValidated = !response.ok || response.status === 400;
      
      this.logTest(
        'Date Validation',
        dateValidated,
        `Status: ${response.status} for past date booking`
      );
      
      return dateValidated;
    } catch (error) {
      this.logTest('Date Validation', false, `Error: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Ko Lake Villa Booking Calendar Integrity Tests\n');
    
    const tests = [
      () => this.testRoomAvailability(),
      () => this.testBookingSubmission(),
      () => this.testDoubleBookingPrevention(),
      () => this.testVillaBookingExclusivity(),
      () => this.testAvailabilityAndSuggestions(),
      () => this.testGuestCapacityValidation(),
      () => this.testDateValidation()
    ];

    for (const test of tests) {
      await test();
    }

    this.printResults();
  }

  printResults() {
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => r.passed === false).length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(1);

    console.log('\n==================================================');
    console.log('🏁 BOOKING CALENDAR TEST RESULTS');
    console.log('==================================================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${total}`);
    console.log(`📈 Success Rate: ${successRate}%`);

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => console.log(`   - ${r.testName}: ${r.details}`));
      
      console.log('\n🔧 FIXES NEEDED:');
      console.log('   1. Implement /api/availability endpoint');
      console.log('   2. Add booking conflict validation');
      console.log('   3. Create calendar integrity checks');
      console.log('   4. Add alternative date suggestions');
    } else {
      console.log('\n🚀 ALL BOOKING TESTS PASSED - CALENDAR INTEGRITY VERIFIED!');
    }
  }
}

// Run the tests
async function main() {
  const tester = new BookingCalendarTests();
  await tester.runAllTests();
}

main().catch(console.error);