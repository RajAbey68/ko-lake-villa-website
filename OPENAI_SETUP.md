# OpenAI Integration Setup

## Overview
Ko Lake Villa website now includes OpenAI GPT-4 Vision integration for automated alt text and SEO generation.

## Features
- **AI-powered SEO Generation**: Automatically generates optimized titles, descriptions, and alt text
- **Campaign Targeting**: 500-word campaign text input to bias AI towards specific audiences
- **Image Analysis**: Uses GPT-4 Vision to analyze images and generate contextual content
- **Brand-aware**: Includes Ko Lake Villa brand context and target keywords

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Set Environment Variable
Add to your `.env.local` file:
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Test Integration
1. Go to Admin → Gallery Management
2. Click "SEO Optimization" tab
3. Add campaign text (optional)
4. Select an image/video
5. Click "Generate AI SEO"

## Usage

### Campaign Text Examples

**For Wellness Travelers:**
```
Target wellness travelers and yoga enthusiasts seeking luxury eco-retreat experiences. Emphasize sustainability, yoga-friendly spaces, meditation areas, and holistic wellness amenities. Focus on 'mindful luxury' and 'inner peace' themes.
```

**For Digital Nomads:**
```
Target digital nomads and remote workers seeking luxury accommodation with high-speed internet. Emphasize workspace amenities, reliable connectivity, quiet work environments, and 'escape to productivity' themes.
```

**For Families:**
```
Target families seeking safe, spacious luxury accommodation. Emphasize family-friendly amenities, child safety features, group activities, and 'create memories together' themes.
```

### API Response Format
```json
{
  "altText": "Luxury pool deck at Ko Lake Villa overlooking Koggala Lake",
  "seoTitle": "Pool Deck | Ko Lake Villa Luxury Accommodation Sri Lanka",
  "seoDescription": "Relax by our infinity pool with stunning lake views. Ko Lake Villa offers luxury accommodation in Ahangama. Book direct and save 10%.",
  "suggestedTags": ["luxury", "pool", "lakefront", "villa", "accommodation"],
  "confidence": 0.92
}
```

## Troubleshooting

### Common Issues
1. **"OpenAI API key not configured"**: Add OPENAI_API_KEY to environment variables
2. **"Failed to generate AI content"**: Check API key validity and OpenAI account credits
3. **Low confidence scores**: Ensure images are high quality and clearly show the subject

### API Limits
- OpenAI GPT-4 Vision: $0.01 per 1K tokens
- Rate limits: 500 requests per day (default)
- Image size limit: 20MB

## Technical Details

### Endpoint
`POST /api/gallery/ai-seo`

### Request Body
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "currentTitle": "Pool Area",
  "currentDescription": "Beautiful pool area",
  "category": "pool-deck",
  "campaignText": "Target wellness travelers..."
}
```

### Model Configuration
- Model: `gpt-4o`
- Temperature: 0.3 (for consistent results)
- Max tokens: 500
- Image detail: high (for better analysis)

### Brand Context
The AI prompt includes:
- Ko Lake Villa brand information
- Target audience details
- SEO keywords and location data
- Brand tone and messaging guidelines
- Direct booking value proposition

## Security Notes
- API keys are server-side only
- No image data is stored by OpenAI
- All requests are processed securely
- Campaign text is not stored permanently 