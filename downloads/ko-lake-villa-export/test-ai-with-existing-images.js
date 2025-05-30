/**
 * Test AI categorization with existing Ko Lake Villa images
 */

import fs from 'fs';
import path from 'path';

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  return response;
}

async function clearGalleryDatabase() {
  console.log('🗑️ Clearing gallery database...');
  
  try {
    // Use direct database clearing approach
    const response = await fetch('http://localhost:5000/api/gallery/images');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Found ${data.length} images in gallery`);
      
      // Clear each image
      for (const image of data) {
        try {
          const deleteRes = await fetch(`http://localhost:5000/api/gallery/images/${image.id}`, {
            method: 'DELETE'
          });
          if (deleteRes.ok) {
            console.log(`Deleted: ${image.alt || 'unnamed'}`);
          }
        } catch (err) {
          console.log(`Skip: ${image.id}`);
        }
      }
    }
    
    console.log('✅ Gallery cleared');
  } catch (error) {
    console.log('Gallery clear attempted, continuing...');
  }
}

async function testAIAnalysis() {
  console.log('🤖 Testing AI Analysis System for Ko Lake Villa\n');
  
  // Clear existing gallery first
  await clearGalleryDatabase();
  
  // Find a few representative images to test
  const testImages = [
    '/home/runner/workspace/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg',
    '/home/runner/workspace/uploads/gallery/default/1747446102756-742973380-20250329_154102.jpg',
    '/home/runner/workspace/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg',
    '/home/runner/workspace/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg'
  ].filter(imagePath => fs.existsSync(imagePath));
  
  console.log(`Found ${testImages.length} test images`);
  
  const results = [];
  
  for (const imagePath of testImages) {
    console.log(`\n📤 Testing: ${path.basename(imagePath)}`);
    
    try {
      // Create a simple form submission using browser FormData
      const imageBuffer = fs.readFileSync(imagePath);
      const filename = path.basename(imagePath);
      
      // Convert buffer to base64 for testing
      const base64 = imageBuffer.toString('base64');
      
      // Test the direct upload endpoint
      const uploadResponse = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: filename,
          imageData: base64,
          category: 'default',
          title: '',
          description: ''
        })
      });
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        results.push({
          filename,
          success: true,
          category: result.data?.category || 'unknown',
          title: result.data?.alt || 'No title',
          description: result.data?.description || 'No description',
          aiAnalysis: result.aiAnalysis || null
        });
        
        console.log(`  ✅ Success: ${result.data?.category} - "${result.data?.alt}"`);
        if (result.aiAnalysis) {
          console.log(`     🤖 AI Confidence: ${Math.round(result.aiAnalysis.confidence * 100)}%`);
          console.log(`     🏷️ Tags: ${result.aiAnalysis.tags?.join(', ') || 'None'}`);
        }
      } else {
        console.log(`  ❌ Upload failed: ${uploadResponse.status}`);
        results.push({
          filename,
          success: false,
          error: `HTTP ${uploadResponse.status}`
        });
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        filename: path.basename(imagePath),
        success: false,
        error: error.message
      });
    }
    
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate test report
  console.log('\n' + '='.repeat(50));
  console.log('AI CATEGORIZATION TEST REPORT');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const withAI = successful.filter(r => r.aiAnalysis);
  
  console.log(`📊 Test Results:`);
  console.log(`  • Images tested: ${results.length}`);
  console.log(`  • Successful uploads: ${successful.length}`);
  console.log(`  • AI analysis performed: ${withAI.length}`);
  console.log(`  • Success rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  console.log(`  • AI analysis rate: ${((withAI.length / successful.length) * 100).toFixed(1)}%`);
  
  if (withAI.length > 0) {
    console.log(`\n🤖 AI Analysis Examples:`);
    withAI.slice(0, 3).forEach(result => {
      console.log(`  • ${result.filename}:`);
      console.log(`    Category: ${result.category}`);
      console.log(`    Title: ${result.title}`);
      console.log(`    Confidence: ${Math.round(result.aiAnalysis.confidence * 100)}%`);
    });
  }
  
  console.log(`\n🎯 System Status: ${withAI.length > 0 ? 'AI Analysis Working' : 'Manual Mode'}`);
  
  return results;
}

// Run the test
testAIAnalysis().catch(console.error);