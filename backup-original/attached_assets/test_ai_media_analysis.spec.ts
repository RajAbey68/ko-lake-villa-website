
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

test('AI Media Analysis - Image Categorization', async () => {
  const imagePath = path.resolve(__dirname, './test-assets/sample-villa.jpg');
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));
  form.append('category', ''); // optional field

  const response = await fetch('http://localhost:5000/api/analyze-media', {
    method: 'POST',
    body: form,
  });

  expect(response.status).toBe(200);

  const json = await response.json();
  expect(json).toHaveProperty('category');
  expect(json).toHaveProperty('title');
  expect(json).toHaveProperty('description');
  expect(Array.isArray(json.tags)).toBeTruthy();
  expect(json.tags.length).toBeGreaterThan(0);
});
