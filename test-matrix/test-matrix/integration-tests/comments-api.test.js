const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/gallery/comments';

describe('Comments API Integration Test', () => {

  // --- GET Request Tests ---

  // Test Case 'a': Successfully fetch comments for a valid image ID
  test('GET /api/gallery/comments?imageId=1 - should return comments for a valid image ID', async () => {
    const response = await fetch(`${API_URL}?imageId=1`);
    expect(response.status).toBe(200);
    const comments = await response.json();
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0]).toHaveProperty('author', 'Jane Doe');
    console.log('Test Case GET (Success): Passed');
  });

  // Test Case 'b': Handle fetching comments for an image with no comments
  test('GET /api/gallery/comments?imageId=999 - should return an empty array for an image with no comments', async () => {
    const response = await fetch(`${API_URL}?imageId=999`);
    expect(response.status).toBe(200);
    const comments = await response.json();
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBe(0);
    console.log('Test Case GET (Empty): Passed');
  });

  // Test Case 'c': Fail gracefully when imageId is missing
  test('GET /api/gallery/comments - should return 400 if imageId is missing', async () => {
    const response = await fetch(API_URL);
    expect(response.status).toBe(400);
    console.log('Test Case GET (Bad Request): Passed');
  });


  // --- POST Request Tests ---

  // Test Case 'd': Successfully post a new comment
  test('POST /api/gallery/comments - should successfully add a new comment', async () => {
    const newComment = { imageId: '3', author: 'Test User', text: 'This is a test comment.' };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });

    expect(response.status).toBe(201);
    const postedComment = await response.json();
    expect(postedComment).toHaveProperty('id');
    expect(postedComment).toHaveProperty('author', 'Test User');
    expect(postedComment).toHaveProperty('text', 'This is a test comment.');
    console.log('Test Case POST (Success): Passed');

    // Verify the comment was added
    const verifyResponse = await fetch(`${API_URL}?imageId=3`);
    const comments = await verifyResponse.json();
    expect(comments.some(c => c.text === 'This is a test comment.')).toBe(true);
    console.log('Test Case POST (Verify): Passed');
  });

  // Test Case 'e': Fail gracefully if required fields are missing
  test('POST /api/gallery/comments - should return 400 if required fields are missing', async () => {
    const incompleteComment = { imageId: '4', author: 'Incomplete User' }; // Missing 'text'
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteComment),
    });

    expect(response.status).toBe(400);
    console.log('Test Case POST (Bad Request): Passed');
  });
}); 