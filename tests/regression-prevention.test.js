/**
 * REGRESSION PREVENTION TESTS
 * Automated tests for critical Ko Lake Villa functionality
 * Run these before every deployment to catch regressions
 */

const fs = require('fs');
const path = require('path');

describe('Ko Lake Villa - Critical Functionality Tests', () => {
  
  describe('Contact Page Integrity', () => {
    let contactPageContent;
    
    beforeAll(() => {
      const contactPath = path.join(__dirname, '../app/contact/page.tsx');
      contactPageContent = fs.readFileSync(contactPath, 'utf8');
    });

    test('should have all three phone numbers', () => {
      expect(contactPageContent).toMatch(/\+94 71 776 5780/);  // General Manager
      expect(contactPageContent).toMatch(/\+94 77 315 0602/);  // Villa Team Lead
      expect(contactPageContent).toMatch(/\+94 711730345/);    // Owner
    });

    test('should have WhatsApp integration for all contacts', () => {
      expect(contactPageContent).toMatch(/wa\.me\/94717765780/);  // GM WhatsApp
      expect(contactPageContent).toMatch(/wa\.me\/94773150602/);  // Team Lead WhatsApp  
      expect(contactPageContent).toMatch(/wa\.me\/94711730345/);  // Owner WhatsApp
    });

    test('should have correct reception hours', () => {
      expect(contactPageContent).toMatch(/7am to 10:30pm/);
    });

    test('should specify Sinhala speaker for Villa Team Lead', () => {
      expect(contactPageContent).toMatch(/Sinhala speaker/);
    });

    test('should have proper contact roles defined', () => {
      expect(contactPageContent).toMatch(/General Manager/);
      expect(contactPageContent).toMatch(/Villa Team Lead/);
      expect(contactPageContent).toMatch(/Owner/);
    });
  });

  describe('Booking Button Flow', () => {
    let globalHeaderContent;
    
    beforeAll(() => {
      const headerPath = path.join(__dirname, '../components/navigation/global-header.tsx');
      globalHeaderContent = fs.readFileSync(headerPath, 'utf8');
    });

    test('Book Now buttons should route to contact page', () => {
      expect(globalHeaderContent).toMatch(/href="\/contact"/);
    });

    test('should not route to external booking systems', () => {
      expect(globalHeaderContent).not.toMatch(/booking\.com/);
      expect(globalHeaderContent).not.toMatch(/airbnb\.com\/book/);
      expect(globalHeaderContent).not.toMatch(/guesty/);
    });
  });

  describe('Firebase Architecture Integrity', () => {
    let firebaseListingsContent;
    
    beforeAll(() => {
      const firebasePath = path.join(__dirname, '../lib/firebase-listings.ts');
      firebaseListingsContent = fs.readFileSync(firebasePath, 'utf8');
    });

    test('should have fallback handling for missing Firebase config', () => {
      expect(firebaseListingsContent).toMatch(/hasValidFirebaseConfig/);
      expect(firebaseListingsContent).toMatch(/using fallback mode/);
    });

    test('should have default listings data', () => {
      expect(firebaseListingsContent).toMatch(/DEFAULT_LISTINGS/);
      expect(firebaseListingsContent).toMatch(/airbnb\.co\.uk\/h\/eklv/);   // Entire Villa
      expect(firebaseListingsContent).toMatch(/airbnb\.co\.uk\/h\/klv6/);   // Master Suite
      expect(firebaseListingsContent).toMatch(/airbnb\.co\.uk\/h\/klv2or3/); // Triple/Twin
    });
  });

  describe('Gallery System Integrity', () => {
    let galleryPageContent;
    let galleryApiContent;
    
    beforeAll(() => {
      const galleryPagePath = path.join(__dirname, '../app/gallery/page.tsx');
      const galleryApiPath = path.join(__dirname, '../app/api/gallery/list/route.ts');
      
      galleryPageContent = fs.readFileSync(galleryPagePath, 'utf8');
      galleryApiContent = fs.readFileSync(galleryApiPath, 'utf8');
    });

    test('gallery page should not be stuck in loading state', () => {
      expect(galleryPageContent).not.toMatch(/if \(loading\)/);
    });

    test('gallery API should read from filesystem', () => {
      expect(galleryApiContent).toMatch(/public.*uploads.*gallery/);
    });

    test('gallery images should exist in filesystem', () => {
      const galleryDir = path.join(__dirname, '../public/uploads/gallery');
      expect(fs.existsSync(galleryDir)).toBe(true);
      
      // Count images - should have multiple files
      const countImages = (dir) => {
        let count = 0;
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            count += countImages(fullPath);
          } else if (/\.(jpg|jpeg|png|mp4)$/i.test(file)) {
            count++;
          }
        });
        return count;
      };
      
      expect(countImages(galleryDir)).toBeGreaterThan(50); // Should have many images
    });
  });

  describe('AI/OpenAI Integration', () => {
    let aiTagContent;
    
    beforeAll(() => {
      const aiTagPath = path.join(__dirname, '../app/api/gallery/ai-tag/route.ts');
      aiTagContent = fs.readFileSync(aiTagPath, 'utf8');
    });

    test('should use real OpenAI integration, not mock data', () => {
      expect(aiTagContent).toMatch(/openai\.chat\.completions\.create/);
      expect(aiTagContent).toMatch(/gpt-4o/);
    });

    test('should have fallback for missing OpenAI key', () => {
      expect(aiTagContent).toMatch(/OPENAI_API_KEY/);
      expect(aiTagContent).toMatch(/getMockResponse/);
    });
  });

  describe('Vercel Deployment Configuration', () => {
    test('vercel.json should exist with proper configuration', () => {
      const vercelPath = path.join(__dirname, '../vercel.json');
      expect(fs.existsSync(vercelPath)).toBe(true);
      
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      expect(vercelConfig.functions).toBeDefined();
      expect(vercelConfig.functions['app/api/gallery/ai-tag/route.ts']).toBeDefined();
    });

    test('.vercelignore should not exclude gallery images', () => {
      const vercelIgnorePath = path.join(__dirname, '../.vercelignore');
      const vercelIgnoreContent = fs.readFileSync(vercelIgnorePath, 'utf8');
      expect(vercelIgnoreContent).not.toMatch(/public\/uploads\/gallery/);
    });
  });
});

console.log('🧪 Ko Lake Villa Regression Prevention Tests');
console.log('Run with: npm test regression-prevention.test.js'); 