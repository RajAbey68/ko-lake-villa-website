#!/usr/bin/env node

/**
 * Ko Lake Villa - Visual Regression Testing
 * Tests for UI consistency and visual changes
 */

const { execSync } = require('child_process');
const fs = require('fs');

class VisualRegressionTester {
  constructor() {
    this.testPages = [
      { url: '/', name: 'Homepage', critical: true },
      { url: '/accommodation', name: 'Accommodation', critical: true },
      { url: '/dining', name: 'Dining', critical: true },
      { url: '/experiences', name: 'Experiences', critical: true },
      { url: '/gallery', name: 'Gallery', critical: true },
      { url: '/admin', name: 'Admin', critical: false },
      { url: '/contact', name: 'Contact', critical: true },
      { url: '/faq', name: 'FAQ', critical: false },
      { url: '/testing', name: 'Testing Suite', critical: false }
    ];
    
    this.viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
  }

  async testResponsiveDesign() {
    console.log('📱 Testing Responsive Design...');
    
    // Check for responsive classes in key components
    const responsiveTests = [
      {
        file: 'app/page.tsx',
        patterns: ['md:', 'lg:', 'sm:', 'xl:'],
        name: 'Homepage Responsive Classes'
      },
      {
        file: 'app/gallery/page.tsx', 
        patterns: ['grid-cols-1', 'md:grid-cols-', 'lg:grid-cols-'],
        name: 'Gallery Responsive Grid'
      }
    ];
    
    responsiveTests.forEach(test => {
      if (fs.existsSync(test.file)) {
        const content = fs.readFileSync(test.file, 'utf8');
        const hasResponsive = test.patterns.some(pattern => content.includes(pattern));
        console.log(`${hasResponsive ? '✅' : '❌'} ${test.name}`);
      }
    });
  }

  async testAccessibility() {
    console.log('♿ Testing Accessibility...');
    
    // Check for accessibility attributes
    const accessibilityChecks = [
      { pattern: 'alt=', description: 'Image Alt Tags' },
      { pattern: 'aria-', description: 'ARIA Attributes' },
      { pattern: 'role=', description: 'Role Attributes' },
      { pattern: 'tabIndex', description: 'Tab Navigation' }
    ];
    
    const pageFiles = [
      'app/page.tsx',
      'app/gallery/page.tsx',
      'app/accommodation/page.tsx'
    ];
    
    pageFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        accessibilityChecks.forEach(check => {
          const hasPattern = content.includes(check.pattern);
          if (hasPattern) {
            console.log(`✅ ${file}: ${check.description}`);
          }
        });
      }
    });
  }

  async testBrandConsistency() {
    console.log('🎨 Testing Brand Consistency...');
    
    const brandElements = {
      colors: {
        allowed: ['amber-', 'orange-', 'gray-', 'white', 'black'],
        prohibited: ['blue-', 'green-', 'purple-', 'red-'],
        required: ['amber-600', 'amber-700', 'amber-800']
      },
      typography: {
        fonts: ['Inter', 'font-bold', 'font-light'],
        sizes: ['text-4xl', 'text-5xl', 'text-7xl']
      }
    };
    
    const styleFiles = ['app/page.tsx', 'app/globals.css', 'tailwind.config.ts'];
    
    styleFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for prohibited colors
        brandElements.colors.prohibited.forEach(color => {
          if (content.includes(color)) {
            console.log(`❌ ${file}: Prohibited color ${color} found`);
          }
        });
        
        // Check for required colors
        brandElements.colors.required.forEach(color => {
          if (content.includes(color)) {
            console.log(`✅ ${file}: Required color ${color} present`);
          }
        });
      }
    });
  }

  async generateVisualTestScript() {
    const playwrightScript = `
// Playwright Visual Regression Tests
// Run with: npx playwright test visual-tests.spec.js

const { test, expect } = require('@playwright/test');

${this.testPages.map(page => `
test('Visual: ${page.name} - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('${page.url}');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('${page.name.toLowerCase()}-desktop.png');
});

test('Visual: ${page.name} - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('${page.url}');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('${page.name.toLowerCase()}-mobile.png');
});`).join('\n')}

// Interactive Tests
test('Gallery Interaction Test', async ({ page }) => {
  await page.goto('/gallery');
  await page.waitForLoadState('networkidle');
  
  // Test filter buttons
  await page.click('button:has-text("Pool")');
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('gallery-pool-filter.png');
  
  // Test image modal
  await page.click('img').first();
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toHaveScreenshot('gallery-modal.png');
});

test('WhatsApp Integration Test', async ({ page }) => {
  await page.goto('/');
  
  // Mock WhatsApp link
  await page.route('https://wa.me/**', route => route.fulfill({
    status: 200,
    body: 'WhatsApp integration working'
  }));
  
  await page.click('button:has-text("WhatsApp")');
  // Verify link was called (would open in new tab)
});
`;

    fs.writeFileSync('tests/visual-regression.spec.js', playwrightScript);
    console.log('✅ Generated Playwright visual tests: tests/visual-regression.spec.js');
  }

  async runTests() {
    console.log('🎭 STARTING VISUAL REGRESSION TESTS\n');
    
    await this.testResponsiveDesign();
    await this.testAccessibility();
    await this.testBrandConsistency();
    await this.generateVisualTestScript();
    
    console.log('\n📊 Visual Testing Complete');
    console.log('Run full visual tests with: npx playwright test tests/visual-regression.spec.js');
  }
}

// Execute if run directly
if (require.main === module) {
  const tester = new VisualRegressionTester();
  tester.runTests().catch(console.error);
}

module.exports = VisualRegressionTester; 