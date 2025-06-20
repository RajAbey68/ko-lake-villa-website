import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function testUploadWithAITitles() {
  try {
    const imagePath = 'uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
    
    if (!fs.existsSync(imagePath)) {
      console.log('Test image not found, creating a test with existing gallery image');
      return;
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('category', 'pool-deck');
    // Don't provide title or description to test AI generation

    console.log('Testing upload with AI title generation...');
    
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    
    console.log('Upload Result:');
    console.log('Success:', result.success);
    console.log('Title:', result.data?.title);
    console.log('Description:', result.data?.description);
    console.log('Category:', result.data?.category);
    
    if (result.success && result.data?.title && !result.data.title.includes('1747314600586')) {
      console.log('✅ AI title generation working - descriptive titles generated');
    } else {
      console.log('⚠️ Still using filename-based titles');
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testUploadWithAITitles();