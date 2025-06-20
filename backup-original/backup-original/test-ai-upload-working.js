/**
 * Test AI Upload with Real Villa Images
 */
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

async function testAIUpload() {
  console.log('Testing AI Upload with Real Villa Images...\n');
  
  // Find an existing villa image to test with
  const testImagePath = '/home/runner/workspace/uploads/gallery/default/1748610755811-613293277-WhatsApp_Image_2025-05-29_at_22.50.43-2.jpeg';
  
  if (!fs.existsSync(testImagePath)) {
    console.log('Test image not found. Using any available image...');
    return;
  }
  
  const form = new FormData();
  form.append('image', fs.createReadStream(testImagePath));
  form.append('category', 'family-suite');
  form.append('alt', '');
  form.append('description', '');
  form.append('featured', 'false');
  form.append('sortOrder', '1');
  form.append('displaySize', 'medium');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery/upload', {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    
    console.log('AI Analysis Result:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\nAI Upload Test PASSED');
      if (result.aiAnalysis) {
        console.log('AI provided intelligent categorization');
        console.log(`Category: ${result.aiAnalysis.category}`);
        console.log(`Title: ${result.aiAnalysis.title}`);
        console.log(`Confidence: ${result.aiAnalysis.confidence}`);
      }
    } else {
      console.log('\nAI Upload Test FAILED');
    }
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

testAIUpload();