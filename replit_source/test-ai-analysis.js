/**
 * Test AI Analysis Endpoint with Real Image
 */

async function testAIAnalysis() {
  console.log('Testing AI analysis endpoint...');
  
  try {
    // Test with an existing gallery image
    const galleryResponse = await fetch('http://localhost:5000/api/gallery');
    const images = await galleryResponse.json();
    
    if (images.length === 0) {
      console.log('No images in gallery to test');
      return;
    }
    
    const testImage = images[0];
    console.log(`Testing with image: ${testImage.title}`);
    console.log(`Image URL: ${testImage.imageUrl}`);
    
    // Test AI analysis with existing image
    const response = await fetch('http://localhost:5000/api/analyze-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: testImage.imageUrl,
        imageId: testImage.id
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ AI Analysis successful:');
      console.log('- Category:', result.category);
      console.log('- Title:', result.title);
      console.log('- Description:', result.description);
      console.log('- Confidence:', result.confidence);
    } else {
      const error = await response.json();
      console.log('❌ AI Analysis failed:', error.error);
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

async function testImageUrls() {
  console.log('\nTesting image URL accessibility...');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery');
    const images = await response.json();
    
    let workingImages = 0;
    let brokenImages = 0;
    
    for (let i = 0; i < Math.min(10, images.length); i++) {
      const image = images[i];
      try {
        const imgResponse = await fetch(`http://localhost:5000${image.imageUrl}`);
        if (imgResponse.ok) {
          workingImages++;
          console.log(`✅ ${image.imageUrl}`);
        } else {
          brokenImages++;
          console.log(`❌ ${image.imageUrl} - Status: ${imgResponse.status}`);
        }
      } catch (error) {
        brokenImages++;
        console.log(`❌ ${image.imageUrl} - Error: ${error.message}`);
      }
    }
    
    console.log(`\nImage URL Summary:`);
    console.log(`Working: ${workingImages}`);
    console.log(`Broken: ${brokenImages}`);
    
  } catch (error) {
    console.log('❌ Gallery fetch error:', error.message);
  }
}

async function runTests() {
  console.log('🔍 Starting AI Analysis and Image URL Tests\n');
  await testImageUrls();
  await testAIAnalysis();
}

runTests();