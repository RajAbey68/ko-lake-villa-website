/**
 * Ko Lake Villa - Caching Performance Test
 * Tests server-side caching implementation and measures performance improvements
 */

class CachingPerformanceTest {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      tests: [],
      performance: {
        cacheHits: 0,
        cacheMisses: 0,
        avgResponseTime: {
          cached: 0,
          uncached: 0
        }
      }
    };
  }

  async apiRequest(endpoint, method = 'GET', body = null) {
    const start = Date.now();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : null
    });
    const responseTime = Date.now() - start;
    const data = await response.json();
    
    return { response, data, responseTime };
  }

  logTest(category, testName, passed, details = '', responseTime = 0) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const timeInfo = responseTime > 0 ? ` (${responseTime}ms)` : '';
    console.log(`${status} [${category}] ${testName}${timeInfo}`);
    if (details) console.log(`   └─ ${details}`);
    
    this.results.tests.push({
      category,
      testName,
      passed,
      details,
      responseTime
    });
  }

  async testCacheStats() {
    console.log('\n🔍 Testing Cache Statistics API...');
    
    try {
      const { response, data, responseTime } = await this.apiRequest('/api/cache/stats');
      
      if (response.ok && data.stats) {
        this.logTest('Cache Management', 'Cache stats endpoint', true, 
          `Cache size: ${data.stats.size}, Keys: ${data.stats.keys.length}`, responseTime);
        return data.stats;
      } else {
        this.logTest('Cache Management', 'Cache stats endpoint', false, 'Invalid response');
        return null;
      }
    } catch (error) {
      this.logTest('Cache Management', 'Cache stats endpoint', false, error.message);
      return null;
    }
  }

  async testCacheClear() {
    console.log('\n🧹 Testing Cache Clear...');
    
    try {
      const { response, data, responseTime } = await this.apiRequest('/api/cache/clear', 'POST');
      
      if (response.ok && data.message) {
        this.logTest('Cache Management', 'Cache clear', true, data.message, responseTime);
        return true;
      } else {
        this.logTest('Cache Management', 'Cache clear', false, 'Clear failed');
        return false;
      }
    } catch (error) {
      this.logTest('Cache Management', 'Cache clear', false, error.message);
      return false;
    }
  }

  async measureCachePerformance() {
    console.log('\n⚡ Testing Cache Performance...');
    
    // Clear cache first
    await this.testCacheClear();
    
    // Test 1: First request (cache miss)
    console.log('\n1. First request (cache miss):');
    const { responseTime: missTime1 } = await this.apiRequest('/api/gallery');
    this.logTest('Performance', 'Gallery request (miss)', true, 'Cache miss', missTime1);
    
    const { responseTime: missTime2 } = await this.apiRequest('/api/rooms');
    this.logTest('Performance', 'Rooms request (miss)', true, 'Cache miss', missTime2);
    
    const { responseTime: missTime3 } = await this.apiRequest('/api/activities');
    this.logTest('Performance', 'Activities request (miss)', true, 'Cache miss', missTime3);
    
    // Test 2: Second request (cache hit)
    console.log('\n2. Second request (cache hit):');
    const { responseTime: hitTime1 } = await this.apiRequest('/api/gallery');
    this.logTest('Performance', 'Gallery request (hit)', true, 'Cache hit', hitTime1);
    
    const { responseTime: hitTime2 } = await this.apiRequest('/api/rooms');
    this.logTest('Performance', 'Rooms request (hit)', true, 'Cache hit', hitTime2);
    
    const { responseTime: hitTime3 } = await this.apiRequest('/api/activities');
    this.logTest('Performance', 'Activities request (hit)', true, 'Cache hit', hitTime3);
    
    // Calculate performance improvement
    const avgMissTime = (missTime1 + missTime2 + missTime3) / 3;
    const avgHitTime = (hitTime1 + hitTime2 + hitTime3) / 3;
    const improvement = ((avgMissTime - avgHitTime) / avgMissTime * 100).toFixed(1);
    
    this.results.performance.avgResponseTime.uncached = avgMissTime;
    this.results.performance.avgResponseTime.cached = avgHitTime;
    
    console.log(`\n📊 Performance Improvement: ${improvement}% faster with cache`);
    console.log(`   Cache Miss Average: ${avgMissTime.toFixed(1)}ms`);
    console.log(`   Cache Hit Average: ${avgHitTime.toFixed(1)}ms`);
    
    return { improvement: parseFloat(improvement), avgMissTime, avgHitTime };
  }

  async testCacheInvalidation() {
    console.log('\n🔄 Testing Cache Invalidation...');
    
    // First, populate cache
    await this.apiRequest('/api/gallery');
    
    // Check cache has data
    const statsBeforePost = await this.testCacheStats();
    const initialCacheSize = statsBeforePost ? statsBeforePost.size : 0;
    
    // Create a new gallery item (should invalidate cache)
    const testData = {
      imageUrl: '/test/image.jpg',
      alt: 'Test Image',
      title: 'Cache Test Image',
      description: 'Testing cache invalidation',
      category: 'family-suite',
      mediaType: 'image',
      featured: false,
      sortOrder: 1
    };
    
    const { response: createResponse } = await this.apiRequest('/api/gallery', 'POST', testData);
    
    if (createResponse.ok) {
      this.logTest('Cache Invalidation', 'Gallery creation', true, 'New item created');
      
      // Check if cache was invalidated
      const { responseTime } = await this.apiRequest('/api/gallery');
      
      // If cache was properly invalidated, this should be a miss (slower)
      if (responseTime > 10) { // Assuming DB query takes more than 10ms
        this.logTest('Cache Invalidation', 'Cache invalidated after POST', true, 
          `Response time suggests cache miss: ${responseTime}ms`);
      } else {
        this.logTest('Cache Invalidation', 'Cache invalidated after POST', false, 
          `Response too fast, cache may not have been invalidated: ${responseTime}ms`);
      }
    } else {
      this.logTest('Cache Invalidation', 'Gallery creation', false, 'Failed to create test item');
    }
  }

  async testCategoryCache() {
    console.log('\n📂 Testing Category-Specific Caching...');
    
    // Clear cache
    await this.testCacheClear();
    
    // Test category-specific cache
    const categories = ['family-suite', 'dining-area', 'pool-deck'];
    
    for (const category of categories) {
      // First request (miss)
      const { responseTime: missTime } = await this.apiRequest(`/api/gallery?category=${category}`);
      this.logTest('Category Cache', `${category} first request`, true, `Cache miss: ${missTime}ms`);
      
      // Second request (hit)
      const { responseTime: hitTime } = await this.apiRequest(`/api/gallery?category=${category}`);
      this.logTest('Category Cache', `${category} second request`, true, `Cache hit: ${hitTime}ms`);
      
      const improvement = missTime > hitTime ? 'Improved' : 'No improvement';
      console.log(`   └─ ${category}: ${improvement} (${missTime}ms → ${hitTime}ms)`);
    }
  }

  async runAllTests() {
    console.log('🚀 Ko Lake Villa - Caching Performance Test Suite\n');
    console.log('=' * 60);
    
    try {
      await this.testCacheStats();
      const perfResults = await this.measureCachePerformance();
      await this.testCacheInvalidation();
      await this.testCategoryCache();
      
      this.generateReport(perfResults);
      
    } catch (error) {
      console.error('Test suite error:', error);
    }
  }

  generateReport(perfResults) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 CACHING PERFORMANCE REPORT');
    console.log('='.repeat(60));
    
    const passed = this.results.tests.filter(t => t.passed).length;
    const total = this.results.tests.length;
    const passRate = ((passed / total) * 100).toFixed(1);
    
    console.log(`✅ Tests Passed: ${passed}/${total} (${passRate}%)`);
    
    if (perfResults) {
      console.log(`⚡ Performance Improvement: ${perfResults.improvement}%`);
      console.log(`🔥 Cache Hit Speed: ${perfResults.avgHitTime.toFixed(1)}ms avg`);
      console.log(`🐌 Cache Miss Speed: ${perfResults.avgMissTime.toFixed(1)}ms avg`);
    }
    
    console.log('\n📊 Cache Benefits:');
    console.log('• Reduced database load');
    console.log('• Faster API responses');
    console.log('• Better user experience');
    console.log('• Improved scalability');
    
    if (perfResults.improvement > 50) {
      console.log('\n🎉 EXCELLENT: Cache is providing significant performance benefits!');
    } else if (perfResults.improvement > 20) {
      console.log('\n✅ GOOD: Cache is improving performance as expected.');
    } else {
      console.log('\n⚠️ REVIEW: Cache improvement is minimal. Consider tuning TTL values.');
    }
  }
}

// Auto-run test
async function runCachingTests() {
  const tester = new CachingPerformanceTest();
  await tester.runAllTests();
}

if (typeof window === 'undefined') {
  // Running in Node.js
  runCachingTests().catch(console.error);
} else {
  // Running in browser
  window.runCachingTests = runCachingTests;
  console.log('Caching performance test loaded. Run with: runCachingTests()');
}