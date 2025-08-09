const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/gallery/ai-tag';

describe('AI Tagging API Test', () => {

  // Test Case 'a': Endpoint should not be implemented without an API key
  test('POST /api/gallery/ai-tag - should return 501 if API key is not configured', async () => {
    // This test assumes the local test environment does NOT have OPENAI_API_KEY set.
    // It verifies that the endpoint correctly reports that the service is not configured.
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: '/placeholder.svg' }),
    });

    // Expect 501 "Not Implemented" because the key is missing
    expect(response.status).toBe(501);
    
    const responseText = await response.text();
    expect(responseText).toBe('AI service is not configured.');
    
    console.log('Test Case (No API Key): Passed');
  });

  // Test Case 'b': Endpoint should return 400 if imageUrl is missing
  test('POST /api/gallery/ai-tag - should return 400 if imageUrl is missing from the request', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // Empty body
    });

    // Expect 400 "Bad Request" because the imageUrl is required
    expect(response.status).toBe(400);
    
    console.log('Test Case (Bad Request): Passed');
  });
}); 