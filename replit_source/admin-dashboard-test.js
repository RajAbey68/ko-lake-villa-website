/**
 * Admin Dashboard Comprehensive Test
 * Tests all admin routes and functionality
 */

async function testAdminRoutes() {
  console.log('Testing admin dashboard routes...');
  
  const routes = [
    { path: '/admin', name: 'Admin Landing' },
    { path: '/admin/login', name: 'Admin Login' },
    { path: '/admin/dashboard', name: 'Admin Dashboard' },
    { path: '/admin/gallery', name: 'Gallery Manager' },
    { path: '/admin/content', name: 'Content Manager' },
    { path: '/admin/content-manager', name: 'Content Manager Alt' },
    { path: '/admin/statistics', name: 'Statistics' },
    { path: '/admin/testing', name: 'Deployment Testing' }
  ];
  
  const results = [];
  
  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:5000${route.path}`);
      const status = response.status;
      const success = status === 200 || status === 302;
      
      results.push({
        route: route.path,
        name: route.name,
        status,
        success,
        message: success ? 'PASS' : `FAIL - Status ${status}`
      });
      
      console.log(`${route.name}: ${success ? '✅' : '❌'} ${status}`);
      
    } catch (error) {
      results.push({
        route: route.path,
        name: route.name,
        status: 'ERROR',
        success: false,
        message: `FAIL - ${error.message}`
      });
      
      console.log(`${route.name}: ❌ ERROR - ${error.message}`);
    }
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n=== ADMIN DASHBOARD TEST RESULTS ===');
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed routes:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.route}: ${r.message}`);
    });
  }
  
  return { passed, failed, results };
}

async function testAdminAPIs() {
  console.log('\nTesting admin API endpoints...');
  
  const apis = [
    { path: '/api/admin/dashboard', name: 'Dashboard API' },
    { path: '/api/admin/gallery', name: 'Gallery API' },
    { path: '/api/admin/pricing', name: 'Pricing API' },
    { path: '/api/gallery', name: 'Gallery Data' },
    { path: '/api/rooms', name: 'Rooms Data' },
    { path: '/api/content', name: 'Content Data' }
  ];
  
  for (const api of apis) {
    try {
      const response = await fetch(`http://localhost:5000${api.path}`);
      const success = response.status === 200;
      console.log(`${api.name}: ${success ? '✅' : '❌'} ${response.status}`);
    } catch (error) {
      console.log(`${api.name}: ❌ ERROR - ${error.message}`);
    }
  }
}

async function runAdminTests() {
  console.log('🔧 Starting Admin Dashboard Comprehensive Test\n');
  
  const routeResults = await testAdminRoutes();
  await testAdminAPIs();
  
  console.log('\n=== FINAL SUMMARY ===');
  if (routeResults.failed === 0) {
    console.log('🎉 All admin routes working correctly!');
  } else {
    console.log(`⚠️  ${routeResults.failed} admin routes need fixing`);
  }
}

runAdminTests();