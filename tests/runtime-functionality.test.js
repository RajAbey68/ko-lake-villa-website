const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Runtime Functionality Tests', () => {
  let server;
  const PORT = 3001; // Use different port to avoid conflicts

  beforeAll(async () => {
    // Build the application
    await new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.log('Build output:', stdout);
          console.log('Build errors:', stderr);
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Start the server
    server = exec(`PORT=${PORT} npm start`, (error, stdout, stderr) => {
      if (error) {
        console.log('Server error:', error);
      }
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
  }, 60000);

  afterAll(() => {
    if (server) {
      server.kill();
    }
  });

  async function testPageResponse(path, description) {
    return new Promise((resolve, reject) => {
      exec(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT}${path}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          const statusCode = stdout.trim().replace('%', '');
          resolve(statusCode);
        }
      });
    });
  }

  async function testPageContent(path, expectedContent) {
    return new Promise((resolve, reject) => {
      exec(`curl -s http://localhost:${PORT}${path}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.includes(expectedContent));
        }
      });
    });
  }

  test('Homepage loads successfully', async () => {
    const statusCode = await testPageResponse('/', 'Homepage');
    expect(statusCode).toBe('200');
  });

  test('Homepage contains Ko Lake Villa content', async () => {
    const hasContent = await testPageContent('/', 'Ko Lake Villa');
    expect(hasContent).toBe(true);
  });

  test('Contact page loads successfully', async () => {
    const statusCode = await testPageResponse('/contact', 'Contact page');
    expect(statusCode).toBe('200');
  });

  test('Contact page contains phone numbers', async () => {
    const hasGM = await testPageContent('/contact', '+94 71 776 5780');
    const hasTeamLead = await testPageContent('/contact', '+94 77 315 0602');
    const hasOwner = await testPageContent('/contact', '+94 711730345');
    expect(hasGM).toBe(true);
    expect(hasTeamLead).toBe(true);
    expect(hasOwner).toBe(true);
  });

  test('Contact page contains reception hours', async () => {
    const hasHours = await testPageContent('/contact', 'The Reception is open from 7am to 10:30pm');
    expect(hasHours).toBe(true);
  });

  test('Gallery page loads successfully', async () => {
    const statusCode = await testPageResponse('/gallery', 'Gallery page');
    expect(statusCode).toBe('200');
  });

  test('Gallery page contains gallery content', async () => {
    const hasContent = await testPageContent('/gallery', 'Ko Lake Villa Gallery');
    expect(hasContent).toBe(true);
  });

  test('Deals page loads successfully', async () => {
    const statusCode = await testPageResponse('/deals', 'Deals page');
    expect(statusCode).toBe('200');
  });

  test('Admin gallery page loads successfully', async () => {
    const statusCode = await testPageResponse('/admin/gallery', 'Admin gallery');
    expect(statusCode).toBe('200');
  });

  test('API health endpoint works', async () => {
    const statusCode = await testPageResponse('/api/health', 'Health API');
    expect(statusCode).toBe('200');
  });

  test('API gallery list endpoint works', async () => {
    const statusCode = await testPageResponse('/api/gallery/list', 'Gallery API');
    expect(statusCode).toBe('200');
  });

  test('All critical pages return 200 status', async () => {
    const pages = [
      '/',
      '/contact', 
      '/gallery',
      '/deals',
      '/accommodation',
      '/experiences',
      '/dining',
      '/excursions',
      '/faq',
      '/booking'
    ];

    for (const page of pages) {
      const statusCode = await testPageResponse(page, `Page ${page}`);
      expect(statusCode).toBe('200');
    }
  });
}); 