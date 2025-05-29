/**
 * Ko Lake Villa - Gallery Editing Test Suite
 * Tests image editing functionality with positive, negative, and edge cases
 */

class GalleryEditingTests {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    this.baseUrl = 'http://localhost:5000';
  }

  async apiRequest(method, endpoint, body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    return { response, data: await response.json() };
  }

  logTest(testName, passed, details = '') {
    this.results.tests.push({
      name: testName,
      passed,
      details
    });
    
    if (passed) {
      this.results.passed++;
      console.log(`✅ ${testName}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${testName} - ${details}`);
    }
  }

  // Test 1: Get existing gallery images
  async testGetGalleryImages() {
    try {
      const { response, data } = await this.apiRequest('GET', '/api/gallery');
      
      if (response.ok && Array.isArray(data) && data.length > 0) {
        this.logTest('Get Gallery Images', true, `Found ${data.length} images`);
        return data;
      } else {
        this.logTest('Get Gallery Images', false, 'No images found or API error');
        return [];
      }
    } catch (error) {
      this.logTest('Get Gallery Images', false, `Error: ${error.message}`);
      return [];
    }
  }

  // Test 2: Update image with valid data
  async testValidImageUpdate(imageId) {
    try {
      const updateData = {
        alt: "Updated Test Title " + new Date().toISOString(),
        description: "Updated test description with special chars: ñ, é, ü",
        category: "family-suite",
        tags: "updated, test, editing",
        featured: true
      };

      const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${imageId}`, updateData);
      
      if (response.ok) {
        this.logTest('Valid Image Update', true, 'Successfully updated image data');
        return data;
      } else {
        this.logTest('Valid Image Update', false, `API error: ${response.status}`);
        return null;
      }
    } catch (error) {
      this.logTest('Valid Image Update', false, `Error: ${error.message}`);
      return null;
    }
  }

  // Test 3: Update with empty/invalid data
  async testInvalidImageUpdate(imageId) {
    try {
      const invalidData = {
        alt: "", // Empty title
        description: null, // Null description
        category: "invalid-category", // Invalid category
        tags: "",
        featured: "not-boolean" // Invalid boolean
      };

      const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${imageId}`, invalidData);
      
      // Should either succeed with validation or fail gracefully
      if (response.ok || response.status === 400) {
        this.logTest('Invalid Data Handling', true, 'API handled invalid data appropriately');
      } else {
        this.logTest('Invalid Data Handling', false, `Unexpected response: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Invalid Data Handling', true, 'Error caught as expected');
    }
  }

  // Test 4: Update non-existent image
  async testNonExistentImageUpdate() {
    try {
      const updateData = {
        alt: "Test Update",
        description: "Test description",
        category: "family-suite",
        tags: "test",
        featured: false
      };

      const { response, data } = await this.apiRequest('PATCH', '/api/admin/gallery/99999', updateData);
      
      if (response.status === 404) {
        this.logTest('Non-existent Image Update', true, '404 error returned as expected');
      } else {
        this.logTest('Non-existent Image Update', false, `Expected 404, got ${response.status}`);
      }
    } catch (error) {
      this.logTest('Non-existent Image Update', false, `Error: ${error.message}`);
    }
  }

  // Test 5: Special characters and unicode
  async testSpecialCharacters(imageId) {
    try {
      const specialData = {
        alt: "Test with émojis 🏝️ and ñañá characters",
        description: "Description with unicode: 中文, العربية, русский",
        category: "koggala-lake",
        tags: "unicode, émojis, 中文, test",
        featured: false
      };

      const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${imageId}`, specialData);
      
      if (response.ok) {
        this.logTest('Special Characters', true, 'Unicode and special characters handled');
      } else {
        this.logTest('Special Characters', false, `Failed with status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Special Characters', false, `Error: ${error.message}`);
    }
  }

  // Test 6: Very long strings
  async testLongStrings(imageId) {
    try {
      const longData = {
        alt: "Very long title ".repeat(20), // ~300 chars
        description: "Very long description with lots of text ".repeat(50), // ~1500 chars
        category: "experiences",
        tags: "tag1,tag2,tag3,tag4,tag5,tag6,tag7,tag8,tag9,tag10".repeat(5), // Very long tags
        featured: false
      };

      const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${imageId}`, longData);
      
      if (response.ok || response.status === 400) {
        this.logTest('Long Strings', true, 'Long strings handled appropriately');
      } else {
        this.logTest('Long Strings', false, `Unexpected response: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Long Strings', true, 'Error handling for long strings works');
    }
  }

  // Test 7: Verify data persistence
  async testDataPersistence(imageId, originalData) {
    try {
      // Wait a moment for data to persist
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { response, data } = await this.apiRequest('GET', '/api/gallery');
      
      if (response.ok && Array.isArray(data)) {
        const updatedImage = data.find(img => img.id === imageId);
        
        if (updatedImage && updatedImage.alt !== originalData.alt) {
          this.logTest('Data Persistence', true, 'Changes were saved and persisted');
        } else {
          this.logTest('Data Persistence', false, 'Changes were not persisted');
        }
      } else {
        this.logTest('Data Persistence', false, 'Could not verify persistence');
      }
    } catch (error) {
      this.logTest('Data Persistence', false, `Error: ${error.message}`);
    }
  }

  // Test 8: Concurrent updates
  async testConcurrentUpdates(imageId) {
    try {
      const update1 = this.apiRequest('PATCH', `/api/admin/gallery/${imageId}`, {
        alt: "Concurrent Update 1",
        description: "First update",
        category: "family-suite",
        tags: "concurrent1",
        featured: true
      });

      const update2 = this.apiRequest('PATCH', `/api/admin/gallery/${imageId}`, {
        alt: "Concurrent Update 2", 
        description: "Second update",
        category: "triple-room",
        tags: "concurrent2",
        featured: false
      });

      const [result1, result2] = await Promise.all([update1, update2]);
      
      if (result1.response.ok && result2.response.ok) {
        this.logTest('Concurrent Updates', true, 'Both concurrent updates succeeded');
      } else if (result1.response.ok || result2.response.ok) {
        this.logTest('Concurrent Updates', true, 'One update succeeded, race condition handled');
      } else {
        this.logTest('Concurrent Updates', false, 'Both updates failed');
      }
    } catch (error) {
      this.logTest('Concurrent Updates', false, `Error: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log("🧪 Starting Ko Lake Villa Gallery Editing Tests...\n");
    
    // Get gallery images first
    const images = await this.testGetGalleryImages();
    
    if (images.length === 0) {
      console.log("❌ No images found - cannot run editing tests");
      return this.printResults();
    }

    const testImage = images[0];
    const originalData = { ...testImage };
    
    console.log(`\nTesting with image ID: ${testImage.id}`);
    console.log(`Original title: "${testImage.alt}"\n`);

    // Run all editing tests
    await this.testValidImageUpdate(testImage.id);
    await this.testInvalidImageUpdate(testImage.id);
    await this.testNonExistentImageUpdate();
    await this.testSpecialCharacters(testImage.id);
    await this.testLongStrings(testImage.id);
    await this.testDataPersistence(testImage.id, originalData);
    await this.testConcurrentUpdates(testImage.id);

    this.printResults();
  }

  printResults() {
    console.log("\n" + "=".repeat(50));
    console.log("📊 GALLERY EDITING TEST RESULTS");
    console.log("=".repeat(50));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${(this.results.passed / (this.results.passed + this.results.failed) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log("\n❌ Failed Tests:");
      this.results.tests.filter(t => !t.passed).forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
    }
    
    console.log("\n🎯 Recommendations:");
    if (this.results.failed === 0) {
      console.log("   • Gallery editing functionality is working perfectly!");
      console.log("   • Ready for production use");
    } else {
      console.log("   • Review failed tests and fix any issues");
      console.log("   • Ensure proper error handling for edge cases");
    }
  }
}

// Run the tests
async function main() {
  const testSuite = new GalleryEditingTests();
  await testSuite.runAllTests();
}

// Execute if run directly
if (typeof window === 'undefined') {
  main().catch(console.error);
}

module.exports = { GalleryEditingTests };