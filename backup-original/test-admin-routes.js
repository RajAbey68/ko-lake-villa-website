/**
 * Admin Routes Test - Verify admin functionality works in production
 */

async function testAdminRoutes() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🔧 Testing Admin Routes...\n');
  
  let passed = 0;
  let failed = 0;
  
  function logTest(test, status, details = '') {
    const statusColor = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusColor} ${test}${details ? ` - ${details}` : ''}`);
    if (status === 'PASS') passed++; else failed++;
  }
  
  // Test admin API endpoints
  const adminEndpoints = [
    '/api/admin/gallery',
    '/api/admin/pricing', 
    '/api/admin/content',
    '/api/admin/statistics'
  ];
  
  for (const endpoint of adminEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        logTest(`Admin API: ${endpoint}`, 'PASS', `Status: ${response.status}`);
      } else {
        logTest(`Admin API: ${endpoint}`, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest(`Admin API: ${endpoint}`, 'FAIL', error.message);
    }
  }
  
  // Test admin page accessibility
  const adminPages = [
    '/admin/login',
    '/admin/dashboard', 
    '/admin/gallery',
    '/admin/content'
  ];
  
  for (const page of adminPages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      if (response.ok) {
        const html = await response.text();
        if (html.includes('Admin interface not built')) {
          logTest(`Admin Page: ${page}`, 'FAIL', 'Build error message shown');
        } else if (html.includes('<!DOCTYPE html>')) {
          logTest(`Admin Page: ${page}`, 'PASS', 'Page loads correctly');
        } else {
          logTest(`Admin Page: ${page}`, 'FAIL', 'Invalid HTML response');
        }
      } else {
        logTest(`Admin Page: ${page}`, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest(`Admin Page: ${page}`, 'FAIL', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('ADMIN ROUTES TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 ADMIN SYSTEM WORKING PERFECTLY!');
    console.log('\n✅ Admin Status:');
    console.log('- All API endpoints accessible');
    console.log('- Admin pages load correctly');
    console.log('- No build errors detected');
    console.log('\n🔗 Access Admin: http://localhost:5000/admin');
  } else {
    console.log('\n⚠️ Admin system issues detected');
    console.log('\n🔧 Recommended fixes:');
    console.log('- Check admin component imports');
    console.log('- Verify route configurations');
    console.log('- Test authentication system');
  }
  
  return { passed, failed, ready: failed === 0 };
}

testAdminRoutes().catch(console.error);