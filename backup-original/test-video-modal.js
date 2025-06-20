/**
 * Video Modal Test - Run in browser console on /gallery page
 * Tests video modal functionality and identifies issues
 */

async function testVideoModal() {
  console.log('🎬 Testing Video Modal Functionality...\n');

  try {
    // Test 1: Check if videos are present in gallery
    const videos = document.querySelectorAll('video');
    console.log(`✓ Found ${videos.length} videos on page`);
    
    if (videos.length === 0) {
      console.log('❌ No videos found - checking gallery API...');
      
      const response = await fetch('/api/gallery');
      const data = await response.json();
      const videoItems = data.filter(item => item.mediaType === 'video');
      console.log(`✓ API has ${videoItems.length} video items`);
      
      if (videoItems.length > 0) {
        console.log('Video URLs:', videoItems.map(v => v.imageUrl));
      }
      return;
    }

    // Test 2: Check video container click handlers
    const videoContainers = document.querySelectorAll('[data-testid="gallery-image"], .cursor-pointer');
    console.log(`✓ Found ${videoContainers.length} clickable gallery items`);

    // Test 3: Simulate clicking on first video
    let videoContainer = null;
    for (let container of videoContainers) {
      const video = container.querySelector('video');
      if (video) {
        videoContainer = container;
        break;
      }
    }

    if (videoContainer) {
      console.log('✓ Testing video click...');
      
      // Listen for modal opening
      const originalLog = console.log;
      let modalOpenDetected = false;
      
      console.log = function(...args) {
        if (args[0] && args[0].includes('Opening modal')) {
          modalOpenDetected = true;
          originalLog('✅ Modal open detected:', ...args);
        }
        originalLog.apply(console, args);
      };
      
      // Click the video container
      videoContainer.click();
      
      // Wait for modal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Restore console
      console.log = originalLog;
      
      // Check if modal opened
      const fullscreenModal = document.querySelector('.fixed.inset-0.z-\\[9999\\]');
      const dialogModal = document.querySelector('[role="dialog"]');
      
      if (fullscreenModal) {
        console.log('✅ FullscreenVideoModal detected');
        
        // Check video in modal
        const modalVideo = fullscreenModal.querySelector('video');
        if (modalVideo) {
          console.log('✅ Video element found in modal');
          console.log(`Video src: ${modalVideo.querySelector('source')?.src}`);
          
          // Test video playback
          if (modalVideo.paused) {
            console.log('⚠️ Video is paused, attempting to play...');
            try {
              await modalVideo.play();
              console.log('✅ Video playing successfully');
            } catch (error) {
              console.log('❌ Video play failed:', error.message);
            }
          } else {
            console.log('✅ Video is already playing');
          }
        } else {
          console.log('❌ No video element in fullscreen modal');
        }
      } else if (dialogModal) {
        console.log('✅ Regular dialog modal detected');
        const modalVideo = dialogModal.querySelector('video');
        if (modalVideo) {
          console.log('✅ Video in dialog modal found');
        } else {
          console.log('❌ No video in dialog modal');
        }
      } else {
        console.log('❌ No modal detected after click');
      }
      
    } else {
      console.log('❌ No video container found to test');
    }

    // Test 4: Check for JavaScript errors
    const errors = window.console.errors || [];
    if (errors.length > 0) {
      console.log('⚠️ JavaScript errors detected:', errors);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Auto-run when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(testVideoModal, 2000);
  });
} else {
  setTimeout(testVideoModal, 1000);
}

// Manual run function
window.testVideoModal = testVideoModal;
console.log('Video modal test loaded. Run testVideoModal() manually if needed.');