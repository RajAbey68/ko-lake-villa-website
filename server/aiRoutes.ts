
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
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

router.post('/analyze-media', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');

    // If no OpenAI key, return default categorization
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      const filename = req.file.originalname.toLowerCase();
      let suggestedCategory = 'entire-villa';
      
      if (filename.includes('pool')) suggestedCategory = 'pool-deck';
      else if (filename.includes('dining')) suggestedCategory = 'dining-area';
      else if (filename.includes('room')) suggestedCategory = 'family-suite';
      else if (filename.includes('garden')) suggestedCategory = 'front-garden';
      else if (filename.includes('lake')) suggestedCategory = 'koggala-lake';

      fs.unlinkSync(filePath); // Clean up temp file
      
      return res.json({
        category: suggestedCategory,
        confidence: 0.8,
        description: `Auto-categorized based on filename`,
        tags: [suggestedCategory, 'ko-lake-villa']
      });
    }

    // Add timeout to prevent hanging
    const aiAnalysisPromise = openai.chat.completions.create({
      model: "gpt-4o", // Use newer model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image from Ko Lake Villa and categorize it. Available categories: ${VILLA_CATEGORIES.join(', ')}. Return only the most appropriate category name.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    // Add 10 second timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI analysis timeout')), 10000);
    });

    const response = await Promise.race([aiAnalysisPromise, timeoutPromise]);

    const aiResponse = response.choices[0].message.content;
    const suggestedCategory = VILLA_CATEGORIES.find(cat => 
      aiResponse?.toLowerCase().includes(cat)
    ) || 'entire-villa';

    // Clean up temp file
    fs.unlinkSync(filePath);

    res.json({
      category: suggestedCategory,
      confidence: 0.9,
      description: aiResponse,
      tags: [suggestedCategory, 'ko-lake-villa', 'ai-categorized']
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Provide fallback analysis based on filename
    const filename = req.file?.originalname?.toLowerCase() || '';
    let fallbackCategory = 'entire-villa';
    
    if (filename.includes('pool')) fallbackCategory = 'pool-deck';
    else if (filename.includes('dining')) fallbackCategory = 'dining-area';
    else if (filename.includes('suite')) fallbackCategory = 'family-suite';
    else if (filename.includes('room')) fallbackCategory = 'triple-room';
    else if (filename.includes('garden')) fallbackCategory = 'front-garden';
    else if (filename.includes('lake')) fallbackCategory = 'koggala-lake';
    
    // Return fallback response instead of error
    return res.json({
      category: fallbackCategory,
      confidence: 0.6,
      description: `Fallback categorization based on filename`,
      tags: [fallbackCategory, 'ko-lake-villa', 'fallback']
    });
  }
});

export default router;
