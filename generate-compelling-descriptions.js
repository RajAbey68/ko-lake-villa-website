/**
 * Generate Compelling Descriptions using OpenAI
 * Creates appealing descriptions that emphasize comfort and value
 */

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCompellingDescriptions() {
  console.log('🎨 Generating compelling descriptions with OpenAI');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery');
    const videos = await response.json();
    console.log(`📋 Found ${videos.length} videos to enhance`);
    
    let updatedCount = 0;
    
    for (const video of videos) {
      console.log(`\n🎬 Processing: ${video.title}`);
      
      // Create a prompt that emphasizes comfort and value
      const prompt = `Write a compelling 2-sentence description for this Ko Lake Villa accommodation video: "${video.title}". 

Key messaging:
- Emphasize COMFORT and quality facilities
- Highlight VALUE FOR MONEY and wallet-friendly pricing
- Mention the beautiful Koggala Lake setting in Ahangama, Sri Lanka
- Appeal to travelers seeking authentic experiences
- Keep it warm, welcoming, and authentic (no overly fancy language)

The description should make guests feel they're getting exceptional comfort and experience at a reasonable price.`;

      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.7
        });

        const newDescription = aiResponse.choices[0].message.content.trim();
        console.log(`💡 Generated: ${newDescription}`);

        // Update the video with the compelling description
        const updateResponse = await fetch(`http://localhost:5000/api/admin/gallery/${video.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: newDescription
          })
        });

        if (updateResponse.ok) {
          console.log(`✅ Updated description for: ${video.title}`);
          updatedCount++;
        } else {
          console.log(`⚠️ Failed to update ${video.id}: ${updateResponse.status}`);
        }

      } catch (error) {
        console.log(`❌ Error generating description for ${video.id}: ${error.message}`);
      }
      
      // Delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 Updated ${updatedCount} descriptions with compelling content`);
    return { success: true, updatedCount };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

generateCompellingDescriptions().then(result => {
  if (result.success) {
    console.log('\n🎉 All descriptions now emphasize comfort and value!');
  } else {
    console.log('\n💥 Failed to generate descriptions');
  }
});