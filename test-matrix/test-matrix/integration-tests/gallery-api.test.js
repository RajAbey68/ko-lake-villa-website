const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/gallery/categories';

describe('Gallery Categories API Integration Test', () => {
  
  // Test Case 'a': Success and Dynamic Content
  test('should return a 200 OK status and a list of categories', async () => {
    try {
      const response = await fetch(API_URL);
      
      // Check for successful response
      expect(response.status).toBe(200);
      
      const categories = await response.json();
      
      // Check that the response is an array and not empty
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      
      // Check for a specific, expected category to ensure it's dynamic
      expect(categories).toContain('entire-villa');
      console.log('Test Case a (Success): Passed');

    } catch (error) {
      console.error('Test Case a (Success): Failed', error);
      throw error;
    }
  });

  // Test Case 'b': Data Structure Validation
  test('should return an array of strings', async () => {
    try {
      const response = await fetch(API_URL);
      const categories = await response.json();

      // Ensure every item in the array is a string
      const allStrings = categories.every(item => typeof item === 'string');
      expect(allStrings).toBe(true);
      
      console.log('Test Case b (Structure): Passed');

    } catch (error) {
      console.error('Test Case b (Structure): Failed', error);
      throw error;
    }
  });
}); 