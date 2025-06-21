
// Ko Lake Villa - Performance & Load Testing
const axios = require('axios');
const { performance } = require('perf_hooks');

class PerformanceTestSuite {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  // API Response Time Tests
  async testApiResponseTimes() {
    const endpoints = [
      '/api/gallery',
      '/api/booking',
      '/api/contact',
      '/api/pricing'
    ];

    console.log('🚀 Testing API Response Times...');
    
    for (const endpoint of endpoints) {
      const times = [];
      
      // Test each endpoint 10 times
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        
        try {
          await axios.get(`${this.baseUrl}${endpoint}`);
          const end = performance.now();
          times.push(end - start);
        } catch (error) {
          console.error(`Error testing ${endpoint}:`, error.message);
        }
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const result = {
        endpoint,
        averageTime: Math.round(avgTime),
        minTime: Math.round(Math.min(...times)),
        maxTime: Math.round(Math.max(...times)),
        status: avgTime < 500 ? 'PASS' : 'FAIL'
      };
      
      this.results.push(result);
      console.log(`${endpoint}: ${result.averageTime}ms (${result.status})`);
    }
  }

  // Concurrent User Simulation
  async testConcurrentUsers(userCount = 50) {
    console.log(`\n🔥 Testing ${userCount} Concurrent Users...`);
    
    const startTime = performance.now();
    const promises = [];
    
    for (let i = 0; i < userCount; i++) {
      promises.push(this.simulateUserSession());
    }
    
    try {
      await Promise.all(promises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`✅ ${userCount} concurrent users completed in ${Math.round(totalTime)}ms`);
      
      this.results.push({
        test: 'Concurrent Users',
        userCount,
        totalTime: Math.round(totalTime),
        avgTimePerUser: Math.round(totalTime / userCount),
        status: totalTime < 10000 ? 'PASS' : 'FAIL'
      });
    } catch (error) {
      console.error('❌ Concurrent user test failed:', error.message);
    }
  }

  // Simulate a typical user session
  async simulateUserSession() {
    const session = [
      () => axios.get(`${this.baseUrl}/`),
      () => axios.get(`${this.baseUrl}/api/gallery`),
      () => axios.get(`${this.baseUrl}/booking`),
      () => axios.post(`${this.baseUrl}/api/contact`, {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    ];
    
    for (const request of session) {
      await request();
      // Small delay between requests to simulate real user behavior
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Database Performance Test
  async testDatabasePerformance() {
    console.log('\n💾 Testing Database Performance...');
    
    const queries = [
      'gallery-fetch',
      'booking-create',
      'booking-search',
      'analytics-data'
    ];
    
    for (const query of queries) {
      const start = performance.now();
      
      try {
        await axios.get(`${this.baseUrl}/api/test-db-performance/${query}`);
        const end = performance.now();
        const time = Math.round(end - start);
        
        this.results.push({
          test: 'Database Query',
          query,
          time,
          status: time < 200 ? 'PASS' : 'FAIL'
        });
        
        console.log(`${query}: ${time}ms`);
      } catch (error) {
        console.error(`Database test failed for ${query}:`, error.message);
      }
    }
  }

  // Memory Usage Monitoring
  async testMemoryUsage() {
    console.log('\n🧠 Testing Memory Usage...');
    
    const initialMemory = process.memoryUsage();
    
    // Perform memory-intensive operations
    await this.testConcurrentUsers(20);
    await this.testApiResponseTimes();
    
    const finalMemory = process.memoryUsage();
    
    const memoryIncrease = {
      heapUsed: Math.round((finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024),
      heapTotal: Math.round((finalMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024),
      rss: Math.round((finalMemory.rss - initialMemory.rss) / 1024 / 1024)
    };
    
    console.log('Memory increase:');
    console.log(`Heap Used: ${memoryIncrease.heapUsed}MB`);
    console.log(`Heap Total: ${memoryIncrease.heapTotal}MB`);
    console.log(`RSS: ${memoryIncrease.rss}MB`);
    
    this.results.push({
      test: 'Memory Usage',
      memoryIncrease,
      status: memoryIncrease.heapUsed < 100 ? 'PASS' : 'WARN'
    });
  }

  // Generate Performance Report
  generateReport() {
    console.log('\n📊 Performance Test Report');
    console.log('=' .repeat(50));
    
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warnCount = this.results.filter(r => r.status === 'WARN').length;
    
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⚠️  Warnings: ${warnCount}`);
    console.log(`📈 Total Tests: ${this.results.length}`);
    
    // Detailed results
    console.log('\n📋 Detailed Results:');
    this.results.forEach(result => {
      console.log(`${result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'} ${JSON.stringify(result, null, 2)}`);
    });
    
    return {
      summary: { passCount, failCount, warnCount, total: this.results.length },
      details: this.results
    };
  }

  // Run All Tests
  async runAllTests() {
    console.log('🎯 Starting Ko Lake Villa Performance Test Suite');
    console.log('=' .repeat(60));
    
    try {
      await this.testApiResponseTimes();
      await this.testConcurrentUsers(25);
      await this.testConcurrentUsers(50);
      await this.testDatabasePerformance();
      await this.testMemoryUsage();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Performance test suite failed:', error);
      throw error;
    }
  }
}

// Export for use in other test files
module.exports = PerformanceTestSuite;

// Run tests if called directly
if (require.main === module) {
  const testSuite = new PerformanceTestSuite();
  testSuite.runAllTests()
    .then(report => {
      console.log('\n🎉 Performance testing completed!');
      process.exit(report.summary.failCount > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Performance testing failed:', error);
      process.exit(1);
    });
}
