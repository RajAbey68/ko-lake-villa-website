const fs = require('fs');
const path = require('path');

// Test script to verify navigation consistency across the website
console.log('🔍 Testing Navigation Consistency Across Ko Lake Villa Website\n');

// Define the expected unified CSS classes that should be used
const expectedClasses = {
  header: ['nav-header', 'nav-admin-header'],
  container: ['nav-container'],
  content: ['nav-content', 'nav-admin-content'],
  logo: ['nav-logo', 'nav-admin-logo'],
  logoText: ['nav-logo-text', 'nav-admin-logo-text'],
  desktop: ['nav-desktop'],
  menu: ['nav-menu', 'nav-admin-menu'],
  link: ['nav-link', 'nav-admin-link'],
  linkActive: ['nav-link-active', 'nav-admin-link-active'],
  linkInactive: ['nav-link-inactive', 'nav-admin-link-inactive'],
  actions: ['nav-actions'],
  mobileButton: ['nav-mobile-button'],
  mobile: ['nav-mobile'],
  mobileMenu: ['nav-mobile-menu'],
  mobileLink: ['nav-mobile-link'],
  mobileLinkActive: ['nav-mobile-link-active'],
  mobileLinkInactive: ['nav-mobile-link-inactive']
};

// Define files that should use unified navigation
const navigationFiles = [
  'components/navigation/global-header.tsx',
  'app/admin/layout.tsx',
  'components/mobile-menu.tsx',
  'replit_source/client/src/components/Header.tsx',
  'replit_source/client/src/components/AdminNavigation.tsx'
];

// Define pages that should use GlobalHeader
const pageFiles = [
  'app/accommodation/page.tsx',
  'app/dining/page.tsx',
  'app/booking/page.tsx',
  'app/contact/page.tsx',
  'app/experiences/page.tsx',
  'app/deals/page.tsx',
  'app/faq/page.tsx'
];

// Forbidden patterns that indicate hardcoded navigation styles
const forbiddenPatterns = [
  /bg-white.*shadow-sm.*border-b.*(?!nav-)/,
  /className="[^"]*bg-white[^"]*shadow-sm[^"]*border-b/,
  /header.*className="[^"]*bg-white[^"]*(?!nav-)/,
  /nav.*className="[^"]*bg-white[^"]*(?!nav-)/,
  /className="[^"]*fixed[^"]*w-full[^"]*bg-\[#[A-F0-9]{6}\]/,
  /text-\[#[A-F0-9]{6}\]/, // Custom hex colors
  /bg-\[#[A-F0-9]{6}\]/,   // Custom hex backgrounds
];

let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function checkFile(filePath, isNavigationComponent = false) {
  if (!fs.existsSync(filePath)) {
    testResults.warnings++;
    testResults.details.push({
      type: 'warning',
      file: filePath,
      message: 'File does not exist'
    });
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  // Check for forbidden patterns
  forbiddenPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push(`Found hardcoded navigation style (pattern ${index + 1}): ${matches[0]}`);
    }
  });

  // For navigation components, check if they use unified classes
  if (isNavigationComponent) {
    const hasUnifiedClasses = Object.values(expectedClasses).flat().some(className => 
      content.includes(className)
    );
    
    if (!hasUnifiedClasses) {
      issues.push('Navigation component does not use unified CSS classes');
    }
  }

  // For page files, check if they use GlobalHeader
  if (pageFiles.includes(filePath)) {
    if (!content.includes('GlobalHeader') && !content.includes('import GlobalHeader')) {
      issues.push('Page does not import or use GlobalHeader component');
    }
  }

  // Check for old navigation patterns
  const oldPatterns = [
    'className="bg-white shadow-sm border-b',
    'header className="bg-white',
    'nav className="bg-white',
    'hidden lg:flex items-center space-x-8',
    'text-amber-700 hover:text-orange-500'
  ];

  oldPatterns.forEach(pattern => {
    if (content.includes(pattern) && !content.includes('nav-')) {
      issues.push(`Found old navigation pattern: ${pattern}`);
    }
  });

  if (issues.length === 0) {
    testResults.passed++;
    testResults.details.push({
      type: 'success',
      file: filePath,
      message: 'Navigation styling is consistent ✅'
    });
  } else {
    testResults.failed++;
    testResults.details.push({
      type: 'error',
      file: filePath,
      message: 'Navigation styling issues found',
      issues: issues
    });
  }
}

// Test navigation components
console.log('📋 Testing Navigation Components:');
navigationFiles.forEach(file => {
  console.log(`  Checking ${file}...`);
  checkFile(file, true);
});

console.log('\n📄 Testing Page Components:');
pageFiles.forEach(file => {
  console.log(`  Checking ${file}...`);
  checkFile(file, false);
});

// Additional checks for CSS consistency
console.log('\n🎨 Testing CSS Consistency:');
const globalsCssPath = 'app/globals.css';
if (fs.existsSync(globalsCssPath)) {
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf-8');
  
  // Check if unified navigation classes are defined
  const requiredClasses = [
    '.nav-header',
    '.nav-container',
    '.nav-content',
    '.nav-logo',
    '.nav-desktop',
    '.nav-mobile',
    '.nav-admin-header'
  ];
  
  const missingClasses = requiredClasses.filter(className => 
    !globalsContent.includes(className)
  );
  
  if (missingClasses.length === 0) {
    testResults.passed++;
    testResults.details.push({
      type: 'success',
      file: globalsCssPath,
      message: 'All unified navigation CSS classes are defined ✅'
    });
  } else {
    testResults.failed++;
    testResults.details.push({
      type: 'error',
      file: globalsCssPath,
      message: 'Missing unified navigation CSS classes',
      issues: missingClasses.map(cls => `Missing class: ${cls}`)
    });
  }
} else {
  testResults.failed++;
  testResults.details.push({
    type: 'error',
    file: globalsCssPath,
    message: 'globals.css file not found'
  });
}

// Print results
console.log('\n📊 Test Results Summary:');
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}\n`);

console.log('📝 Detailed Results:');
testResults.details.forEach(result => {
  const icon = result.type === 'success' ? '✅' : result.type === 'error' ? '❌' : '⚠️';
  console.log(`${icon} ${result.file}`);
  console.log(`   ${result.message}`);
  if (result.issues) {
    result.issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
  }
  console.log('');
});

// Final assessment
if (testResults.failed === 0) {
  console.log('🎉 All navigation components are using consistent styling!');
  console.log('✨ The website navigation is now unified across all pages and screen sizes.');
} else {
  console.log('⚠️  Some navigation inconsistencies were found.');
  console.log('📋 Please review the issues above and ensure all components use unified CSS classes.');
}

console.log('\n🔧 Unified CSS Classes Reference:');
console.log('Main Navigation: nav-header, nav-container, nav-content, nav-logo, nav-desktop');
console.log('Admin Navigation: nav-admin-header, nav-admin-content, nav-admin-logo, nav-admin-menu');
console.log('Mobile Navigation: nav-mobile, nav-mobile-menu, nav-mobile-link');
console.log('Links: nav-link, nav-link-active, nav-link-inactive');
console.log('Actions: nav-actions, nav-book-button, nav-mobile-button');

process.exit(testResults.failed > 0 ? 1 : 0); 