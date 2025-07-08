import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function testAITitleGeneration() {
  try {
    const imagePath = 'uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
    
    if (!fs.existsSync(imagePath)) {
      console.log('Test image not found, skipping AI title test');
      return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    console.log('Testing AI title generation...');
    
    const response = await fetch('http://localhost:5000/api/analyze-media', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    
    console.log('AI Analysis Result:');
    console.log('Title:', result.title);
    console.log('Description:', result.description);
    console.log('Category:', result.category || result.suggestedCategory);
    console.log('Tags:', result.tags);
    console.log('Confidence:', result.confidence);
    
    if (result.title && result.title !== '1747314600586-813125493-20250418_070924') {
      console.log('✅ AI title generation working - descriptive titles generated');
    } else {
      console.log('⚠️ Still using filename as title');
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testAITitleGeneration();