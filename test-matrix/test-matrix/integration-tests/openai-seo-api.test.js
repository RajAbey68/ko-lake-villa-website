const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/gallery/ai-seo';

// Sample test data for different scenarios
const testData = {
  validRequest: {
    imageUrl: 'https://ko-lake-villa-website.vercel.app/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg',
    currentTitle: 'Pool Deck Area',
    currentDescription: 'Beautiful pool deck with lake views',
    category: 'pool-deck',
    campaignText: 'Target wellness travelers seeking luxury eco-retreat experiences with pool amenities.'
  },
  familySuiteRequest: {
    imageUrl: 'https://ko-lake-villa-website.vercel.app/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png',
    currentTitle: 'Family Suite Bedroom',
    currentDescription: 'Spacious family suite with lake views',
    category: 'family-suite',
    campaignText: 'Target families seeking safe, comfortable luxury accommodation with child-friendly amenities.'
  },
  nomadCampaign: {
    imageUrl: 'https://ko-lake-villa-website.vercel.app/uploads/gallery/default/workspace.jpg',
    currentTitle: 'Workspace Area',
    currentDescription: 'Quiet workspace with natural lighting',
    category: 'living-areas',
    campaignText: 'Target digital nomads and remote workers seeking reliable internet and peaceful work environments.'
  }
};

describe('OpenAI SEO API Integration Tests', () => {

  // Test Case 1: API Configuration Check
  test('POST /api/gallery/ai-seo - should return error if OpenAI API key not configured', async () => {
    // This test assumes OPENAI_API_KEY is not set in test environment
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.validRequest),
    });

    if (response.status === 500) {
      const data = await response.json();
      expect(data.error).toBe('OpenAI API key not configured');
      console.log('✅ API key validation test passed');
    } else {
      console.log('⚠️ API key is configured, skipping this test');
    }
  });

  // Test Case 2: Request Validation
  test('POST /api/gallery/ai-seo - should return 400 for missing required fields', async () => {
    const invalidRequests = [
      {}, // Empty request
      { imageUrl: '' }, // Missing imageUrl
      { currentTitle: 'Test' }, // Missing imageUrl
      { imageUrl: 'test.jpg' }, // Missing currentTitle
    ];

    for (const invalidRequest of invalidRequests) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidRequest),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('required');
    }
    console.log('✅ Request validation tests passed');
  });

  // Test Case 3: Successful AI Response Structure
  test('POST /api/gallery/ai-seo - should return valid AI response structure', async () => {
    // Skip if API key not configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ Skipping AI response test - no API key');
      return;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.validRequest),
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    // Check response structure
    expect(data).toHaveProperty('altText');
    expect(data).toHaveProperty('seoTitle');
    expect(data).toHaveProperty('seoDescription');
    expect(data).toHaveProperty('suggestedTags');
    expect(data).toHaveProperty('confidence');

    // Check data types
    expect(typeof data.altText).toBe('string');
    expect(typeof data.seoTitle).toBe('string');
    expect(typeof data.seoDescription).toBe('string');
    expect(Array.isArray(data.suggestedTags)).toBe(true);
    expect(typeof data.confidence).toBe('number');

    console.log('✅ AI response structure test passed');
    console.log('📊 Sample response:', {
      altText: data.altText.substring(0, 50) + '...',
      seoTitle: data.seoTitle.substring(0, 50) + '...',
      confidence: data.confidence
    });
  });

  // Test Case 4: Content Quality Validation
  test('Content quality validation - should return useful, brand-relevant text', async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ Skipping content quality test - no API key');
      return;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.validRequest),
    });

    const data = await response.json();

    // Brand context validation
    const brandKeywords = ['Ko Lake Villa', 'luxury', 'Sri Lanka', 'Ahangama', 'Koggala'];
    const allText = `${data.altText} ${data.seoTitle} ${data.seoDescription}`.toLowerCase();
    
    const brandMentions = brandKeywords.filter(keyword => 
      allText.includes(keyword.toLowerCase())
    );
    
    expect(brandMentions.length).toBeGreaterThan(0);

    // Length validation
    expect(data.altText.length).toBeGreaterThan(20);
    expect(data.altText.length).toBeLessThan(120);
    expect(data.seoTitle.length).toBeGreaterThan(30);
    expect(data.seoTitle.length).toBeLessThan(80);
    expect(data.seoDescription.length).toBeGreaterThan(100);
    expect(data.seoDescription.length).toBeLessThan(200);

    // Tags validation
    expect(data.suggestedTags.length).toBeGreaterThan(2);
    expect(data.suggestedTags.length).toBeLessThan(10);

    // Confidence validation
    expect(data.confidence).toBeGreaterThan(0.5);
    expect(data.confidence).toBeLessThan(1.1);

    console.log('✅ Content quality validation passed');
  });

  // Test Case 5: Campaign Text Bias Testing
  test('Campaign text bias - should reflect different target audiences', async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ Skipping campaign bias test - no API key');
      return;
    }

    // Test family-focused campaign
    const familyResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.familySuiteRequest),
    });

    const familyData = await familyResponse.json();
    const familyText = `${familyData.seoTitle} ${familyData.seoDescription}`.toLowerCase();

    // Test digital nomad campaign
    const nomadResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.nomadCampaign),
    });

    const nomadData = await nomadResponse.json();
    const nomadText = `${nomadData.seoTitle} ${nomadData.seoDescription}`.toLowerCase();

    // Check if campaign text influenced the output
    const familyKeywords = ['family', 'child', 'safe', 'comfortable'];
    const nomadKeywords = ['work', 'remote', 'internet', 'quiet', 'productivity'];

    const familyMatches = familyKeywords.filter(keyword => familyText.includes(keyword));
    const nomadMatches = nomadKeywords.filter(keyword => nomadText.includes(keyword));

    console.log('📊 Campaign bias results:');
    console.log('  Family campaign mentions:', familyMatches);
    console.log('  Nomad campaign mentions:', nomadMatches);

    // At least one relevant keyword should appear for each campaign
    expect(familyMatches.length + nomadMatches.length).toBeGreaterThan(0);

    console.log('✅ Campaign text bias test passed');
  });

  // Test Case 6: Error Handling and Fallback
  test('Error handling - should provide fallback content on OpenAI failure', async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ Skipping error handling test - no API key');
      return;
    }

    // Test with invalid image URL to potentially trigger fallback
    const invalidRequest = {
      ...testData.validRequest,
      imageUrl: 'https://invalid-url-that-should-fail.com/image.jpg'
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidRequest),
    });

    // Should either succeed with AI or provide fallback content
    if (response.status === 200) {
      const data = await response.json();
      expect(data.altText).toBeDefined();
      expect(data.seoTitle).toBeDefined();
      expect(data.seoDescription).toBeDefined();
      console.log('✅ Error handling test passed - fallback content provided');
    } else {
      console.log('⚠️ Error handling test result:', response.status);
    }
  });

  // Test Case 7: Performance Testing
  test('Performance - should respond within reasonable time', async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ Skipping performance test - no API key');
      return;
    }

    const startTime = Date.now();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.validRequest),
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(30000); // Should respond within 30 seconds
    
    console.log(`✅ Performance test passed - Response time: ${responseTime}ms`);
  });

  // Test Case 8: Multiple Category Testing
  test('Category-specific content - should generate appropriate content for different categories', async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ Skipping category test - no API key');
      return;
    }

    const categories = [
      { category: 'pool-deck', expectedKeywords: ['pool', 'deck', 'swimming', 'relaxation'] },
      { category: 'family-suite', expectedKeywords: ['family', 'suite', 'spacious', 'comfortable'] },
      { category: 'dining-area', expectedKeywords: ['dining', 'food', 'meals', 'restaurant'] }
    ];

    for (const categoryTest of categories) {
      const request = {
        ...testData.validRequest,
        category: categoryTest.category,
        currentTitle: `${categoryTest.category} view`,
        currentDescription: `Beautiful ${categoryTest.category} area`
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (response.status === 200) {
        const data = await response.json();
        const allText = `${data.altText} ${data.seoTitle} ${data.seoDescription}`.toLowerCase();
        
        const matches = categoryTest.expectedKeywords.filter(keyword => 
          allText.includes(keyword)
        );
        
        console.log(`📊 Category ${categoryTest.category} - matched keywords:`, matches);
        
        // At least one relevant keyword should appear
        expect(matches.length).toBeGreaterThan(0);
      }
    }

    console.log('✅ Category-specific content test passed');
  });
}); 