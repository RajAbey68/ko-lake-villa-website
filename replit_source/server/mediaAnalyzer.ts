import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface MediaAnalysisResult {
  filename: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  confidence: number;
  mediaType: 'image' | 'video';
  editable: boolean;
}

// Ko Lake Villa specific categories for better AI categorization
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

// Cache for AI analysis results
const analysisCache = new Map<string, any>();

export async function analyzeImageWithAI(imagePath: string, userCategory: string) {
  try {
    console.log(`🔍 Analyzing image: ${imagePath}`);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    // Create cache key from file stats
    const stats = fs.statSync(imagePath);
    const cacheKey = `${path.basename(imagePath)}-${stats.size}-${stats.mtime.getTime()}`;
    
    // Check cache first
    if (analysisCache.has(cacheKey)) {
      console.log(`✅ Using cached analysis for ${imagePath}`);
      return analysisCache.get(cacheKey);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Compress image if too large (>4MB)
    let finalBase64 = base64Image;
    if (imageBuffer.length > 4 * 1024 * 1024) {
      const sharp = require('sharp');
      const compressedBuffer = await sharp(imageBuffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      finalBase64 = compressedBuffer.toString('base64');
      console.log(`📦 Compressed image from ${imageBuffer.length} to ${compressedBuffer.length} bytes`);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this Ko Lake Villa image. Categories: entire-villa, family-suite, group-room, triple-room, dining-area, pool-deck, lake-garden, roof-garden, front-garden, koggala-lake, excursions. Suggest best category, title, description, and 5 relevant tags. Return JSON: {"category": "...", "title": "...", "description": "...", "tags": ["..."], "confidence": 0.95}`
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${finalBase64}` }
          }
        ]
      }],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Cache the result
    analysisCache.set(cacheKey, result);
    
    // Limit cache size
    if (analysisCache.size > 100) {
      const firstKey = analysisCache.keys().next().value;
      analysisCache.delete(firstKey);
    }
    
    return result;
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      category: userCategory,
      title: `Villa Image`,
      description: `Ko Lake Villa image`,
      tags: ['villa', 'accommodation'],
      confidence: 0.5
    };
  }
}

export class MediaAnalyzer {
  
  /**
   * Analyze an image using OpenAI Vision API
   */
  async analyzeImage(filePath: string): Promise<MediaAnalysisResult> {
    try {
      console.log(`🔍 Analyzing image: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Read and encode image
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(filePath);
      
      // Create detailed prompt for Ko Lake Villa context
      const prompt = `Analyze this Ko Lake Villa property image and provide categorization in JSON format.

Ko Lake Villa is a boutique lakeside accommodation in Ahangama, Galle, Sri Lanka with:
- Family suites with lake views
- Group rooms for multiple guests  
- Triple rooms with modern amenities
- Dining areas with Sri Lankan cuisine
- Infinity pool deck overlooking Koggala Lake
- Lake gardens and outdoor spaces
- Rooftop garden with panoramic views
- Front garden entrance areas
- Koggala Lake activities and views
- Local excursions and cultural experiences

Analyze the image and respond with ONLY a JSON object in this exact format:
{
  "category": "one of: family-suite, group-room, triple-room, dining-area, pool-deck, lake-garden, roof-garden, front-garden, koggala-lake, excursions",
  "title": "short descriptive title (max 50 chars)",
  "description": "SEO-friendly description highlighting villa features (max 150 chars)",
  "tags": ["array", "of", "relevant", "tags"],
  "confidence": 0.95
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { 
                type: "image_url", 
                image_url: { 
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: "high"
                } 
              }
            ]
          }
        ],
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      console.log(`📝 OpenAI response: ${content}`);
      
      const analysis = JSON.parse(content);
      
      // Validate and sanitize the response
      const result: MediaAnalysisResult = {
        filename: path.basename(filePath),
        category: this.validateCategory(analysis.category),
        title: analysis.title?.substring(0, 50) || 'Ko Lake Villa Image',
        description: analysis.description?.substring(0, 150) || 'Beautiful view at Ko Lake Villa',
        tags: Array.isArray(analysis.tags) ? analysis.tags.slice(0, 10) : ['villa', 'lake'],
        confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 0.8,
        mediaType: 'image',
        editable: true
      };

      console.log(`✅ Analysis complete: ${result.title} - ${result.category}`);
      return result;

    } catch (error) {
      console.error(`❌ Error analyzing image ${filePath}:`, error);
      
      // Fallback analysis based on filename
      return this.createFallbackAnalysis(filePath, 'image');
    }
  }

  /**
   * Analyze a video file by extracting frames and analyzing content
   */
  async analyzeVideo(filePath: string): Promise<MediaAnalysisResult> {
    try {
      console.log(`🎥 Analyzing video: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // For now, analyze video based on filename and basic metadata
      // In production, you could extract frames using ffmpeg
      const filename = path.basename(filePath);
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / (1024 * 1024)).toFixed(2); // MB

      const prompt = `Analyze this Ko Lake Villa video file and suggest categorization based on the filename: "${filename}"

Ko Lake Villa categories: family-suite, group-room, triple-room, dining-area, pool-deck, lake-garden, roof-garden, front-garden, koggala-lake, excursions

Respond with ONLY a JSON object:
{
  "category": "best matching category",
  "title": "descriptive video title (max 50 chars)",
  "description": "SEO description for video content (max 150 chars)",
  "tags": ["relevant", "video", "tags"],
  "confidence": 0.85
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const analysis = JSON.parse(content);
      
      const result: MediaAnalysisResult = {
        filename: path.basename(filePath),
        category: this.validateCategory(analysis.category),
        title: analysis.title?.substring(0, 50) || 'Ko Lake Villa Video',
        description: analysis.description?.substring(0, 150) || 'Video tour of Ko Lake Villa',
        tags: Array.isArray(analysis.tags) ? 
          [...analysis.tags.slice(0, 8), 'video', 'tour'] : 
          ['video', 'villa', 'tour'],
        confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 0.7,
        mediaType: 'video',
        editable: true
      };

      console.log(`✅ Video analysis complete: ${result.title} - ${result.category}`);
      return result;

    } catch (error) {
      console.error(`❌ Error analyzing video ${filePath}:`, error);
      return this.createFallbackAnalysis(filePath, 'video');
    }
  }

  /**
   * Batch analyze multiple media files
   */
  async analyzeBatch(filePaths: string[]): Promise<MediaAnalysisResult[]> {
    console.log(`🔄 Starting batch analysis of ${filePaths.length} files`);
    
    const results: MediaAnalysisResult[] = [];
    
    for (const filePath of filePaths) {
      try {
        const isVideo = this.isVideoFile(filePath);
        const result = isVideo ? 
          await this.analyzeVideo(filePath) : 
          await this.analyzeImage(filePath);
        
        results.push(result);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Failed to analyze ${filePath}:`, error);
        results.push(this.createFallbackAnalysis(filePath, this.isVideoFile(filePath) ? 'video' : 'image'));
      }
    }
    
    console.log(`✅ Batch analysis complete: ${results.length} files processed`);
    return results;
  }

  /**
   * Validate category against known villa categories
   */
  private validateCategory(category: string): string {
    const normalized = category?.toLowerCase().replace(/[^a-z-]/g, '');
    return VILLA_CATEGORIES.includes(normalized) ? normalized : 'lake-garden';
  }

  /**
   * Create fallback analysis when AI fails
   */
  private createFallbackAnalysis(filePath: string, mediaType: 'image' | 'video'): MediaAnalysisResult {
    const filename = path.basename(filePath);
    const lowerFilename = filename.toLowerCase();
    
    // Basic category detection from filename
    let category = 'lake-garden';
    if (lowerFilename.includes('suite') || lowerFilename.includes('family')) category = 'family-suite';
    else if (lowerFilename.includes('pool')) category = 'pool-deck';
    else if (lowerFilename.includes('room') || lowerFilename.includes('triple')) category = 'triple-room';
    else if (lowerFilename.includes('dining') || lowerFilename.includes('restaurant')) category = 'dining-area';
    else if (lowerFilename.includes('garden') || lowerFilename.includes('front')) category = 'front-garden';
    else if (lowerFilename.includes('lake') || lowerFilename.includes('koggala')) category = 'koggala-lake';
    
    return {
      filename,
      category,
      title: mediaType === 'video' ? 'Ko Lake Villa Video' : 'Ko Lake Villa Image',
      description: `Beautiful ${category.replace('-', ' ')} at Ko Lake Villa`,
      tags: [mediaType, 'villa', 'lake', category.split('-')[0]],
      confidence: 0.5,
      mediaType,
      editable: true
    };
  }

  /**
   * Check if file is a video
   */
  private isVideoFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);
  }

  /**
   * Get MIME type for image files
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      case '.gif':
        return 'image/gif';
      default:
        return 'image/jpeg';
    }
  }
}

export const mediaAnalyzer = new MediaAnalyzer();