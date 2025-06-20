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
      
      // Create a prompt based on Ko Lake Villa brand character guide
      const prompt = `Write a compelling 2-sentence description for this Ko Lake Villa accommodation video: "${video.title}". 

Brand Character Guidelines:
- Tone: Warm, gracious, informed - never scripted or salesy
- Core values: Affordable elegance (wallet-friendly but never cheap), genuine safety & serenity, authentic human touch
- Brand essence: Relax. Revive. Connect.
- Location: Koggala Lake, Ahangama, Sri Lanka - near surf zones, yoga retreats, Galle Fort
- Use calm, respectful language that suggests rather than pushes
- Reference nature, stillness, and simplicity as luxuries
- Emphasize meaningful connection with nature and oneself
- Avoid flashy language or overselling

Write as a knowledgeable host, not a salesperson. Think "quiet luxury meets soulful retreat."`;

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