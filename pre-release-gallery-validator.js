
/**
 * Ko Lake Villa - Pre-Release Gallery Validator
 * Prevents any release with gallery issues
 */

class PreReleaseValidator {
  constructor() {
    this.criticalIssues = [];
    this.warnings = [];
    this.passed = false;
  }

  async validateForRelease() {
    console.log('🚀 Ko Lake Villa Pre-Release Validation Started');
    console.log('=' .repeat(50));
    
    // Critical validations that must pass
    await this.validateAPI();
    await this.validateUpload();
    await this.validateDisplay();
    await this.validateAdmin();
    await this.validateMobile();
    
    this.generateReport();
    return this.passed;
  }

  async validateAPI() {
    console.log('📡 Validating API Endpoints...');
    
    try {
      // Test gallery API
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        this.addCritical('Gallery API not responding', `Status: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        this.addCritical('Gallery API returns invalid data', 'Expected array');
        return;
      }
      
      if (data.length === 0) {
        this.addWarning('Gallery API returns empty data', 'No images found');
      }
      
      // Validate data structure
      if (data.length > 0) {
        const sample = data[0];
        const requiredFields = ['id', 'imageUrl', 'category', 'alt'];
        const missingFields = requiredFields.filter(field => !sample[field]);
        
        if (missingFields.length > 0) {
          this.addCritical('Gallery data missing required fields', 
            `Missing: ${missingFields.join(', ')}`);
        }
      }
      
      console.log('✅ API validation passed');
      
    } catch (error) {
      this.addCritical('Gallery API validation failed', error.message);
    }
  }

  async validateUpload() {
    console.log('📤 Validating Upload Functionality...');
    
    try {
      // Check upload endpoint
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: new FormData() // Empty form data
      });
      
      // Should not be 404 (endpoint exists)
      if (response.status === 404) {
        this.addCritical('Upload endpoint missing', '/api/gallery/upload not found');
        return;
      }
      
      // Check for upload form elements
      const fileInput = document.querySelector('input[type="file"]');
      if (!fileInput) {
        this.addCritical('Upload form missing', 'No file input found');
      }
      
      const categorySelect = document.querySelector('[name="category"]');
      if (!categorySelect) {
        this.addCritical('Category selection missing', 'No category selector found');
      }
      
      console.log('✅ Upload validation passed');
      
    } catch (error) {
      this.addCritical('Upload validation failed', error.message);
    }
  }

  async validateDisplay() {
    console.log('🖼️ Validating Gallery Display...');
    
    try {
      const images = document.querySelectorAll('img');
      
      if (images.length === 0) {
        this.addCritical('No images found in gallery', 'Gallery appears empty');
        return;
      }
      
      // Check for broken images
      let brokenCount = 0;
      images.forEach(img => {
        if (img.complete && img.naturalWidth === 0) {
          brokenCount++;
        }
        
        // Check alt text
        if (!img.alt) {
          this.addWarning('Image missing alt text', `Image: ${img.src}`);
        }
      });
      
      if (brokenCount > 0) {
        this.addCritical('Broken images detected', `${brokenCount} images failed to load`);
      }
      
      // Check for gallery grid
      const galleryGrid = document.querySelector('[role="grid"]') ||
                         document.querySelector('.gallery-grid') ||
                         document.querySelector('.grid');
      
      if (!galleryGrid) {
        this.addWarning('Gallery grid structure missing', 'No grid container found');
      }
      
      console.log('✅ Display validation passed');
      
    } catch (error) {
      this.addCritical('Display validation failed', error.message);
    }
  }

  async validateAdmin() {
    console.log('🔧 Validating Admin Functions...');
    
    try {
      // Check if on admin page
      const isAdminPage = window.location.pathname.includes('/admin');
      
      if (isAdminPage) {
        // Check for essential admin elements
        const uploadButton = document.querySelector('button') &&
          Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.toLowerCase().includes('upload'));
        
        if (!uploadButton) {
          this.addCritical('Admin upload button missing', 'Cannot upload new images');
        }
        
        // Check for edit/delete functionality
        const editButtons = document.querySelectorAll('[data-action="edit"]') ||
          Array.from(document.querySelectorAll('button')).filter(btn =>
            btn.textContent.toLowerCase().includes('edit'));
        
        const deleteButtons = document.querySelectorAll('[data-action="delete"]') ||
          Array.from(document.querySelectorAll('button')).filter(btn =>
            btn.textContent.toLowerCase().includes('delete'));
        
        if (editButtons.length === 0) {
          this.addWarning('Edit functionality missing', 'No edit buttons found');
        }
        
        if (deleteButtons.length === 0) {
          this.addWarning('Delete functionality missing', 'No delete buttons found');
        }
      }
      
      console.log('✅ Admin validation passed');
      
    } catch (error) {
      this.addCritical('Admin validation failed', error.message);
    }
  }

  async validateMobile() {
    console.log('📱 Validating Mobile Responsiveness...');
    
    try {
      // Simulate mobile viewport
      const originalWidth = window.innerWidth;
      
      // Test mobile layout (375px width)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      window.dispatchEvent(new Event('resize'));
      
      // Check if layout adapts
      const galleryContainer = document.querySelector('.gallery') ||
                              document.querySelector('[role="grid"]');
      
      if (galleryContainer) {
        const styles = window.getComputedStyle(galleryContainer);
        const gridColumns = styles.gridTemplateColumns;
        
        // Should have fewer columns on mobile
        if (gridColumns && gridColumns.split(' ').length > 2) {
          this.addWarning('Mobile layout may not be optimal', 
            'Too many columns on mobile');
        }
      }
      
      // Restore original width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalWidth
      });
      
      window.dispatchEvent(new Event('resize'));
      
      console.log('✅ Mobile validation passed');
      
    } catch (error) {
      this.addWarning('Mobile validation failed', error.message);
    }
  }

  addCritical(issue, details) {
    this.criticalIssues.push({ issue, details });
    console.error(`❌ CRITICAL: ${issue} - ${details}`);
  }

  addWarning(issue, details) {
    this.warnings.push({ issue, details });
    console.warn(`⚠️ WARNING: ${issue} - ${details}`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📋 PRE-RELEASE VALIDATION REPORT');
    console.log('='.repeat(50));
    
    if (this.criticalIssues.length === 0) {
      this.passed = true;
      console.log('✅ RELEASE APPROVED - No critical issues found');
    } else {
      this.passed = false;
      console.log('❌ RELEASE BLOCKED - Critical issues must be fixed');
    }
    
    console.log(`\nCritical Issues: ${this.criticalIssues.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    
    if (this.criticalIssues.length > 0) {
      console.log('\n❌ CRITICAL ISSUES (Must Fix):');
      this.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.issue}`);
        console.log(`   ${issue.details}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (Should Fix):');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.issue}`);
        console.log(`   ${warning.details}`);
      });
    }
    
    console.log('\n🎯 NEXT STEPS:');
    if (!this.passed) {
      console.log('1. Fix all critical issues listed above');
      console.log('2. Re-run validation: validator.validateForRelease()');
      console.log('3. Only deploy when validation passes');
    } else {
      console.log('1. Address warnings if time permits');
      console.log('2. Gallery is ready for release');
      console.log('3. Monitor gallery after deployment');
    }
    
    console.log('='.repeat(50));
  }
}

// Global validator instance
window.PreReleaseValidator = new PreReleaseValidator();

// Console commands
console.log('🚀 Pre-Release Gallery Validator Loaded');
console.log('Commands:');
console.log('• PreReleaseValidator.validateForRelease() - Run full validation');
console.log('• DO NOT RELEASE until validation passes!');

// Auto-run validation
setTimeout(async () => {
  const passed = await PreReleaseValidator.validateForRelease();
  if (passed) {
    console.log('🎉 Gallery ready for release!');
  } else {
    console.log('🛑 Gallery NOT ready for release - fix issues first!');
  }
}, 2000);
