import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ko Lake Villa specific categories
const VILLA_CATEGORIES = [
  'entire-villa',
  'family-suite', 
  'group-room',
  'triple-room',
  'dining-area',
  'pool-deck',
  'lake-garden',
  'roof-garden',
  'front-garden',
  'koggala-lake',
  'excursions'
];

// AI Media Analysis endpoint
router.post('/api/analyze-media', upload.single('image'), async (req, res) => {
  try {
    const { category = "" } = req.body;
    const filePath = req.file?.path;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    if (!filePath) {
      return res.status(400).json({ error: 'Image file missing' });
    }

    const buffer = fs.readFileSync(filePath);
    const base64Image = buffer.toString('base64');

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this Ko Lake Villa accommodation image. 

Available categories: ${VILLA_CATEGORIES.join(', ')}

Current user selection: ${category || "unspecified"}

Return JSON with:
- suggestedCategory (must be one from the list above)
- confidence (0-1, how confident you are)
- title (catchy title for marketing)
- description (brief marketing description)
- tags (array of 3-5 relevant marketing tags)

Focus on luxury accommodation marketing language.`,
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const result = JSON.parse(aiResponse.choices[0].message.content || '{}');
    
    // Validate that suggested category is in our list
    if (result.suggestedCategory && !VILLA_CATEGORIES.includes(result.suggestedCategory)) {
      result.suggestedCategory = 'entire-villa'; // fallback to default
    }

    res.json({
      suggestedCategory: result.suggestedCategory || 'entire-villa',
      confidence: result.confidence || 0.7,
      title: result.title || 'Ko Lake Villa',
      description: result.description || 'Beautiful villa accommodation',
      tags: result.tags || ['luxury', 'villa', 'lakeside']
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  } finally {
    // Clean up uploaded file
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

export default router;