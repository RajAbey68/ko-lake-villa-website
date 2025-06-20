/**
 * Production Validation Test Suite
 * Tests core functionality without server restart
 */

const tests = {
  passed: [],
  failed: [],
  warnings: []
};

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = { method, headers: { 'Content-Type': 'application/json' }};
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`http://localhost:5000${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, error: error.message, ok: false };
  }
}

async function validateCoreAPIs() {
  console.log('Testing Core APIs...');
  
  // Test rooms API
  const rooms = await testAPI('/api/rooms');
  if (rooms.ok && Array.isArray(rooms.data)) {
    tests.passed.push('Rooms API functional');
  } else {
    tests.failed.push('Rooms API failed');
  }
  
  // Test activities API  
  const activities = await testAPI('/api/activities');
  if (activities.ok && Array.isArray(activities.data)) {
    tests.passed.push('Activities API functional');
  } else {
    tests.failed.push('Activities API failed');
  }
  
  // Test gallery API
  const gallery = await testAPI('/api/gallery');
  if (gallery.ok && Array.isArray(gallery.data)) {
    tests.passed.push(`Gallery API functional (${gallery.data.length} images)`);
  } else {
    tests.failed.push('Gallery API failed');
  }
}

async function validateUploadSystem() {
  console.log('Testing Upload System...');
  
  // Test upload endpoint availability
  const upload = await testAPI('/api/upload', 'POST');
  if (upload.status === 400 && upload.data?.message?.includes('No file')) {
    tests.passed.push('Upload endpoint functional');
  } else {
    tests.failed.push('Upload endpoint not responding correctly');
  }
  
  // Test admin gallery access
  const adminGallery = await testAPI('/api/admin/gallery');
  if (adminGallery.ok) {
    tests.passed.push('Admin gallery access working');
  } else {
    tests.failed.push('Admin gallery access failed');
  }
}

async function validateIntegratedFeatures() {
  console.log('Testing Integrated Features...');
  
  // Test contact form endpoint
  const contact = await testAPI('/api/contact', 'POST');
  if (contact.status === 400) {
    tests.passed.push('Contact form validation working');
  } else {
    tests.warnings.push('Contact form endpoint response unexpected');
  }
  
  // Test newsletter endpoint
  const newsletter = await testAPI('/api/newsletter', 'POST');
  if (newsletter.status === 400) {
    tests.passed.push('Newsletter validation working');
  } else {
    tests.warnings.push('Newsletter endpoint response unexpected');
  }
}

async function validateDeploymentReadiness() {
  console.log('Checking Deployment Readiness...');
  
  // Check if critical files exist
  const fs = await import('fs');
  
  const criticalFiles = [
    '.github/workflows/deploy.yml',
    'client/src/lib/i18n.ts',
    'client/src/lib/withAuth.tsx',
    'client/src/lib/aiTagStub.ts',
    '.gitignore',
    'DEPLOYMENT_READY.md'
  ];
  
  for (const file of criticalFiles) {
    if (fs.existsSync(file)) {
      tests.passed.push(`${file} exists`);
    } else {
      tests.failed.push(`Missing: ${file}`);
    }
  }
}

async function runProductionValidation() {
  console.log('Ko Lake Villa - Production Validation');
  console.log('=====================================\n');
  
  await validateCoreAPIs();
  await validateUploadSystem();
  await validateIntegratedFeatures();
  await validateDeploymentReadiness();
  
  console.log('\nValidation Results:');
  console.log('==================');
  
  if (tests.failed.length > 0) {
    console.log('\nFAILED TESTS:');
    tests.failed.forEach(test => console.log(`❌ ${test}`));
  }
  
  if (tests.warnings.length > 0) {
    console.log('\nWARNINGS:');
    tests.warnings.forEach(test => console.log(`⚠️ ${test}`));
  }
  
  console.log('\nPASSED TESTS:');
  tests.passed.forEach(test => console.log(`✅ ${test}`));
  
  const deploymentReady = tests.failed.length === 0;
  
  console.log('\nDEPLOYMENT STATUS:');
  if (deploymentReady) {
    console.log('✅ READY FOR PRODUCTION DEPLOYMENT');
    console.log('All critical systems validated successfully');
  } else {
    console.log('❌ NOT READY FOR DEPLOYMENT');
    console.log(`${tests.failed.length} critical issues need resolution`);
  }
  
  console.log(`\nSummary: ${tests.passed.length} passed, ${tests.failed.length} failed, ${tests.warnings.length} warnings`);
}

runProductionValidation();