#!/usr/bin/env node

/**
 * OpenAI Integration Test Runner
 * Validates OpenAI SEO generation functionality
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.TEST_BASE_URL ? `${process.env.TEST_BASE_URL}/api/gallery/ai-seo` : 'http://localhost:3000/api/gallery/ai-seo',
  hasApiKey: !!process.env.OPENAI_API_KEY,
  maxResponseTime: 30000 // 30 seconds
};

// Test data
const TEST_SCENARIOS = [
  {
    name: 'Pool Deck - Wellness Campaign',
    data: {
      imageUrl: 'https://ko-lake-villa-website.vercel.app/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg',
      currentTitle: 'Pool Deck Area',
      currentDescription: 'Beautiful infinity pool deck with lake views',
      category: 'pool-deck',
      campaignText: 'Target wellness travelers and yoga enthusiasts seeking luxury eco-retreat experiences. Emphasize sustainability, meditation spaces, holistic wellness amenities, and mindful luxury themes.'
    },
    expectedKeywords: ['wellness', 'pool', 'lake', 'luxury', 'Ko Lake Villa']
  },
  {
    name: 'Family Suite - Family Campaign',
    data: {
      imageUrl: 'https://ko-lake-villa-website.vercel.app/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png',
      currentTitle: 'Family Suite Bedroom',
      currentDescription: 'Spacious family accommodation with comfort amenities',
      category: 'family-suite',
      campaignText: 'Target families seeking safe, spacious luxury accommodation. Emphasize family-friendly amenities, child safety features, group activities, and create memories together themes.'
    },
    expectedKeywords: ['family', 'suite', 'spacious', 'safe', 'Ko Lake Villa']
  },
  {
    name: 'Basic Generation - No Campaign',
    data: {
      imageUrl: 'https://ko-lake-villa-website.vercel.app/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg',
      currentTitle: 'Villa View',
      currentDescription: 'Beautiful villa accommodation',
      category: 'default',
      campaignText: ''
    },
    expectedKeywords: ['villa', 'luxury', 'Sri Lanka', 'Ko Lake Villa']
  }
];

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  details: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    skip: '⏭️'
  }[type] || '📋';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function validateResponse(data, scenario) {
  const issues = [];
  
  // Structure validation
  if (!data.altText) issues.push('Missing altText');
  if (!data.seoTitle) issues.push('Missing seoTitle');
  if (!data.seoDescription) issues.push('Missing seoDescription');
  if (!Array.isArray(data.suggestedTags)) issues.push('Missing or invalid suggestedTags');
  if (typeof data.confidence !== 'number') issues.push('Missing or invalid confidence');
  
  // Length validation
  if (data.altText && (data.altText.length < 20 || data.altText.length > 120)) {
    issues.push(`Alt text length invalid: ${data.altText.length} (should be 20-120)`);
  }
  
  if (data.seoTitle && (data.seoTitle.length < 30 || data.seoTitle.length > 80)) {
    issues.push(`SEO title length invalid: ${data.seoTitle.length} (should be 30-80)`);
  }
  
  if (data.seoDescription && (data.seoDescription.length < 100 || data.seoDescription.length > 200)) {
    issues.push(`SEO description length invalid: ${data.seoDescription.length} (should be 100-200)`);
  }
  
  // Content quality validation
  const allText = `${data.altText} ${data.seoTitle} ${data.seoDescription}`.toLowerCase();
  
  // Brand validation
  if (!allText.includes('ko lake villa') && !allText.includes('kolake')) {
    issues.push('Brand name not mentioned');
  }
  
  // Location validation
  const locationKeywords = ['sri lanka', 'ahangama', 'koggala'];
  const hasLocation = locationKeywords.some(keyword => allText.includes(keyword));
  if (!hasLocation) {
    issues.push('Location context missing');
  }
  
  // Keyword validation
  const foundKeywords = scenario.expectedKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  if (foundKeywords.length < Math.ceil(scenario.expectedKeywords.length * 0.4)) {
    issues.push(`Insufficient relevant keywords. Found: ${foundKeywords.join(', ')}`);
  }
  
  // Confidence validation
  if (data.confidence < 0.5) {
    issues.push(`Low confidence score: ${data.confidence}`);
  }
  
  return issues;
}

async function runSingleTest(scenario, index) {
  testResults.total++;
  
  log(`\n🧪 Test ${index + 1}: ${scenario.name}`);
  
  if (!TEST_CONFIG.hasApiKey) {
    log('Skipping - No OpenAI API key configured', 'skip');
    testResults.skipped++;
    testResults.details.push({
      test: scenario.name,
      status: 'skipped',
      reason: 'No API key'
    });
    return;
  }
  
  try {
    const startTime = Date.now();
    
    log(`Making request to: ${TEST_CONFIG.apiUrl}`);
    log(`Image URL: ${scenario.data.imageUrl}`);
    log(`Campaign: ${scenario.data.campaignText.substring(0, 50)}...`);
    
    const response = await fetch(TEST_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenario.data),
      timeout: TEST_CONFIG.maxResponseTime
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    log(`Response time: ${responseTime}ms`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Validate response
    const issues = validateResponse(data, scenario);
    
    if (issues.length === 0) {
      log(`✅ PASSED: ${scenario.name}`, 'success');
      log(`📊 Results:`, 'info');
      log(`   Alt Text: "${data.altText}"`, 'info');
      log(`   SEO Title: "${data.seoTitle}"`, 'info');
      log(`   SEO Desc: "${data.seoDescription.substring(0, 80)}..."`, 'info');
      log(`   Tags: [${data.suggestedTags.slice(0, 3).join(', ')}]`, 'info');
      log(`   Confidence: ${Math.round(data.confidence * 100)}%`, 'info');
      
      testResults.passed++;
      testResults.details.push({
        test: scenario.name,
        status: 'passed',
        responseTime,
        confidence: data.confidence,
        data
      });
    } else {
      log(`❌ FAILED: ${scenario.name}`, 'error');
      issues.forEach(issue => log(`   - ${issue}`, 'error'));
      
      testResults.failed++;
      testResults.details.push({
        test: scenario.name,
        status: 'failed',
        issues,
        responseTime,
        data
      });
    }
    
  } catch (error) {
    log(`❌ ERROR: ${scenario.name} - ${error.message}`, 'error');
    testResults.failed++;
    testResults.details.push({
      test: scenario.name,
      status: 'error',
      error: error.message
    });
  }
}

async function runValidationTests() {
  log('🔍 Running API validation tests', 'info');
  
  // Test missing fields
  const invalidRequests = [
    {},
    { imageUrl: '' },
    { currentTitle: 'Test' },
    { imageUrl: 'test.jpg' }
  ];
  
  for (const [index, invalidRequest] of invalidRequests.entries()) {
    try {
      const response = await fetch(TEST_CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidRequest),
      });
      
      if (response.status === 400) {
        log(`✅ Validation test ${index + 1} passed (400 as expected)`, 'success');
      } else {
        log(`❌ Validation test ${index + 1} failed (expected 400, got ${response.status})`, 'error');
      }
    } catch (error) {
      log(`❌ Validation test ${index + 1} error: ${error.message}`, 'error');
    }
  }
}

async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: TEST_CONFIG.baseUrl,
      hasApiKey: TEST_CONFIG.hasApiKey,
      nodeVersion: process.version
    },
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      successRate: testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0
    },
    details: testResults.details
  };
  
  // Save report to file
  const reportPath = path.join(__dirname, '../test-results', `openai-integration-${Date.now()}.json`);
  
  // Ensure directory exists
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`\n📊 Test Report Generated: ${reportPath}`, 'info');
  
  return report;
}

async function main() {
  log('🚀 Starting OpenAI Integration Tests', 'info');
  log(`Environment: ${TEST_CONFIG.baseUrl}`, 'info');
  log(`API Key Available: ${TEST_CONFIG.hasApiKey}`, 'info');
  
  // Run validation tests
  await runValidationTests();
  
  // Run main test scenarios
  log('\n🧪 Running Content Generation Tests', 'info');
  
  for (const [index, scenario] of TEST_SCENARIOS.entries()) {
    await runSingleTest(scenario, index);
    // Small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate report
  const report = await generateReport();
  
  // Print summary
  log('\n📋 TEST SUMMARY', 'info');
  log(`Total Tests: ${report.summary.total}`, 'info');
  log(`Passed: ${report.summary.passed}`, 'success');
  log(`Failed: ${report.summary.failed}`, 'error');
  log(`Skipped: ${report.summary.skipped}`, 'skip');
  log(`Success Rate: ${report.summary.successRate}%`, 'info');
  
  if (report.summary.failed > 0) {
    log('\n❌ FAILED TESTS:', 'error');
    report.details
      .filter(detail => detail.status === 'failed' || detail.status === 'error')
      .forEach(detail => {
        log(`  - ${detail.test}: ${detail.issues?.join(', ') || detail.error}`, 'error');
      });
  }
  
  if (!TEST_CONFIG.hasApiKey) {
    log('\n⚠️ NOTE: Some tests were skipped due to missing OPENAI_API_KEY', 'warning');
    log('To run complete tests, set OPENAI_API_KEY environment variable', 'warning');
  }
  
  // Exit with appropriate code
  process.exit(report.summary.failed > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`Unhandled rejection: ${error.message}`, 'error');
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { main, TEST_SCENARIOS, TEST_CONFIG }; 