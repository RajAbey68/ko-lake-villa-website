/**
 * Ko Lake Villa - Gallery Layout and Title Fix Test
 * Tests that gallery shows clean titles and proper responsive layout
 */

async function testGalleryLayoutFix() {
  console.log('🔍 Testing Gallery Layout and Title Fixes...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function logTest(testName, passed, details = '') {
    results.tests.push({ testName, passed, details });
    if (passed) {
      results.passed++;
      console.log(`✅ ${testName}: ${details}`);
    } else {
      results.failed++;
      console.log(`❌ ${testName}: ${details}`);
    }
  }

  // Test 1: Clean Title Display
  console.log('Testing Clean Title Display...');
  try {
    // Navigate to gallery page
    window.history.pushState({}, '', '/gallery');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if gallery images are displayed with clean titles
    const galleryImages = document.querySelectorAll('[data-testid="gallery-image"], .cursor-pointer img');
    
    if (galleryImages.length > 0) {
      logTest('Gallery Images Present', true, `Found ${galleryImages.length} images`);
      
      // Check for long filename patterns in titles
      const titleElements = document.querySelectorAll('h3, .font-semibold');
      const badTitles = Array.from(titleElements).filter(el => {
        const text = el.textContent || '';
        return /^\d+[\-_]\d+/.test(text) || /WhatsApp\s+(Image|Video)/i.test(text);
      });
      
      logTest('Clean Titles Used', badTitles.length === 0, 
        badTitles.length > 0 ? `Found ${badTitles.length} bad titles` : 'All titles are clean');
      
    } else {
      logTest('Gallery Images Present', false, 'No gallery images found');
    }
  } catch (error) {
    logTest('Clean Title Test', false, `Error: ${error.message}`);
  }

  // Test 2: Responsive Grid Layout
  console.log('\nTesting Responsive Grid Layout...');
  try {
    // Check for proper grid classes
    const gridContainer = document.querySelector('.grid');
    
    if (gridContainer) {
      const hasResponsiveClasses = gridContainer.className.includes('grid-cols-1') &&
                                  gridContainer.className.includes('sm:grid-cols-2') &&
                                  gridContainer.className.includes('lg:grid-cols-3');
      
      logTest('Responsive Grid Classes', hasResponsiveClasses, 
        hasResponsiveClasses ? 'Proper responsive breakpoints found' : 'Missing responsive classes');
      
      // Check aspect ratio consistency
      const aspectRatioElements = document.querySelectorAll('.aspect-');
      logTest('Consistent Aspect Ratios', aspectRatioElements.length > 0, 
        `${aspectRatioElements.length} elements using aspect ratio classes`);
        
    } else {
      logTest('Grid Container Present', false, 'No grid container found');
    }
  } catch (error) {
    logTest('Grid Layout Test', false, `Error: ${error.message}`);
  }

  // Test 3: Image Quality and Loading
  console.log('\nTesting Image Quality and Loading...');
  try {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let errorImages = 0;
    
    images.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        loadedImages++;
      } else if (img.complete && img.naturalHeight === 0) {
        errorImages++;
      }
    });
    
    logTest('Images Loading Properly', errorImages === 0, 
      `${loadedImages} loaded, ${errorImages} failed to load`);
    
    // Check for proper object-fit usage
    const objectCoverImages = document.querySelectorAll('.object-cover');
    logTest('Proper Image Scaling', objectCoverImages.length > 0, 
      `${objectCoverImages.length} images using object-cover`);
      
  } catch (error) {
    logTest('Image Quality Test', false, `Error: ${error.message}`);
  }

  // Test 4: Card Styling and Hover Effects
  console.log('\nTesting Card Styling...');
  try {
    const cards = document.querySelectorAll('.group, .cursor-pointer');
    
    if (cards.length > 0) {
      logTest('Interactive Cards Present', true, `Found ${cards.length} interactive cards`);
      
      // Check for hover effects
      const hasHoverEffects = Array.from(cards).some(card => 
        card.className.includes('hover:') || card.className.includes('group-hover:')
      );
      
      logTest('Hover Effects Applied', hasHoverEffects, 
        hasHoverEffects ? 'Cards have hover interactions' : 'No hover effects found');
        
    } else {
      logTest('Interactive Cards Present', false, 'No interactive cards found');
    }
  } catch (error) {
    logTest('Card Styling Test', false, `Error: ${error.message}`);
  }

  // Test 5: API Data Quality
  console.log('\nTesting API Data Quality...');
  try {
    const response = await fetch('/api/gallery');
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      logTest('Gallery API Working', true, `${data.length} items returned`);
      
      // Check data quality
      const itemsWithProperTitles = data.filter(item => 
        item.title && item.title.length > 3 && item.title.length < 100
      );
      
      logTest('Quality Data Available', itemsWithProperTitles.length > 0, 
        `${itemsWithProperTitles.length}/${data.length} items have proper titles`);
      
      // Check for categories
      const categorizedItems = data.filter(item => item.category && item.category !== 'default');
      logTest('Proper Categorization', categorizedItems.length > 0, 
        `${categorizedItems.length}/${data.length} items are categorized`);
        
    } else {
      logTest('Gallery API Working', false, 'No gallery data returned');
    }
  } catch (error) {
    logTest('API Data Test', false, `Error: ${error.message}`);
  }

  // Test 6: Mobile Responsiveness
  console.log('\nTesting Mobile Responsiveness...');
  try {
    // Simulate mobile viewport
    const originalWidth = window.innerWidth;
    
    // Check for mobile-friendly spacing
    const containers = document.querySelectorAll('.container, .max-w-');
    const hasMobilePadding = Array.from(containers).some(container => 
      container.className.includes('px-') || container.className.includes('p-')
    );
    
    logTest('Mobile Padding Applied', hasMobilePadding, 
      hasMobilePadding ? 'Containers have proper padding' : 'Missing mobile padding');
    
    // Check for mobile grid columns
    const gridElements = document.querySelectorAll('.grid-cols-1');
    logTest('Mobile Grid Layout', gridElements.length > 0, 
      `${gridElements.length} elements start with single column on mobile`);
      
  } catch (error) {
    logTest('Mobile Responsiveness Test', false, `Error: ${error.message}`);
  }

  // Generate Report
  console.log('\n📊 GALLERY LAYOUT FIX TEST REPORT');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${results.passed}`);
  console.log(`❌ Tests Failed: ${results.failed}`);
  console.log(`📊 Total Tests: ${results.tests.length}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('Gallery layout has been successfully improved with:');
    console.log('- Clean, user-friendly titles instead of filenames');
    console.log('- Consistent responsive grid layout');
    console.log('- Professional card design with hover effects');
    console.log('- Proper image scaling and aspect ratios');
    console.log('- Mobile-optimized spacing and layout');
  } else {
    console.log('\n⚠️ Some tests failed. Issues to address:');
    results.tests.filter(test => !test.passed).forEach(test => {
      console.log(`   - ${test.testName}: ${test.details}`);
    });
  }
  
  return results;
}

// Auto-run the test
testGalleryLayoutFix().catch(console.error);