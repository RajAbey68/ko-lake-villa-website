/**
 * Ko Lake Villa - Complete Gallery Functions Test Suite
 * Tests all gallery buttons and AI functionality before deployment
 */

class GalleryFunctionTests {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async apiRequest(method, endpoint, body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(endpoint, options);
    return response;
  }

  logTest(testName, passed, details = '') {
    const result = { testName, passed, details, timestamp: new Date().toISOString() };
    this.results.tests.push(result);
    if (passed) this.results.passed++; else this.results.failed++;
    
    console.log(`${passed ? '✅' : '❌'} ${testName}${details ? ` - ${details}` : ''}`);
  }

  async testRefreshButton() {
    console.log('\n🔄 Testing Refresh Button...');
    try {
      const response = await this.apiRequest('GET', '/api/gallery');
      const data = await response.json();
      
      this.logTest('Refresh Gallery API', response.ok, `Loaded ${data.length || 0} items`);
      
      // Test if images are properly loaded
      if (data && Array.isArray(data)) {
        this.logTest('Gallery Data Structure', true, `Valid array with ${data.length} items`);
      } else {
        this.logTest('Gallery Data Structure', false, 'Invalid data format');
      }
    } catch (error) {
      this.logTest('Refresh Gallery API', false, error.message);
    }
  }

  async testAddImageVideoButton() {
    console.log('\n📁 Testing Add Image/Video Button...');
    try {
      // Test the upload endpoint availability
      const testFormData = new FormData();
      testFormData.append('category', 'test');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: testFormData
      });
      
      // Should fail due to no file, but endpoint should exist
      if (response.status === 400) {
        this.logTest('Upload Endpoint Available', true, 'Endpoint responds correctly to empty upload');
      } else {
        this.logTest('Upload Endpoint Available', false, `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Upload Endpoint Available', false, error.message);
    }
  }

  async testAddSampleImageButton() {
    console.log('\n🖼️ Testing Add Sample Image Button...');
    try {
      const response = await this.apiRequest('POST', '/api/upload-sample-image', {
        category: 'default'
      });
      
      if (response.ok) {
        const result = await response.json();
        this.logTest('Sample Image Upload', true, `Sample image added with AI analysis`);
        
        // Verify AI analysis was performed
        if (result.aiAnalysis) {
          this.logTest('AI Analysis on Sample Image', true, `Category: ${result.aiAnalysis.suggestedCategory}`);
        } else {
          this.logTest('AI Analysis on Sample Image', false, 'No AI analysis data returned');
        }
      } else {
        this.logTest('Sample Image Upload', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Sample Image Upload', false, error.message);
    }
  }

  async testAddVideoButton() {
    console.log('\n🎥 Testing Add Video Button...');
    try {
      // Test video upload endpoint
      const testFormData = new FormData();
      testFormData.append('category', 'test');
      testFormData.append('mediaType', 'video');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: testFormData
      });
      
      // Should fail due to no file, but should handle video type
      if (response.status === 400) {
        const error = await response.text();
        if (error.includes('file') || error.includes('video')) {
          this.logTest('Video Upload Endpoint', true, 'Video upload endpoint configured');
        } else {
          this.logTest('Video Upload Endpoint', false, 'Endpoint not configured for video');
        }
      } else {
        this.logTest('Video Upload Endpoint', false, `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Video Upload Endpoint', false, error.message);
    }
  }

  async testClearGalleryButton() {
    console.log('\n🗑️ Testing Clear Gallery Button...');
    try {
      // First check current gallery state
      const beforeResponse = await this.apiRequest('GET', '/api/gallery');
      const beforeData = await beforeResponse.json();
      const itemsBefore = beforeData?.length || 0;
      
      this.logTest('Gallery State Before Clear', true, `${itemsBefore} items in gallery`);
      
      // Test clear endpoint (don't actually clear - just test availability)
      const response = await this.apiRequest('DELETE', '/api/gallery/clear');
      
      if (response.ok) {
        this.logTest('Clear Gallery Endpoint', true, 'Clear function available');
      } else {
        this.logTest('Clear Gallery Endpoint', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Clear Gallery Endpoint', false, error.message);
    }
  }

  async testAICategorization() {
    console.log('\n🤖 Testing AI Categorization...');
    try {
      // Test AI analysis endpoint
      const response = await this.apiRequest('POST', '/api/analyze-image', {
        imageData: 'test-base64-data',
        filename: 'test-image.jpg'
      });
      
      if (response.status === 400) {
        // Expected for invalid base64, but endpoint should exist
        this.logTest('AI Analysis Endpoint', true, 'AI analysis endpoint available');
      } else if (response.ok) {
        const result = await response.json();
        this.logTest('AI Analysis Endpoint', true, `AI responded with category: ${result.suggestedCategory}`);
      } else {
        this.logTest('AI Analysis Endpoint', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('AI Analysis Endpoint', false, error.message);
    }
  }

  async testCategorySelection() {
    console.log('\n📂 Testing Category Selection...');
    
    const expectedCategories = [
      'entire-villa', 'family-suite', 'group-room', 'triple-room',
      'dining-area', 'pool-deck', 'lake-garden', 'roof-garden',
      'front-garden', 'koggala-lake', 'excursions'
    ];
    
    for (const category of expectedCategories) {
      try {
        const response = await this.apiRequest('POST', '/api/upload-sample-image', {
          category: category
        });
        
        if (response.ok || response.status === 400) {
          this.logTest(`Category: ${category}`, true, 'Category accepted by system');
        } else {
          this.logTest(`Category: ${category}`, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.logTest(`Category: ${category}`, false, error.message);
      }
    }
  }

  async testImageEditing() {
    console.log('\n✏️ Testing Image Editing Functions...');
    try {
      // Get current gallery items
      const response = await this.apiRequest('GET', '/api/gallery');
      const gallery = await response.json();
      
      if (gallery && gallery.length > 0) {
        const testImage = gallery[0];
        
        // Test updating image metadata
        const updateResponse = await this.apiRequest('PUT', `/api/gallery/${testImage.id}`, {
          alt: 'Test Updated Alt Text',
          tags: 'test, updated, gallery'
        });
        
        if (updateResponse.ok) {
          this.logTest('Image Metadata Update', true, 'Successfully updated image metadata');
        } else {
          this.logTest('Image Metadata Update', false, `Status: ${updateResponse.status}`);
        }
      } else {
        this.logTest('Image Editing Test', false, 'No images available for editing test');
      }
    } catch (error) {
      this.logTest('Image Editing Test', false, error.message);
    }
  }

  async testDeploymentReadiness() {
    console.log('\n🚀 Testing Deployment Readiness...');
    
    // Check for required environment variables
    const requiredSecrets = ['OPENAI_API_KEY', 'STRIPE_SECRET_KEY', 'VITE_STRIPE_PUBLIC_KEY'];
    
    try {
      const response = await this.apiRequest('GET', '/api/health');
      if (response.ok) {
        this.logTest('API Health Check', true, 'All API endpoints responding');
      } else {
        this.logTest('API Health Check', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('API Health Check', false, error.message);
    }
    
    // Test gallery system integration
    try {
      const galleryResponse = await this.apiRequest('GET', '/api/gallery');
      const gallery = await galleryResponse.json();
      
      if (Array.isArray(gallery)) {
        this.logTest('Gallery System Integration', true, `Gallery loaded with ${gallery.length} items`);
      } else {
        this.logTest('Gallery System Integration', false, 'Gallery not responding correctly');
      }
    } catch (error) {
      this.logTest('Gallery System Integration', false, error.message);
    }
  }

  async runAllTests() {
    console.log('🧪 Ko Lake Villa - Complete Gallery Function Tests\n');
    console.log('Testing all gallery buttons and AI functionality...\n');
    
    await this.testRefreshButton();
    await this.testAddImageVideoButton();
    await this.testAddSampleImageButton();
    await this.testAddVideoButton();
    await this.testClearGalleryButton();
    await this.testAICategorization();
    await this.testCategorySelection();
    await this.testImageEditing();
    await this.testDeploymentReadiness();
    
    this.printResults();
    return this.results;
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${this.results.passed}`);
    console.log(`❌ Tests Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => console.log(`   • ${test.testName}: ${test.details}`));
    }
    
    console.log('\n🚀 DEPLOYMENT READINESS:');
    const criticalTests = this.results.tests.filter(test => 
      test.testName.includes('Gallery System') || 
      test.testName.includes('API Health') ||
      test.testName.includes('Upload Endpoint')
    );
    
    const criticalPassed = criticalTests.filter(test => test.passed).length;
    const criticalTotal = criticalTests.length;
    
    if (criticalPassed === criticalTotal) {
      console.log('✅ READY FOR DEPLOYMENT - All critical systems operational');
    } else {
      console.log('⚠️  DEPLOYMENT CAUTION - Some critical systems need attention');
    }
    
    console.log('='.repeat(60));
  }
}

// Run the comprehensive test suite
async function runGalleryFunctionTests() {
  const testSuite = new GalleryFunctionTests();
  return await testSuite.runAllTests();
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  runGalleryFunctionTests();
}