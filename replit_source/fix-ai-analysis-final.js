/**
 * Fix AI Analysis - Create working intelligent categorization system
 */

async function createWorkingAIAnalysis() {
  console.log('Creating working AI analysis system...');
  
  // Test the current system
  const response = await fetch('http://localhost:5000/api/gallery');
  const images = await response.json();
  
  if (images.length === 0) {
    console.log('No images to analyze');
    return;
  }
  
  console.log(`Found ${images.length} images in gallery`);
  
  // Analyze a few images to test the system
  const testImages = images.slice(0, 5);
  
  for (const image of testImages) {
    console.log(`\nTesting image: ${image.title}`);
    console.log(`URL: ${image.imageUrl}`);
    console.log(`Current category: ${image.category}`);
    
    try {
      const analysisResponse = await fetch(`http://localhost:5000/api/analyze-media/${image.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (analysisResponse.ok) {
        const result = await analysisResponse.json();
        console.log(`✅ Analysis successful: ${result.message}`);
        console.log(`- New title: ${result.title}`);
        console.log(`- New category: ${result.category}`);
      } else {
        const error = await analysisResponse.json();
        console.log(`❌ Analysis failed: ${error.error}`);
      }
    } catch (error) {
      console.log(`❌ Request error: ${error.message}`);
    }
  }
}

createWorkingAIAnalysis();