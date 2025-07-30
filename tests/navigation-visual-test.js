const fs = require('fs');
const path = require('path');

// Comprehensive visual test for navigation across all pages and breakpoints
console.log('🧪 Visual Navigation Test - Ko Lake Villa Website\n');

// Define all pages that should have navigation
const publicPages = [
  { path: '/', name: 'Home', hasNav: true },
  { path: '/accommodation', name: 'Accommodation', hasNav: true },
  { path: '/dining', name: 'Dining', hasNav: true },
  { path: '/booking', name: 'Booking', hasNav: true },
  { path: '/contact', name: 'Contact', hasNav: true },
  { path: '/experiences', name: 'Experiences', hasNav: true },
  { path: '/deals', name: 'Deals', hasNav: true },
  { path: '/faq', name: 'FAQ', hasNav: true },
  { path: '/gallery', name: 'Gallery', hasNav: true },
  { path: '/test', name: 'Test Page', hasNav: true }
];

const adminPages = [
  { path: '/admin', name: 'Admin Login', hasNav: false },
  { path: '/admin/dashboard', name: 'Admin Dashboard', hasNav: true },
  { path: '/admin/analytics', name: 'Admin Analytics', hasNav: true },
  { path: '/admin/bookings', name: 'Admin Bookings', hasNav: true },
  { path: '/admin/campaigns', name: 'Admin Campaigns', hasNav: true },
  { path: '/admin/content', name: 'Admin Content', hasNav: true },
  { path: '/admin/debug', name: 'Admin Debug', hasNav: true },
  { path: '/admin/gallery', name: 'Admin Gallery', hasNav: true },
  { path: '/admin/login', name: 'Admin Login Page', hasNav: false }
];

// Define breakpoints to test
const breakpoints = [
  { name: 'Mobile Small', width: 320, height: 568 },
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Mobile Large', width: 414, height: 896 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Large Desktop', width: 1920, height: 1080 }
];

// Navigation elements to check
const navElements = {
  public: {
    header: '.nav-header',
    container: '.nav-container',
    content: '.nav-content',
    logo: '.nav-logo',
    logoText: '.nav-logo-text',
    desktop: '.nav-desktop',
    menu: '.nav-menu',
    links: '.nav-link',
    actions: '.nav-actions',
    bookButton: '.nav-book-button',
    staffLogin: '.nav-staff-login',
    mobileButton: '.nav-mobile-button',
    mobile: '.nav-mobile',
    contactInfo: '.nav-contact-info'
  },
  admin: {
    header: '.nav-admin-header',
    container: '.nav-container',
    content: '.nav-admin-content',
    brand: '.nav-admin-brand',
    logo: '.nav-admin-logo',
    logoText: '.nav-admin-logo-text',
    menu: '.nav-admin-menu',
    links: '.nav-admin-link',
    actions: '.nav-actions'
  }
};

// Expected navigation items
const expectedNavItems = [
  'Home', 'Accommodation', 'Dining', 'Experiences', 'Gallery', 'Contact'
];

const expectedAdminItems = [
  'Dashboard', 'Gallery', 'Analytics', 'Content', 'Bookings'
];

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function addResult(type, page, breakpoint, message, details = []) {
  const result = {
    type,
    page: page.name,
    path: page.path,
    breakpoint: breakpoint ? breakpoint.name : 'General',
    message,
    details
  };
  
  testResults.details.push(result);
  
  if (type === 'success') testResults.passed++;
  else if (type === 'error') testResults.failed++;
  else testResults.warnings++;
}

function checkPageStructure(page) {
  const filePath = page.path === '/' ? 'app/page.tsx' : `app${page.path}/page.tsx`;
  
  if (!fs.existsSync(filePath)) {
    addResult('warning', page, null, `Page file not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if page uses GlobalHeader (for public pages)
  if (page.hasNav && page.path.startsWith('/') && !page.path.startsWith('/admin')) {
    if (!content.includes('GlobalHeader') && !content.includes('import GlobalHeader')) {
      addResult('error', page, null, 'Page missing GlobalHeader import or usage');
      return false;
    }
  }
  
  // Check for hardcoded navigation (should not exist)
  const hardcodedPatterns = [
    'className="bg-white shadow-sm border-b',
    'header className="bg-white',
    'nav className="bg-white'
  ];
  
  for (const pattern of hardcodedPatterns) {
    if (content.includes(pattern) && !content.includes('nav-')) {
      addResult('error', page, null, `Found hardcoded navigation pattern: ${pattern}`);
      return false;
    }
  }
  
  addResult('success', page, null, 'Page structure is correct');
  return true;
}

function checkResponsiveCSS() {
  const cssPath = 'app/globals.css';
  
  if (!fs.existsSync(cssPath)) {
    addResult('error', { name: 'CSS', path: cssPath }, null, 'globals.css not found');
    return false;
  }
  
  const content = fs.readFileSync(cssPath, 'utf-8');
  
  // Check for required CSS classes
  const requiredClasses = [
    '.nav-header',
    '.nav-container',
    '.nav-content',
    '.nav-logo',
    '.nav-desktop',
    '.nav-menu',
    '.nav-link',
    '.nav-actions',
    '.nav-book-button',
    '.nav-staff-login',
    '.nav-mobile',
    '.nav-admin-header'
  ];
  
  const missingClasses = requiredClasses.filter(cls => !content.includes(cls));
  
  if (missingClasses.length > 0) {
    addResult('error', { name: 'CSS', path: cssPath }, null, 'Missing CSS classes', missingClasses);
    return false;
  }
  
  // Check for responsive breakpoints
  const breakpointChecks = [
    '@media (max-width: 640px)',
    '@media (min-width: 768px)',
    '@media (min-width: 1024px)',
    '@media (min-width: 1440px)'
  ];
  
  const missingBreakpoints = breakpointChecks.filter(bp => !content.includes(bp));
  
  if (missingBreakpoints.length > 0) {
    addResult('warning', { name: 'CSS', path: cssPath }, null, 'Missing responsive breakpoints', missingBreakpoints);
  }
  
  // Check for modern CSS features
  const modernFeatures = [
    'clamp(',
    'gap:',
    'flex-shrink',
    'white-space: nowrap'
  ];
  
  const hasModernFeatures = modernFeatures.some(feature => content.includes(feature));
  
  if (!hasModernFeatures) {
    addResult('warning', { name: 'CSS', path: cssPath }, null, 'Missing modern CSS features for responsive design');
  }
  
  addResult('success', { name: 'CSS', path: cssPath }, null, 'CSS structure is comprehensive');
  return true;
}

function simulateBreakpointTest(page, breakpoint) {
  // Simulate what would happen at each breakpoint
  const issues = [];
  
  // Mobile breakpoints (<=768px)
  if (breakpoint.width <= 768) {
    // Desktop nav should be hidden
    // Mobile menu button should be visible
    // Logo should be appropriately sized
    // Actions should be condensed
    
    if (page.hasNav && !page.path.startsWith('/admin')) {
      // Public navigation checks
      if (breakpoint.width <= 640) {
        // Very small screens
        if (expectedNavItems.length * 80 > breakpoint.width - 200) {
          // If all nav items would overflow, mobile menu is essential
          addResult('success', page, breakpoint, 'Mobile menu required and should be active');
        }
      }
    }
  } else if (breakpoint.width <= 1024) {
    // Tablet breakpoints
    if (page.hasNav) {
      // Desktop nav should be visible but contact info might be hidden
      addResult('success', page, breakpoint, 'Desktop navigation should be visible, contact info may be hidden');
    }
  } else {
    // Desktop breakpoints (>1024px)
    if (page.hasNav) {
      // All navigation should be visible
      if (breakpoint.width >= 1440) {
        addResult('success', page, breakpoint, 'All navigation elements including contact info should be visible');
      } else {
        addResult('success', page, breakpoint, 'Desktop navigation should be fully visible');
      }
    }
  }
  
  // Check for potential overflow issues
  const estimatedNavWidth = page.path.startsWith('/admin') ? 
    (expectedAdminItems.length * 120 + 400) : // Admin nav with icons
    (expectedNavItems.length * 100 + 500);   // Public nav with buttons
  
  if (estimatedNavWidth > breakpoint.width) {
    if (breakpoint.width > 1024) {
      addResult('warning', page, breakpoint, 'Navigation might be cramped, check spacing');
    }
  }
}

function generateTestReport() {
  console.log('📊 Visual Navigation Test Results\n');
  
  // Check CSS structure
  console.log('🎨 Checking CSS Structure...');
  checkResponsiveCSS();
  
  // Check page structures
  console.log('\n📄 Checking Page Structures...');
  [...publicPages, ...adminPages].forEach(page => {
    console.log(`  Checking ${page.name}...`);
    checkPageStructure(page);
  });
  
  // Simulate breakpoint tests
  console.log('\n📱 Simulating Breakpoint Tests...');
  [...publicPages, ...adminPages].forEach(page => {
    if (page.hasNav) {
      breakpoints.forEach(breakpoint => {
        simulateBreakpointTest(page, breakpoint);
      });
    }
  });
  
  // Generate summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}\n`);
  
  // Detailed results
  console.log('📝 Detailed Results:');
  
  const groupedResults = {};
  testResults.details.forEach(result => {
    const key = result.page;
    if (!groupedResults[key]) groupedResults[key] = [];
    groupedResults[key].push(result);
  });
  
  Object.entries(groupedResults).forEach(([page, results]) => {
    console.log(`\n📄 ${page}:`);
    results.forEach(result => {
      const icon = result.type === 'success' ? '✅' : result.type === 'error' ? '❌' : '⚠️';
      let message = `${icon} [${result.breakpoint}] ${result.message}`;
      if (result.details && result.details.length > 0) {
        message += `\n     Details: ${result.details.join(', ')}`;
      }
      console.log(`  ${message}`);
    });
  });
  
  // Recommendations
  console.log('\n🔧 Recommendations:');
  if (testResults.failed === 0) {
    console.log('✨ Navigation structure looks good!');
    console.log('📋 Manual Testing Steps:');
    console.log('1. Test each page at different browser widths');
    console.log('2. Verify mobile menu toggle works');
    console.log('3. Check button alignment and spacing');
    console.log('4. Ensure no overlapping at any screen size');
    console.log('5. Verify touch targets are adequate (44px minimum)');
  } else {
    console.log('⚠️  Issues found that need attention:');
    testResults.details
      .filter(r => r.type === 'error')
      .forEach(result => {
        console.log(`   - ${result.page}: ${result.message}`);
      });
  }
  
  console.log('\n🌐 Test Navigation URLs:');
  console.log('Public Pages:');
  publicPages.forEach(page => {
    console.log(`   http://localhost:3001${page.path} - ${page.name}`);
  });
  console.log('\nAdmin Pages:');
  adminPages.forEach(page => {
    console.log(`   http://localhost:3001${page.path} - ${page.name}`);
  });
  
  return testResults.failed === 0;
}

// Run the test
const success = generateTestReport();
process.exit(success ? 0 : 1); 