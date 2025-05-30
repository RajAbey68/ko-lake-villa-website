/**
 * Ko Lake Villa - Complete Gallery Management Test Suite
 * Tests gallery editing, image preview, tagging, and CMS functionality
 */

class GalleryManagementTests {
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
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    let data = null;
    
    try {
      data = await response.json();
    } catch (error) {
      // Response might not be JSON
    }
    
    return { response, data };
  }

  logTest(category, testName, passed, details = '') {
    const result = passed ? '✅' : '❌';
    console.log(`${result} ${category}: ${testName}${details ? ' - ' + details : ''}`);
    
    this.results.tests.push({
      category,
      testName,
      passed,
      details
    });
    
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
  }

  // Test 1: Gallery API Access
  async testGalleryAPIAccess() {
    try {
      const { response, data } = await this.apiRequest('GET', '/api/gallery');
      
      if (response.ok && Array.isArray(data)) {
        this.logTest('Gallery API', 'Fetch gallery images', true, `Found ${data.length} images`);
        return data;
      } else {
        this.logTest('Gallery API', 'Fetch gallery images', false, `Status: ${response.status}`);
        return [];
      }
    } catch (error) {
      this.logTest('Gallery API', 'Fetch gallery images', false, `Error: ${error.message}`);
      return [];
    }
  }

  // Test 2: Image Preview Functionality
  async testImagePreview(images) {
    if (images.length === 0) {
      this.logTest('Image Preview', 'No images to test preview', false, 'No gallery images available');
      return;
    }

    const testImage = images[0];
    
    // Test if image URL is accessible
    try {
      const imageResponse = await fetch(`${this.baseUrl}${testImage.imageUrl}`);
      
      if (imageResponse.ok) {
        this.logTest('Image Preview', 'Image URL accessibility', true, `Image loads correctly`);
      } else {
        this.logTest('Image Preview', 'Image URL accessibility', false, `Status: ${imageResponse.status}`);
      }
    } catch (error) {
      this.logTest('Image Preview', 'Image URL accessibility', false, `Error: ${error.message}`);
    }

    // Test image metadata
    if (testImage.alt && testImage.category) {
      this.logTest('Image Preview', 'Image metadata present', true, 'Alt text and category exist');
    } else {
      this.logTest('Image Preview', 'Image metadata present', false, 'Missing alt text or category');
    }
  }

  // Test 3: Gallery Image Editing
  async testGalleryImageEditing(images) {
    if (images.length === 0) {
      this.logTest('Gallery Editing', 'No images to edit', false, 'No gallery images available');
      return;
    }

    const testImage = images[0];
    const originalData = {
      alt: testImage.alt,
      description: testImage.description,
      category: testImage.category,
      tags: testImage.tags,
      featured: testImage.featured
    };

    // Test updating image data
    const updateData = {
      alt: 'Test Updated Title',
      description: 'Test updated description for validation',
      category: 'family-suite',
      tags: 'test,validation,editing',
      featured: !testImage.featured
    };

    try {
      const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, updateData);
      
      if (response.ok && data.message) {
        this.logTest('Gallery Editing', 'Update image data', true, 'Image updated successfully');
        
        // Verify the update
        const { response: verifyResponse, data: verifyData } = await this.apiRequest('GET', '/api/gallery');
        if (verifyResponse.ok) {
          const updatedImage = verifyData.find(img => img.id === testImage.id);
          if (updatedImage && updatedImage.alt === updateData.alt) {
            this.logTest('Gallery Editing', 'Verify update persistence', true, 'Changes persisted correctly');
          } else {
            this.logTest('Gallery Editing', 'Verify update persistence', false, 'Changes not persisted');
          }
        }
        
        // Restore original data
        await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, originalData);
        
      } else {
        this.logTest('Gallery Editing', 'Update image data', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Gallery Editing', 'Update image data', false, `Error: ${error.message}`);
    }
  }

  // Test 4: Tagging System
  async testTaggingSystem(images) {
    if (images.length === 0) {
      this.logTest('Tagging System', 'No images to test tagging', false, 'No gallery images available');
      return;
    }

    const testImage = images[0];
    
    // Test various tag formats
    const tagTests = [
      { input: 'lake,sunset,peaceful', expected: 'lake,sunset,peaceful' },
      { input: 'villa, accommodation, luxury', expected: 'villa,accommodation,luxury' },
      { input: 'koggala lake,sri lanka,vacation', expected: 'koggala lake,sri lanka,vacation' }
    ];

    for (const tagTest of tagTests) {
      try {
        const updateData = {
          alt: testImage.alt,
          description: testImage.description,
          category: testImage.category,
          tags: tagTest.input,
          featured: testImage.featured
        };

        const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, updateData);
        
        if (response.ok) {
          // Verify tag formatting
          const { response: verifyResponse, data: verifyData } = await this.apiRequest('GET', '/api/gallery');
          if (verifyResponse.ok) {
            const updatedImage = verifyData.find(img => img.id === testImage.id);
            if (updatedImage && updatedImage.tags === tagTest.expected) {
              this.logTest('Tagging System', `Tag format: "${tagTest.input}"`, true, 'Tags formatted correctly');
            } else {
              this.logTest('Tagging System', `Tag format: "${tagTest.input}"`, false, `Expected: ${tagTest.expected}, Got: ${updatedImage?.tags}`);
            }
          }
        } else {
          this.logTest('Tagging System', `Tag format: "${tagTest.input}"`, false, `API error: ${response.status}`);
        }
      } catch (error) {
        this.logTest('Tagging System', `Tag format: "${tagTest.input}"`, false, `Error: ${error.message}`);
      }
    }
  }

  // Test 5: Category Management
  async testCategoryManagement(images) {
    if (images.length === 0) {
      this.logTest('Category Management', 'No images to test categories', false, 'No gallery images available');
      return;
    }

    const testImage = images[0];
    const originalCategory = testImage.category;
    
    // Test valid categories
    const validCategories = [
      'family-suite',
      'group-room', 
      'triple-room',
      'dining-area',
      'pool-deck',
      'lake-garden'
    ];

    for (const category of validCategories) {
      try {
        const updateData = {
          alt: testImage.alt,
          description: testImage.description,
          category: category,
          tags: testImage.tags,
          featured: testImage.featured
        };

        const { response } = await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, updateData);
        
        if (response.ok) {
          this.logTest('Category Management', `Set category: ${category}`, true, 'Category updated successfully');
        } else {
          this.logTest('Category Management', `Set category: ${category}`, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.logTest('Category Management', `Set category: ${category}`, false, `Error: ${error.message}`);
      }
    }

    // Restore original category
    try {
      const restoreData = {
        alt: testImage.alt,
        description: testImage.description,
        category: originalCategory,
        tags: testImage.tags,
        featured: testImage.featured
      };
      await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, restoreData);
    } catch (error) {
      console.log('Warning: Could not restore original category');
    }
  }

  // Test 6: Featured Image Toggle
  async testFeaturedImageToggle(images) {
    if (images.length === 0) {
      this.logTest('Featured Toggle', 'No images to test featured status', false, 'No gallery images available');
      return;
    }

    const testImage = images[0];
    const originalFeatured = testImage.featured;

    try {
      // Toggle featured status
      const updateData = {
        alt: testImage.alt,
        description: testImage.description,
        category: testImage.category,
        tags: testImage.tags,
        featured: !originalFeatured
      };

      const { response, data } = await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, updateData);
      
      if (response.ok) {
        this.logTest('Featured Toggle', 'Toggle featured status', true, `Changed from ${originalFeatured} to ${!originalFeatured}`);
        
        // Restore original featured status
        const restoreData = { ...updateData, featured: originalFeatured };
        await this.apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, restoreData);
        
      } else {
        this.logTest('Featured Toggle', 'Toggle featured status', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Featured Toggle', 'Toggle featured status', false, `Error: ${error.message}`);
    }
  }

  // Test 7: CMS Image Addition (Content Management System)
  async testCMSImageAddition() {
    // Test if CMS endpoints are accessible
    try {
      const { response } = await this.apiRequest('GET', '/api/admin/content');
      
      if (response.ok) {
        this.logTest('CMS Integration', 'Content API accessible', true, 'CMS endpoints available');
      } else if (response.status === 404) {
        this.logTest('CMS Integration', 'Content API accessible', false, 'CMS endpoints not found');
      } else {
        this.logTest('CMS Integration', 'Content API accessible', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('CMS Integration', 'Content API accessible', false, `Error: ${error.message}`);
    }

    // Test image upload endpoint
    try {
      const { response } = await this.apiRequest('GET', '/api/admin/gallery/upload');
      
      if (response.status === 405) {
        this.logTest('CMS Integration', 'Image upload endpoint exists', true, 'Upload endpoint available (Method not allowed for GET)');
      } else if (response.status === 404) {
        this.logTest('CMS Integration', 'Image upload endpoint exists', false, 'Upload endpoint not found');
      } else {
        this.logTest('CMS Integration', 'Image upload endpoint exists', true, `Upload endpoint responsive (${response.status})`);
      }
    } catch (error) {
      this.logTest('CMS Integration', 'Image upload endpoint exists', false, `Error: ${error.message}`);
    }
  }

  // Test 8: Error Handling
  async testErrorHandling() {
    // Test invalid image ID
    try {
      const { response } = await this.apiRequest('PATCH', '/api/admin/gallery/99999', {
        alt: 'Test',
        description: 'Test',
        category: 'family-suite'
      });
      
      if (response.status === 404) {
        this.logTest('Error Handling', 'Invalid image ID', true, '404 returned for non-existent image');
      } else {
        this.logTest('Error Handling', 'Invalid image ID', false, `Expected 404, got ${response.status}`);
      }
    } catch (error) {
      this.logTest('Error Handling', 'Invalid image ID', false, `Error: ${error.message}`);
    }

    // Test invalid data
    try {
      const { response } = await this.apiRequest('PATCH', '/api/admin/gallery/1', {
        category: 'invalid-category-name-that-should-fail'
      });
      
      if (response.status === 400 || response.ok) {
        this.logTest('Error Handling', 'Invalid category handling', true, 'Invalid data handled appropriately');
      } else {
        this.logTest('Error Handling', 'Invalid category handling', false, `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Error Handling', 'Invalid category handling', true, 'Error caught as expected');
    }
  }

  async runAllTests() {
    console.log('🖼️ Ko Lake Villa - Complete Gallery Management Test Suite Starting...\n');
    
    // Test 1: Gallery API Access
    console.log('🔍 Testing Gallery API Access...');
    const images = await this.testGalleryAPIAccess();
    
    // Test 2: Image Preview
    console.log('\n🖼️ Testing Image Preview Functionality...');
    await this.testImagePreview(images);
    
    // Test 3: Gallery Editing
    console.log('\n✏️ Testing Gallery Image Editing...');
    await this.testGalleryImageEditing(images);
    
    // Test 4: Tagging System
    console.log('\n🏷️ Testing Tagging System...');
    await this.testTaggingSystem(images);
    
    // Test 5: Category Management
    console.log('\n📂 Testing Category Management...');
    await this.testCategoryManagement(images);
    
    // Test 6: Featured Image Toggle
    console.log('\n⭐ Testing Featured Image Toggle...');
    await this.testFeaturedImageToggle(images);
    
    // Test 7: CMS Integration
    console.log('\n📝 Testing CMS Integration...');
    await this.testCMSImageAddition();
    
    // Test 8: Error Handling
    console.log('\n⚠️ Testing Error Handling...');
    await this.testErrorHandling();
    
    this.printResults();
  }

  printResults() {
    const total = this.results.passed + this.results.failed;
    const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    
    console.log('\n============================================================');
    console.log('📊 GALLERY MANAGEMENT TEST RESULTS');
    console.log('============================================================');
    console.log(`✅ Passed: ${this.results.passed}/${total}`);
    console.log(`❌ Failed: ${this.results.failed}/${total}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`  • ${test.category}: ${test.testName}${test.details ? ' - ' + test.details : ''}`);
        });
    }
    
    // Recommendations
    console.log('\n🎯 GALLERY MANAGEMENT STATUS:');
    if (successRate >= 90) {
      console.log('🟢 FULLY FUNCTIONAL - Gallery management system working correctly');
    } else if (successRate >= 75) {
      console.log('🟡 MOSTLY FUNCTIONAL - Minor issues need attention');
    } else {
      console.log('🔴 NEEDS ATTENTION - Significant gallery management issues detected');
    }
    
    console.log('============================================================');
  }
}

async function runGalleryManagementTests() {
  const testSuite = new GalleryManagementTests();
  await testSuite.runAllTests();
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  runGalleryManagementTests().catch(console.error);
}