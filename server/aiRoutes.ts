import type { Express } from "express";

export function registerAIRoutes(app: Express) {
  // OpenAI Vision API endpoint for real-time image analysis
  app.post("/api/ai/analyze-image", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
      }

      // Convert relative URL to absolute path for local images
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('/uploads/')) {
        fullImageUrl = `http://localhost:5000${imageUrl}`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image from Ko Lake Villa, a luxury lakeside accommodation in Ahangama, Sri Lanka. Generate 3-5 relevant tags that describe what you see. Focus on: room features, dining areas, outdoor spaces, lake views, architecture, activities, or amenities. Return only a JSON array of tags, no other text."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: fullImageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 100
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content?.trim();
        
        try {
          const tags = JSON.parse(content);
          res.json({ 
            success: true, 
            tags: Array.isArray(tags) ? tags : [content] 
          });
        } catch (parseError) {
          // If JSON parsing fails, extract tags from text response
          const fallbackTags = content
            .replace(/["\[\]]/g, '')
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
            .slice(0, 5);
          
          res.json({ 
            success: true, 
            tags: fallbackTags.length > 0 ? fallbackTags : ['villa', 'koggala', 'sri-lanka'] 
          });
        }
      } else {
        console.error('OpenAI Vision API error:', response.status, await response.text());
        res.status(500).json({ 
          error: "AI analysis failed", 
          tags: ['villa', 'koggala', 'sri-lanka'] 
        });
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      res.status(500).json({ 
        error: "Failed to analyze image", 
        tags: ['villa', 'koggala', 'sri-lanka'] 
      });
    }
  });

  // Enhanced AI content generation for gallery images
  app.post("/api/ai/enhance-image-content", async (req, res) => {
    try {
      const { imageUrl, category } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
      }

      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('/uploads/')) {
        fullImageUrl = `http://localhost:5000${imageUrl}`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this image from Ko Lake Villa in Ahangama, Sri Lanka. Create compelling content for a luxury accommodation website. Generate: 1) A captivating title (max 50 chars), 2) An engaging description (max 150 chars) that highlights the experience. Category: ${category}. Return JSON format: {"title": "...", "description": "..."}`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: fullImageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 150
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content?.trim();
        
        try {
          const result = JSON.parse(content);
          res.json({ 
            success: true, 
            title: result.title || `Ko Lake Villa ${category}`,
            description: result.description || `Experience luxury at Ko Lake Villa's ${category}`
          });
        } catch (parseError) {
          res.json({ 
            success: true, 
            title: `Ko Lake Villa ${category}`,
            description: `Beautiful ${category} space at Ko Lake Villa, your luxury retreat in Ahangama`
          });
        }
      } else {
        console.error('OpenAI content generation error:', response.status);
        res.json({ 
          success: true, 
          title: `Ko Lake Villa ${category}`,
          description: `Authentic ${category} experience at Ko Lake Villa`
        });
      }
    } catch (error) {
      console.error('AI content generation error:', error);
      res.json({ 
        success: true, 
        title: `Ko Lake Villa ${category}`,
        description: `Beautiful ${category} at Ko Lake Villa`
      });
    }
  });
}