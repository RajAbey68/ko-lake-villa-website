import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

test('AI Media Analysis - Image Categorization', async () => {
  // Use one of the existing villa images for testing
  const imagePath = path.resolve(__dirname, '../uploads/gallery/default/1747314605746.png');
  
  // Skip test if image doesn't exist
  if (!fs.existsSync(imagePath)) {
    test.skip();
    return;
  }

  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));
  form.append('category', 'pool-deck'); // Test with suggested category

  const response = await fetch('http://localhost:5000/api/analyze-media', {
    method: 'POST',
    body: form,
  });

  expect(response.status).toBe(200);

  const json = await response.json();
  
  // Test the actual response structure from our API
  expect(json).toHaveProperty('suggestedCategory');
  expect(json).toHaveProperty('confidence');
  expect(json).toHaveProperty('title');
  expect(json).toHaveProperty('description');
  expect(json).toHaveProperty('tags');
  
  // Validate the data types and content
  expect(typeof json.suggestedCategory).toBe('string');
  expect(typeof json.confidence).toBe('number');
  expect(json.confidence).toBeGreaterThanOrEqual(0);
  expect(json.confidence).toBeLessThanOrEqual(1);
  expect(Array.isArray(json.tags)).toBeTruthy();
  expect(json.tags.length).toBeGreaterThan(0);
  
  // Validate that suggested category is from our valid list
  const validCategories = [
    'entire-villa', 'family-suite', 'group-room', 'triple-room', 
    'dining-area', 'pool-deck', 'lake-garden', 'roof-garden', 
    'front-garden', 'koggala-lake', 'excursions'
  ];
  expect(validCategories).toContain(json.suggestedCategory);
});

test('AI Media Analysis - Error Handling', async () => {
  // Test without image file
  const form = new FormData();
  form.append('category', 'pool-deck');

  const response = await fetch('http://localhost:5000/api/analyze-media', {
    method: 'POST',
    body: form,
  });

  expect(response.status).toBe(400);
  
  const json = await response.json();
  expect(json).toHaveProperty('error');
  expect(json.error).toContain('Image file missing');
});