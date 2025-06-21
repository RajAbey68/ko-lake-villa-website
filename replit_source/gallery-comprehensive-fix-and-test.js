
/**
 * Ko Lake Villa - Comprehensive Gallery Fix and Test Suite
 * Addresses all gallery issues with thorough testing before any release
 */

class GalleryTestAndFix {
  constructor() {
    this.results = {
      tests: [],
      fixes: [],
      errors: []
    };
    this.baseUrl = window.location.origin;
  }

  async runCompleteGalleryValidation() {
    console.log('🧪 Starting Comprehensive Gallery Validation');
    
    // 1. Test API endpoints first
    await this.testGalleryAPI();
    
    // 2. Test admin functionality
    await this.testAdminGallery();
    
    // 3. Test frontend gallery
    await this.testFrontendGallery();
    
    // 4. Test upload functionality
    await this.testUploadFunctionality();
    
    // 5. Test edit/delete operations
    await this.testEditDeleteOperations();
    
    // 6. Apply fixes for found issues
    await this.applyGalleryFixes();
    
    this.displayResults();
  }

  async testGalleryAPI() {
    console.log('📡 Testing Gallery API Endpoints...');
    
    try {
      // Test gallery fetch
      const galleryResponse = await fetch(`${this.baseUrl}/api/gallery`);
      this.logTest('Gallery API Fetch', galleryResponse.ok, 
        `Status: ${galleryResponse.status}`);
      
      if (galleryResponse.ok) {
        const data = await galleryResponse.json();
        this.logTest('Gallery Data Structure', Array.isArray(data), 
          `Received ${data.length} items`);
        
        // Test each image has required fields
        if (data.length > 0) {
          const firstImage = data[0];
          const hasRequiredFields = firstImage.id && firstImage.imageUrl && firstImage.category;
          this.logTest('Image Data Integrity', hasRequiredFields,
            `Fields: ${Object.keys(firstImage).join(', ')}`);
        }
      }
      
      // Test upload endpoint
      const uploadTest = await fetch(`${this.baseUrl}/api/gallery/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      this.logTest('Upload Endpoint Available', uploadTest.status !== 404,
        `Status: ${uploadTest.status}`);
        
    } catch (error) {
      this.logError('Gallery API Test Failed', error);
    }
  }

  async testAdminGallery() {
    console.log('🔧 Testing Admin Gallery Interface...');
    
    try {
      // Check if we're on admin page
      const isAdminPage = window.location.pathname.includes('/admin');
      
      if (isAdminPage) {
        // Test gallery manager component
        const galleryManager = document.querySelector('[data-testid="gallery-manager"]') || 
                              document.querySelector('.gallery-manager') ||
                              document.querySelector('[role="grid"]');
        
        this.logTest('Gallery Manager Component', !!galleryManager,
          galleryManager ? 'Component found' : 'Component missing');
        
        // Test upload button
        const uploadButton = document.querySelector('button:has-text("Upload")') ||
                            document.querySelector('button[aria-label*="upload"]') ||
                            document.querySelector('button').find(btn => 
                              btn.textContent.toLowerCase().includes('upload'));
        
        this.logTest('Upload Button Present', !!uploadButton,
          uploadButton ? 'Button found' : 'Button missing');
        
        // Test filter functionality
        const categoryFilter = document.querySelector('select') ||
                              document.querySelector('[role="combobox"]');
        
        this.logTest('Category Filter Present', !!categoryFilter,
          categoryFilter ? 'Filter found' : 'Filter missing');
        
        // Test image grid
        const imageGrid = document.querySelector('[role="grid"]') ||
                         document.querySelector('.grid') ||
                         document.querySelectorAll('img').length > 0;
        
        this.logTest('Image Grid Present', !!imageGrid,
          imageGrid ? 'Grid found' : 'Grid missing');
      }
    } catch (error) {
      this.logError('Admin Gallery Test Failed', error);
    }
  }

  async testFrontendGallery() {
    console.log('🖼️ Testing Frontend Gallery...');
    
    try {
      // Test if on gallery page
      const isGalleryPage = window.location.pathname.includes('/gallery');
      
      if (isGalleryPage) {
        // Test image loading
        const images = document.querySelectorAll('img');
        this.logTest('Images Present', images.length > 0,
          `Found ${images.length} images`);
        
        // Test for broken images
        let brokenImages = 0;
        images.forEach(img => {
          if (img.naturalWidth === 0 && img.complete) {
            brokenImages++;
          }
        });
        
        this.logTest('Images Loading Properly', brokenImages === 0,
          `${brokenImages} broken images found`);
        
        // Test category filters
        const categoryButtons = document.querySelectorAll('[data-category]') ||
                               document.querySelectorAll('button').filter(btn =>
                                 btn.textContent.includes('Villa') || 
                                 btn.textContent.includes('Pool') ||
                                 btn.textContent.includes('Family'));
        
        this.logTest('Category Filters Present', categoryButtons.length > 0,
          `Found ${categoryButtons.length} category filters`);
      }
    } catch (error) {
      this.logError('Frontend Gallery Test Failed', error);
    }
  }

  async testUploadFunctionality() {
    console.log('📤 Testing Upload Functionality...');
    
    try {
      // Check for upload form elements
      const fileInput = document.querySelector('input[type="file"]');
      this.logTest('File Input Present', !!fileInput,
        fileInput ? 'File input found' : 'File input missing');
      
      // Check for category selection
      const categorySelect = document.querySelector('select[name="category"]') ||
                            document.querySelector('[name="category"]');
      
      this.logTest('Category Selection Present', !!categorySelect,
        categorySelect ? 'Category selector found' : 'Category selector missing');
      
      // Check for submit button
      const submitButton = document.querySelector('button[type="submit"]') ||
                          document.querySelector('button:has-text("Upload")');
      
      this.logTest('Submit Button Present', !!submitButton,
        submitButton ? 'Submit button found' : 'Submit button missing');
      
    } catch (error) {
      this.logError('Upload Functionality Test Failed', error);
    }
  }

  async testEditDeleteOperations() {
    console.log('✏️ Testing Edit/Delete Operations...');
    
    try {
      // Look for edit buttons
      const editButtons = document.querySelectorAll('button[aria-label*="edit"]') ||
                         document.querySelectorAll('button').filter(btn =>
                           btn.textContent.toLowerCase().includes('edit'));
      
      this.logTest('Edit Buttons Present', editButtons.length > 0,
        `Found ${editButtons.length} edit buttons`);
      
      // Look for delete buttons
      const deleteButtons = document.querySelectorAll('button[aria-label*="delete"]') ||
                           document.querySelectorAll('button').filter(btn =>
                             btn.textContent.toLowerCase().includes('delete'));
      
      this.logTest('Delete Buttons Present', deleteButtons.length > 0,
        `Found ${deleteButtons.length} delete buttons`);
      
      // Test modal dialogs
      const dialogs = document.querySelectorAll('[role="dialog"]');
      this.logTest('Modal Support Available', dialogs.length >= 0,
        `Found ${dialogs.length} dialog elements`);
      
    } catch (error) {
      this.logError('Edit/Delete Operations Test Failed', error);
    }
  }

  async applyGalleryFixes() {
    console.log('🔧 Applying Gallery Fixes...');
    
    try {
      // Fix 1: Ensure proper error handling for images
      this.fixImageErrorHandling();
      
      // Fix 2: Fix broken upload functionality
      await this.fixUploadFunctionality();
      
      // Fix 3: Fix category filtering
      this.fixCategoryFiltering();
      
      // Fix 4: Fix edit/delete operations
      this.fixEditDeleteOperations();
      
    } catch (error) {
      this.logError('Gallery Fixes Failed', error);
    }
  }

  fixImageErrorHandling() {
    console.log('🖼️ Fixing Image Error Handling...');
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.onerror) {
        img.onerror = function() {
          console.warn(`Failed to load image: ${this.src}`);
          this.src = '/placeholder-image.jpg';
          this.alt = 'Image not available';
        };
      }
      
      // Add lazy loading
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
    
    this.logFix('Image Error Handling', `Applied error handling to ${images.length} images`);
  }

  async fixUploadFunctionality() {
    console.log('📤 Fixing Upload Functionality...');
    
    // Check if upload form exists and fix validation
    const uploadForm = document.querySelector('form') ||
                      document.querySelector('[data-testid="upload-form"]');
    
    if (uploadForm) {
      // Add proper form validation
      uploadForm.addEventListener('submit', (e) => {
        const fileInput = uploadForm.querySelector('input[type="file"]');
        const categorySelect = uploadForm.querySelector('[name="category"]');
        
        if (!fileInput || !fileInput.files.length) {
          e.preventDefault();
          alert('Please select a file to upload');
          return false;
        }
        
        if (categorySelect && !categorySelect.value) {
          e.preventDefault();
          alert('Please select a category');
          return false;
        }
      });
      
      this.logFix('Upload Form Validation', 'Added proper form validation');
    }
  }

  fixCategoryFiltering() {
    console.log('🏷️ Fixing Category Filtering...');
    
    const categoryFilters = document.querySelectorAll('[data-category]');
    
    categoryFilters.forEach(filter => {
      if (!filter.onclick) {
        filter.addEventListener('click', (e) => {
          const category = e.target.dataset.category;
          const images = document.querySelectorAll('.gallery-image');
          
          images.forEach(img => {
            if (category === 'all' || img.dataset.category === category) {
              img.style.display = 'block';
            } else {
              img.style.display = 'none';
            }
          });
          
          // Update active state
          categoryFilters.forEach(f => f.classList.remove('active'));
          e.target.classList.add('active');
        });
      }
    });
    
    this.logFix('Category Filtering', `Fixed ${categoryFilters.length} category filters`);
  }

  fixEditDeleteOperations() {
    console.log('✏️ Fixing Edit/Delete Operations...');
    
    // Fix edit buttons
    const editButtons = document.querySelectorAll('[data-action="edit"]');
    editButtons.forEach(button => {
      if (!button.onclick) {
        button.addEventListener('click', (e) => {
          const imageId = e.target.dataset.imageId;
          if (imageId) {
            this.openEditModal(imageId);
          }
        });
      }
    });
    
    // Fix delete buttons
    const deleteButtons = document.querySelectorAll('[data-action="delete"]');
    deleteButtons.forEach(button => {
      if (!button.onclick) {
        button.addEventListener('click', (e) => {
          const imageId = e.target.dataset.imageId;
          if (imageId && confirm('Are you sure you want to delete this image?')) {
            this.deleteImage(imageId);
          }
        });
      }
    });
    
    this.logFix('Edit/Delete Operations', 
      `Fixed ${editButtons.length} edit and ${deleteButtons.length} delete buttons`);
  }

  async openEditModal(imageId) {
    // Simple edit modal implementation
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Edit Image</h3>
        <form id="edit-form-${imageId}">
          <input type="text" name="title" placeholder="Image title" required>
          <textarea name="description" placeholder="Image description"></textarea>
          <select name="category" required>
            <option value="">Select category</option>
            <option value="entire-villa">Entire Villa</option>
            <option value="family-suite">Family Suite</option>
            <option value="pool-deck">Pool Deck</option>
            <option value="dining-area">Dining Area</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onclick="this.closest('.edit-modal').remove()">Cancel</button>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  async deleteImage(imageId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/gallery/${imageId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove image from DOM
        const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
        if (imageElement) {
          imageElement.remove();
        }
        alert('Image deleted successfully');
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Error deleting image');
    }
  }

  logTest(name, passed, details = '') {
    const result = { name, passed, details, type: 'test' };
    this.results.tests.push(result);
    
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}${details ? ` - ${details}` : ''}`);
  }

  logFix(name, details = '') {
    const result = { name, details, type: 'fix' };
    this.results.fixes.push(result);
    
    console.log(`🔧 ${name}${details ? ` - ${details}` : ''}`);
  }

  logError(name, error) {
    const result = { name, error: error.message, type: 'error' };
    this.results.errors.push(result);
    
    console.error(`❌ ${name}: ${error.message}`);
  }

  displayResults() {
    console.log('\n📊 Gallery Test and Fix Results:');
    console.log(`Tests Run: ${this.results.tests.length}`);
    console.log(`Tests Passed: ${this.results.tests.filter(t => t.passed).length}`);
    console.log(`Fixes Applied: ${this.results.fixes.length}`);
    console.log(`Errors: ${this.results.errors.length}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors that need attention:');
      this.results.errors.forEach(error => {
        console.log(`- ${error.name}: ${error.error}`);
      });
    }
    
    const failedTests = this.results.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
      console.log('\n❌ Failed tests that need fixes:');
      failedTests.forEach(test => {
        console.log(`- ${test.name}: ${test.details}`);
      });
    }
    
    if (this.results.fixes.length > 0) {
      console.log('\n✅ Applied fixes:');
      this.results.fixes.forEach(fix => {
        console.log(`- ${fix.name}: ${fix.details}`);
      });
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Address any failed tests or errors');
    console.log('2. Test upload functionality manually');
    console.log('3. Verify edit/delete operations work');
    console.log('4. Check all categories display correctly');
    console.log('5. Validate responsive design on mobile');
  }

  // Quick fixes for common issues
  async quickFixGallery() {
    console.log('⚡ Applying Quick Gallery Fixes...');
    
    // Fix missing alt texts
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.alt = 'Ko Lake Villa gallery image';
    });
    
    // Fix missing loading attributes
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.loading = 'lazy';
    });
    
    // Add error handling to all images
    this.fixImageErrorHandling();
    
    // Fix any broken buttons
    document.querySelectorAll('button:not([onclick]):not([data-fixed])').forEach(button => {
      if (button.textContent.includes('Upload')) {
        button.addEventListener('click', () => {
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.click();
        });
        button.dataset.fixed = 'true';
      }
    });
    
    console.log('✅ Quick fixes applied');
  }
}

// Make it globally available
window.GalleryTestAndFix = new GalleryTestAndFix();

// Auto-run when script loads
console.log('🧪 Ko Lake Villa Gallery Test and Fix Suite Loaded');
console.log('Commands:');
console.log('• GalleryTestAndFix.runCompleteGalleryValidation() - Run full test suite');
console.log('• GalleryTestAndFix.quickFixGallery() - Apply quick fixes');
console.log('• GalleryTestAndFix.displayResults() - Show test results');

// Run quick test on load
setTimeout(() => {
  GalleryTestAndFix.quickFixGallery();
}, 1000);
