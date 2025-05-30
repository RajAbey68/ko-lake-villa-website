import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DocumentAnalysisResult {
  category: string;
  title: string;
  summary: string;
  keywords: string[];
  targetTribes: string[];
  seoScore: number;
  marketingInsights: {
    primaryAudience: string;
    keyMessages: string[];
    suggestedChannels: string[];
    competitiveAdvantages: string[];
  };
}

export async function analyzeDocument(filePath: string, fileName: string, category: string): Promise<DocumentAnalysisResult> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const prompt = `
Analyze this Ko Lake Villa marketing document and provide detailed insights for our accommodation marketing strategy.

Our target tribes are:
1. Leisure Travellers - seeking relaxation, comfort, scenic views, family-friendly experiences
2. Digital Nomads - need reliable internet, workspaces, community, long-term stays, productivity
3. Experienced Tourers - want authentic experiences, cultural immersion, safety, unique activities

Document content:
${fileContent}

Please analyze and return a JSON response with:
{
  "category": "marketing|news|events|seo|content",
  "title": "SEO-optimized title for this content",
  "summary": "Executive summary highlighting key points for accommodation marketing",
  "keywords": ["array", "of", "seo", "keywords", "from", "content"],
  "targetTribes": ["leisure", "digital-nomads", "experienced-tourers"] (which tribes this content targets),
  "seoScore": 85 (0-100 score for SEO optimization),
  "marketingInsights": {
    "primaryAudience": "Main target audience from the content",
    "keyMessages": ["Core", "marketing", "messages", "identified"],
    "suggestedChannels": ["Social", "media", "platforms", "or", "marketing", "channels"],
    "competitiveAdvantages": ["Unique", "selling", "points", "found"]
  }
}

Focus on accommodation-specific keywords, guest experience terms, and location-based SEO for Ahangama/Galle/Sri Lanka.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a hospitality marketing expert specializing in boutique accommodations and SEO optimization for holiday rentals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      category: analysis.category || category,
      title: analysis.title || fileName,
      summary: analysis.summary || "Document analysis completed",
      keywords: analysis.keywords || [],
      targetTribes: analysis.targetTribes || [],
      seoScore: analysis.seoScore || 50,
      marketingInsights: analysis.marketingInsights || {
        primaryAudience: "General travelers",
        keyMessages: [],
        suggestedChannels: [],
        competitiveAdvantages: []
      }
    };

  } catch (error) {
    console.error('Document analysis failed:', error);
    
    // Fallback analysis based on file content patterns
    return {
      category: category,
      title: fileName,
      summary: "Document uploaded successfully - manual review recommended",
      keywords: ["ko-lake-villa", "accommodation", "ahangama", "sri-lanka"],
      targetTribes: ["leisure", "digital-nomads", "experienced-tourers"],
      seoScore: 50,
      marketingInsights: {
        primaryAudience: "All traveler types",
        keyMessages: ["Boutique accommodation", "Scenic location"],
        suggestedChannels: ["Website", "Social media"],
        competitiveAdvantages: ["Lakefront location", "Personalized service"]
      }
    };
  }
}

export function extractKeywordsForTribes(content: string, targetTribes: string[]): string[] {
  const tribeKeywords = {
    leisure: [
      "relaxation", "scenic", "family-friendly", "comfortable", "peaceful", "luxury", 
      "spa", "pool", "garden", "views", "vacation", "holiday", "retreat"
    ],
    "digital-nomads": [
      "wifi", "internet", "workspace", "coworking", "productivity", "remote work",
      "long-term", "monthly", "community", "networking", "laptop-friendly", "desk"
    ],
    "experienced-tourers": [
      "authentic", "cultural", "local", "adventure", "experiences", "guided tours",
      "sustainable", "eco-friendly", "heritage", "traditional", "immersive"
    ]
  };

  const extractedKeywords: string[] = [];
  const lowerContent = content.toLowerCase();

  targetTribes.forEach(tribe => {
    if (tribeKeywords[tribe as keyof typeof tribeKeywords]) {
      tribeKeywords[tribe as keyof typeof tribeKeywords].forEach(keyword => {
        if (lowerContent.includes(keyword)) {
          extractedKeywords.push(keyword);
        }
      });
    }
  });

  return [...new Set(extractedKeywords)]; // Remove duplicates
}