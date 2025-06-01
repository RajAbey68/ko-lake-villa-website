
/**
 * Ko Lake Villa Admin Console - Browser Test Suite
 * Run this in the browser console while on the admin dashboard
 */

window.AdminConsoleTest = (function() {
  
  function log(message, type = 'info') {
    const colors = {
      info: 'color: #2196F3',
      success: 'color: #4CAF50',
      warning: 'color: #FF9800',
      error: 'color: #f44336'
    };
    console.log(`%c${message}`, colors[type]);
  }

  function testAdminUIElements() {
    log('🎛️ Testing Admin UI Elements', 'info');
    
    const tests = {
      'Admin Header': () => document.querySelector('header'),
      'Navigation Menu': () => document.querySelector('nav'),
      'Gallery Tab': () => document.querySelector('[data-testid="gallery-tab"], button:contains("Gallery")'),
      'Upload Button': () => document.querySelector('button:contains("Add"), button:contains("Upload")'),
      'Dashboard Content': () => document.querySelector('[role="main"], .admin-content'),
      'Logout Button': () => document.querySelector('button:contains("Log out"), button:contains("Logout")'),
      'Pricing Manager': () => document.querySelector('.pricing, [data-testid="pricing"]'),
      'Sidebar Navigation': () => document.querySelector('.sidebar, nav'),
    };

    Object.entries(tests).forEach(([name, test]) => {
      const element = test();
      if (element) {
        log(`✅ ${name}: Found`, 'success');
      } else {
        log(`❌ ${name}: Missing`, 'error');
      }
    });
  }

  function testGalleryFunctionality() {
    log('📸 Testing Gallery Functionality', 'info');
    
    // Test if gallery images are loaded
    fetch('/api/gallery')
      .then(response => response.json())
      .then(images => {
        if (Array.isArray(images) && images.length > 0) {
          log(`✅ Gallery API: ${images.length} images loaded`, 'success');
          
          // Test image data structure
          const validImages = images.filter(img => 
            img.id && img.imageUrl && img.alt && img.category
          );
          
          if (validImages.length === images.length) {
            log(`✅ Image Data: All ${images.length} images have complete data`, 'success');
          } else {
            log(`⚠️ Image Data: ${validImages.length}/${images.length} have complete data`, 'warning');
          }
          
          // Test categories
          const categories = [...new Set(images.map(img => img.category))];
          log(`✅ Categories: ${categories.join(', ')}`, 'success');
          
        } else {
          log('❌ Gallery API: No images found', 'error');
        }
      })
      .catch(error => {
        log(`❌ Gallery API Error: ${error.message}`, 'error');
      });
  }

  function testPricingSystem() {
    log('💰 Testing Pricing System', 'info');
    
    fetch('/api/admin/pricing')
      .then(response => response.json())
      .then(pricing => {
        if (pricing && pricing.rates) {
          log('✅ Pricing API: Data loaded successfully', 'success');
          
          const rooms = Object.keys(pricing.rates);
          log(`✅ Room Data: ${rooms.join(', ')}`, 'success');
          
          // Test pricing calculation
          const testRoom = rooms[0];
          if (testRoom && pricing.rates[testRoom]) {
            const rates = pricing.rates[testRoom];
            const avg = (rates.sun + rates.mon + rates.tue) / 3;
            const directRate = Math.round(avg * 0.9);
            log(`✅ Price Calculation: ${testRoom} = $${directRate} (10% discount)`, 'success');
          }
          
        } else {
          log('❌ Pricing API: Invalid data structure', 'error');
        }
      })
      .catch(error => {
        log(`❌ Pricing API Error: ${error.message}`, 'error');
      });
  }

  function testAuthenticationStatus() {
    log('🔐 Testing Authentication Status', 'info');
    
    // Check if user appears to be logged in
    const userElements = [
      document.querySelector('[data-testid="user-info"]'),
      document.querySelector('.user-name'),
      document.querySelector('img[alt*="Profile"]'),
      document.querySelector('button:contains("Log out")')
    ].filter(Boolean);

    if (userElements.length > 0) {
      log('✅ Authentication: User appears to be logged in', 'success');
    } else {
      log('⚠️ Authentication: Cannot confirm login status', 'warning');
    }
    
    // Check admin access
    if (window.location.pathname.includes('/admin')) {
      log('✅ Admin Access: Currently on admin pages', 'success');
    } else {
      log('⚠️ Admin Access: Not on admin pages', 'warning');
    }
  }

  function testFormFunctionality() {
    log('📝 Testing Form Functionality', 'info');
    
    // Look for upload forms
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
      log(`✅ Forms: ${forms.length} form(s) found`, 'success');
      
      forms.forEach((form, index) => {
        const inputs = form.querySelectorAll('input, select, textarea');
        log(`  Form ${index + 1}: ${inputs.length} input fields`, 'info');
      });
    } else {
      log('⚠️ Forms: No forms found on this page', 'warning');
    }
    
    // Look for file upload inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    if (fileInputs.length > 0) {
      log(`✅ File Upload: ${fileInputs.length} file input(s) found`, 'success');
    } else {
      log('⚠️ File Upload: No file inputs found', 'warning');
    }
  }

  function testConsoleErrors() {
    log('🐛 Checking Console Errors', 'info');
    
    // Override console.error temporarily to catch errors
    const originalError = console.error;
    const errors = [];
    
    console.error = function(...args) {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    setTimeout(() => {
      console.error = originalError;
      
      if (errors.length === 0) {
        log('✅ Console Errors: No new errors detected', 'success');
      } else {
        log(`⚠️ Console Errors: ${errors.length} error(s) detected`, 'warning');
        errors.forEach(error => log(`  ${error}`, 'warning'));
      }
    }, 2000);
  }

  function testLocalStorage() {
    log('💾 Testing Local Storage', 'info');
    
    try {
      // Test if localStorage is accessible
      const testKey = 'admin-test-' + Date.now();
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === 'test') {
        log('✅ Local Storage: Working correctly', 'success');
      } else {
        log('❌ Local Storage: Not working', 'error');
      }
      
      // Check for existing admin data
      const adminKeys = Object.keys(localStorage).filter(key => 
        key.includes('admin') || key.includes('auth') || key.includes('user')
      );
      
      if (adminKeys.length > 0) {
        log(`✅ Admin Data: ${adminKeys.length} key(s) in storage`, 'success');
      } else {
        log('⚠️ Admin Data: No admin data in localStorage', 'warning');
      }
      
    } catch (error) {
      log(`❌ Local Storage Error: ${error.message}`, 'error');
    }
  }

  function runFullTest() {
    log('🧪 Starting Ko Lake Villa Admin Console Browser Test', 'info');
    log('===================================================', 'info');
    
    testAuthenticationStatus();
    testAdminUIElements();
    testGalleryFunctionality();
    testPricingSystem();
    testFormFunctionality();
    testLocalStorage();
    testConsoleErrors();
    
    log('🏁 Browser test completed! Check results above.', 'success');
    log('💡 To run specific tests: AdminConsoleTest.testGalleryFunctionality()', 'info');
  }

  // Return public API
  return {
    runFullTest,
    testAdminUIElements,
    testGalleryFunctionality,
    testPricingSystem,
    testAuthenticationStatus,
    testFormFunctionality,
    testLocalStorage,
    testConsoleErrors
  };
})();

// Auto-run if this script is loaded
console.log('🔧 Ko Lake Villa Admin Console Test loaded!');
console.log('📋 Run AdminConsoleTest.runFullTest() to test everything');
console.log('🎯 Or run specific tests like AdminConsoleTest.testGalleryFunctionality()');
