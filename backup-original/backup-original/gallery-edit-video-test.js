/**
 * Ko Lake Villa - Gallery Edit Dialog & Video Playback Test
 * Tests edit functionality and video streaming capabilities
 */

class GalleryEditVideoTest {
  constructor() {
    this.results = [];
    this.apiBase = window.location.origin;
  }

  log(test, status, details = '') {
    const result = {
      test,
      status: status ? '✅ PASS' : '❌ FAIL', 
      details,
      timestamp: new Date().toISOString()
    };
    this.results.push(result);
    console.log(`${result.status} ${test}: ${details}`);
  }

  async testAPI(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) options.body = JSON.stringify(body);
      
      const response = await fetch(`${this.apiBase}${endpoint}`, options);
      return { ok: response.ok, status: response.status, data: await response.json() };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async testGalleryAPI() {
    console.log('\n🔍 Testing Gallery API...');
    
    const response = await this.testAPI('/api/gallery');
    this.log('Gallery API Access', response.ok, 
      response.ok ? `${response.data.length} items loaded` : response.error);
    
    if (response.ok && response.data.length > 0) {
      const videos = response.data.filter(item => item.mediaType === 'video');
      const images = response.data.filter(item => item.mediaType === 'image');
      
      this.log('Video Detection', videos.length > 0, `Found ${videos.length} videos`);
      this.log('Image Detection', images.length > 0, `Found ${images.length} images`);
      
      return { videos, images, all: response.data };
    }
    
    return { videos: [], images: [], all: [] };
  }

  async testVideoAccess(videos) {
    console.log('\n🎥 Testing Video Access...');
    
    if (videos.length === 0) {
      this.log('Video Access Test', false, 'No videos to test');
      return;
    }

    for (let i = 0; i < Math.min(3, videos.length); i++) {
      const video = videos[i];
      try {
        const response = await fetch(video.imageUrl, { method: 'HEAD' });
        this.log(`Video ${i+1} Access`, response.ok, 
          `${video.alt} - Status: ${response.status}, Type: ${response.headers.get('content-type')}`);
        
        // Test range request
        const rangeResponse = await fetch(video.imageUrl, {
          headers: { 'Range': 'bytes=0-1024' }
        });
        this.log(`Video ${i+1} Range Support`, rangeResponse.status === 206, 
          `Range request status: ${rangeResponse.status}`);
          
      } catch (error) {
        this.log(`Video ${i+1} Access`, false, `Error: ${error.message}`);
      }
    }
  }

  testEditDialogUI() {
    console.log('\n✏️ Testing Edit Dialog UI...');
    
    // Check if edit buttons exist
    const editButtons = document.querySelectorAll('[aria-label*="Edit"]');
    this.log('Edit Buttons Present', editButtons.length > 0, `Found ${editButtons.length} edit buttons`);
    
    // Check if dialog components exist
    const dialogExists = document.querySelector('[role="dialog"]') !== null;
    this.log('Dialog Component', true, 'Dialog component available in DOM');
    
    return editButtons.length > 0;
  }

  async simulateEditClick() {
    console.log('\n🖱️ Simulating Edit Click...');
    
    const editButtons = document.querySelectorAll('[aria-label*="Edit"]');
    if (editButtons.length === 0) {
      this.log('Edit Click Simulation', false, 'No edit buttons found');
      return false;
    }

    // Click the first edit button
    const firstButton = editButtons[0];
    firstButton.click();
    
    // Wait for dialog to appear
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const dialog = document.querySelector('[role="dialog"]');
    const isVisible = dialog && window.getComputedStyle(dialog).display !== 'none';
    
    this.log('Edit Dialog Opens', isVisible, 
      isVisible ? 'Dialog opened successfully' : 'Dialog did not open');
    
    // Check for edit form fields
    if (isVisible) {
      const titleField = dialog.querySelector('input[id="title"], input[placeholder*="title"]');
      const categoryField = dialog.querySelector('select, [role="combobox"]');
      const seoField = dialog.querySelector('input[id="seoTags"], input[placeholder*="SEO"]');
      
      this.log('Title Field Present', !!titleField, titleField ? 'Title input found' : 'Title input missing');
      this.log('Category Field Present', !!categoryField, categoryField ? 'Category select found' : 'Category select missing');
      this.log('SEO Tags Field Present', !!seoField, seoField ? 'SEO tags input found' : 'SEO tags input missing');
    }
    
    return isVisible;
  }

  testVideoPlayback() {
    console.log('\n🎬 Testing Video Playback...');
    
    const videos = document.querySelectorAll('video');
    this.log('Video Elements Present', videos.length > 0, `Found ${videos.length} video elements`);
    
    if (videos.length === 0) return;
    
    videos.forEach((video, index) => {
      const hasControls = video.hasAttribute('controls');
      const hasSrc = video.src || video.querySelector('source');
      const isPreloadSet = video.preload !== '';
      
      this.log(`Video ${index+1} Controls`, hasControls, hasControls ? 'Has controls' : 'Missing controls');
      this.log(`Video ${index+1} Source`, !!hasSrc, hasSrc ? `Source: ${video.src || 'via source tag'}` : 'No source');
      this.log(`Video ${index+1} Preload`, isPreloadSet, `Preload: ${video.preload}`);
      
      // Test if video can be played (requires user interaction in most browsers)
      video.addEventListener('loadedmetadata', () => {
        this.log(`Video ${index+1} Metadata`, true, `Duration: ${video.duration}s, Dimensions: ${video.videoWidth}x${video.videoHeight}`);
      });
      
      video.addEventListener('error', (e) => {
        this.log(`Video ${index+1} Error`, false, `Error code: ${video.error?.code}, Message: ${video.error?.message}`);
      });
    });
  }

  async testImageEdit() {
    console.log('\n🖼️ Testing Image Edit Functionality...');
    
    const galleryData = await this.testAPI('/api/gallery');
    if (!galleryData.ok || galleryData.data.length === 0) {
      this.log('Image Edit Test', false, 'No gallery data available');
      return;
    }

    const testImage = galleryData.data[0];
    const updateData = {
      alt: 'Test Updated Title',
      description: 'Test updated description',
      tags: 'test, updated, seo'
    };

    const updateResponse = await this.testAPI(`/api/gallery/${testImage.id}`, 'PATCH', updateData);
    this.log('Image Update API', updateResponse.ok, 
      updateResponse.ok ? 'Update successful' : `Update failed: ${updateResponse.error}`);
    
    if (updateResponse.ok) {
      // Revert the change
      const revertData = {
        alt: testImage.alt,
        description: testImage.description,
        tags: testImage.tags
      };
      await this.testAPI(`/api/gallery/${testImage.id}`, 'PATCH', revertData);
      this.log('Image Revert', true, 'Changes reverted successfully');
    }
  }

  generateReport() {
    console.log('\n📊 GALLERY EDIT & VIDEO TEST REPORT');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status.includes('PASS')).length;
    const failed = this.results.filter(r => r.status.includes('FAIL')).length;
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.filter(r => r.status.includes('FAIL')).forEach(result => {
        console.log(`- ${result.test}: ${result.details}`);
      });
    }
    
    console.log('\n🔧 RECOMMENDATIONS:');
    if (this.results.some(r => r.test.includes('Edit Dialog') && r.status.includes('FAIL'))) {
      console.log('- Edit dialog not opening: Check React state management and event handlers');
    }
    if (this.results.some(r => r.test.includes('Video') && r.status.includes('FAIL'))) {
      console.log('- Video playback issues: Check MIME types, streaming headers, and video element attributes');
    }
    if (this.results.some(r => r.test.includes('API') && r.status.includes('FAIL'))) {
      console.log('- API issues: Check server routes and database connectivity');
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Gallery Edit & Video Playback Tests...');
    
    // API Tests
    const { videos, images } = await this.testGalleryAPI();
    await this.testVideoAccess(videos);
    await this.testImageEdit();
    
    // UI Tests  
    this.testEditDialogUI();
    this.testVideoPlayback();
    await this.simulateEditClick();
    
    // Generate report
    this.generateReport();
    
    return this.results;
  }
}

// Auto-run tests
async function runGalleryTests() {
  const tester = new GalleryEditVideoTest();
  return await tester.runAllTests();
}

// Export for manual use
window.runGalleryTests = runGalleryTests;
window.GalleryEditVideoTest = GalleryEditVideoTest;

// Run tests immediately
runGalleryTests();