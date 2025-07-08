/**
 * Real-time Gallery Debug Test
 * Run this in browser console to test gallery functionality
 */

async function testGalleryLoad() {
  console.log('🔍 Testing Gallery Data Load...');
  
  try {
    const response = await fetch('/api/gallery');
    const data = await response.json();
    console.log(`✅ Gallery loaded: ${data.length} items`);
    
    const videos = data.filter(item => 
      item.mediaType === 'video' || 
      item.imageUrl?.toLowerCase().includes('.mp4') ||
      item.imageUrl?.toLowerCase().includes('.mov')
    );
    console.log(`📹 Videos found: ${videos.length}`);
    
    if (videos.length > 0) {
      console.log('First video:', videos[0]);
      return videos[0];
    }
  } catch (error) {
    console.error('❌ Gallery load failed:', error);
  }
  return null;
}

function testVideoElements() {
  console.log('🎥 Testing Video Elements...');
  
  const videoElements = document.querySelectorAll('video');
  console.log(`Found ${videoElements.length} video elements`);
  
  videoElements.forEach((video, index) => {
    console.log(`Video ${index + 1}:`, {
      src: video.src,
      currentSrc: video.currentSrc,
      readyState: video.readyState,
      paused: video.paused,
      muted: video.muted,
      controls: video.controls
    });
  });
  
  return videoElements;
}

function testButtonClicks() {
  console.log('🖱️ Testing Gallery Item Clicks...');
  
  const galleryItems = document.querySelectorAll('[data-testid="gallery-item"], .group.overflow-hidden.rounded-lg.cursor-pointer');
  console.log(`Found ${galleryItems.length} gallery items`);
  
  if (galleryItems.length > 0) {
    console.log('Simulating click on first item...');
    galleryItems[0].click();
    
    setTimeout(() => {
      const modal = document.querySelector('[data-modal-size="fullscreen"]');
      if (modal) {
        console.log('✅ Modal opened successfully');
        console.log('Modal content:', modal.innerHTML.substring(0, 200) + '...');
      } else {
        console.log('❌ Modal did not open');
      }
    }, 500);
  }
}

function testMediaClicks() {
  console.log('🎬 Testing Media Element Clicks...');
  
  const mediaElements = document.querySelectorAll('img[src*="/uploads"], video');
  console.log(`Found ${mediaElements.length} media elements`);
  
  mediaElements.forEach((element, index) => {
    element.addEventListener('click', (e) => {
      console.log(`Media element ${index + 1} clicked:`, {
        tagName: element.tagName,
        src: element.src,
        event: e
      });
    });
  });
}

function checkReactState() {
  console.log('⚛️ Checking React State...');
  
  // Look for React DevTools data
  const reactRoot = document.querySelector('#root');
  if (reactRoot && reactRoot._reactInternalFiber) {
    console.log('React Fiber detected');
  } else if (reactRoot && reactRoot._reactInternalInstance) {
    console.log('React Instance detected');
  } else {
    console.log('React state not directly accessible');
  }
  
  // Check for any React error boundaries
  const errorElements = document.querySelectorAll('[data-reactroot] [data-error], .error-boundary');
  if (errorElements.length > 0) {
    console.log('❌ React errors found:', errorElements);
  } else {
    console.log('✅ No visible React errors');
  }
}

async function runFullDebug() {
  console.log('🚀 Starting Full Gallery Debug...\n');
  
  const testVideo = await testGalleryLoad();
  testVideoElements();
  testButtonClicks();
  testMediaClicks();
  checkReactState();
  
  console.log('\n📋 MANUAL TESTING STEPS:');
  console.log('1. Navigate to /gallery page');
  console.log('2. Look for any console errors');
  console.log('3. Click on any gallery item');
  console.log('4. Verify modal opens');
  console.log('5. If video, check playback controls');
  console.log('\n🔧 Run this in browser console: runFullDebug()');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  runFullDebug();
}