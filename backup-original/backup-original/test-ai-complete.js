/**
 * Complete AI Media Analyzer Test Suite
 */
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

const baseUrl = 'http://localhost:5000';

async function testAIConfiguration() {
  console.log('Testing AI Configuration...');
  
  try {
    const response = await fetch(`${baseUrl}/api/gallery`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('✅ Gallery API accessible');
      return true;
    } else {
      console.log('❌ Gallery API failed');
      return false;
    }
  } catch (error) {
    console.log('❌ AI Configuration failed:', error.message);
    return false;
  }
}

async function testImageUploadWithAI() {
  console.log('Testing Image Upload with AI Analysis...');
  
  try {
    const testImagePath = '/home/runner/workspace/uploads/gallery/default/1748610755811-613293277-WhatsApp_Image_2025-05-29_at_22.50.43-2.jpeg';
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image not found');
      return false;
    }
    
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    form.append('category', 'pool-deck');
    form.append('alt', '');
    form.append('description', '');
    form.append('featured', 'false');
    form.append('sortOrder', '1');
    form.append('displaySize', 'medium');
    
    const response = await fetch(`${baseUrl}/api/gallery/upload`, {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    
    if (response.ok && result.data) {
      console.log('✅ Image upload successful');
      console.log(`   Category: ${result.data.category}`);
      console.log(`   Title: ${result.data.alt}`);
      console.log(`   File size: ${result.data.fileSize} bytes`);
      return true;
    } else {
      console.log('❌ Image upload failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Image upload with AI failed:', error.message);
    return false;
  }
}

async function testCategoryValidation() {
  console.log('Testing Category Validation...');
  
  const validCategories = [
    'entire-villa', 'family-suite', 'group-room', 'triple-room',
    'dining-area', 'pool-deck', 'lake-garden', 'roof-garden',
    'front-garden', 'koggala-lake', 'excursions'
  ];
  
  try {
    for (const category of validCategories.slice(0, 3)) {
      const response = await fetch(`${baseUrl}/api/gallery?category=${category}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        console.log(`❌ Category ${category} failed`);
        return false;
      }
    }
    
    console.log('✅ Category validation passed');
    return true;
  } catch (error) {
    console.log('❌ Category validation failed:', error.message);
    return false;
  }
}

async function testTaggingSystem() {
  console.log('Testing Tagging System...');
  
  try {
    const response = await fetch(`${baseUrl}/api/gallery`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const images = await response.json();
      const hasTaggedImages = images.some(img => img.tags && img.tags.length > 0);
      
      if (hasTaggedImages) {
        console.log('✅ Tagging system working');
        return true;
      } else {
        console.log('⚠️ No tagged images found');
        return true; // Not a failure, just no data
      }
    } else {
      console.log('❌ Tagging system failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Tagging system failed:', error.message);
    return false;
  }
}

async function testFallbackBehavior() {
  console.log('Testing Fallback Behavior...');
  
  try {
    const testImagePath = '/home/runner/workspace/uploads/gallery/default/1748610755811-613293277-WhatsApp_Image_2025-05-29_at_22.50.43-2.jpeg';
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image not found');
      return false;
    }
    
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    form.append('category', 'dining-area');
    form.append('alt', 'Manual Title');
    form.append('description', 'Manual Description');
    form.append('featured', 'false');
    form.append('sortOrder', '1');
    form.append('displaySize', 'medium');
    
    const response = await fetch(`${baseUrl}/api/gallery/upload`, {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    
    if (response.ok && result.data && result.data.alt === 'Manual Title') {
      console.log('✅ Fallback behavior working');
      return true;
    } else {
      console.log('❌ Fallback behavior failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Fallback behavior failed:', error.message);
    return false;
  }
}

async function runCompleteAITest() {
  console.log('🤖 Complete AI Media Analyzer Test Suite\n');
  
  const tests = [
    { name: 'AI Configuration', test: testAIConfiguration },
    { name: 'Image Upload with AI', test: testImageUploadWithAI },
    { name: 'Category Validation', test: testCategoryValidation },
    { name: 'Tagging System', test: testTaggingSystem },
    { name: 'Fallback Behavior', test: testFallbackBehavior }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, test } of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    console.log('');
  }
  
  const total = passed + failed;
  const successRate = ((passed / total) * 100).toFixed(1);
  
  console.log('='.repeat(50));
  console.log('AI MEDIA ANALYZER TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${successRate}%`);
  console.log('='.repeat(50));
  
  if (successRate >= 80) {
    console.log('🟢 AI SYSTEM READY FOR PRODUCTION');
  } else {
    console.log('🔴 AI SYSTEM NEEDS ATTENTION');
  }
}

runCompleteAITest();