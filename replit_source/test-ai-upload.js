/**
 * Test AI-powered upload with authentic Ko Lake Villa image
 */

import fs from 'fs';
import path from 'path';

async function testAIUpload() {
  console.log('Testing AI-powered image analysis...\n');
  
  // Find an authentic villa image to test
  const testImagePath = '/home/runner/workspace/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
  
  if (!fs.existsSync(testImagePath)) {
    console.log('Test image not found');
    return;
  }
  
  console.log('Found test image:', path.basename(testImagePath));
  
  try {
    // Create FormData for upload
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    
    const imageStream = fs.createReadStream(testImagePath);
    form.append('image', imageStream, 'villa-test.jpg');
    form.append('category', 'default'); // Let AI categorize
    form.append('title', ''); // Let AI generate
    form.append('description', ''); // Let AI generate
    form.append('featured', 'false');
    
    console.log('Uploading with AI analysis...');
    
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      
      console.log('\n✅ Upload successful!');
      console.log('Generated Data:');
      console.log(`  Category: ${result.data.category}`);
      console.log(`  Title: ${result.data.alt}`);
      console.log(`  Description: ${result.data.description}`);
      console.log(`  Tags: ${result.data.tags}`);
      
      if (result.aiAnalysis) {
        console.log('\n🤖 AI Analysis:');
        console.log(`  Confidence: ${Math.round(result.aiAnalysis.confidence * 100)}%`);
        console.log(`  AI Category: ${result.aiAnalysis.category}`);
        console.log(`  AI Title: ${result.aiAnalysis.title}`);
        console.log(`  AI Tags: ${result.aiAnalysis.tags?.join(', ')}`);
      } else {
        console.log('\n📝 Manual categorization applied (AI not available)');
      }
      
    } else {
      const error = await response.text();
      console.log('Upload failed:', error);
    }
    
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testAIUpload();