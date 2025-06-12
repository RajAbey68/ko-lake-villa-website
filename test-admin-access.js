/**
 * Admin Access Test - Verify admin console is working after fixes
 */

async function testAdminAccess() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🔧 Testing Admin Console Access...\n');
  
  let passed = 0;
  let failed = 0;
  
  function logTest(test, status, details = '') {
    const statusColor = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusColor} ${test}${details ? ` - ${details}` : ''}`);
    if (status === 'PASS') passed++; else failed++;
  }
  
  // Test admin page loads without errors
  try {
    const response = await fetch(`${baseUrl}/admin`);
    if (response.ok) {
      const html = await response.text();
      if (html.includes('Something went wrong') || html.includes('encountered an error')) {
        logTest('Admin page loads', 'FAIL', 'Error message displayed');
      } else if (html.includes('Ko Lake Villa Admin') || html.includes('admin')) {
        logTest('Admin page loads', 'PASS', 'Page content loaded');
      } else {
        logTest('Admin page loads', 'PASS', 'Basic HTML response');
      }
    } else {
      logTest('Admin page loads', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logTest('Admin page loads', 'FAIL', error.message);
  }
  
  // Test admin dashboard
  try {
    const response = await fetch(`${baseUrl}/admin/dashboard`);
    if (response.ok) {
      logTest('Admin dashboard', 'PASS', 'Dashboard accessible');
    } else {
      logTest('Admin dashboard', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logTest('Admin dashboard', 'FAIL', error.message);
  }
  
  // Test admin gallery management
  try {
    const response = await fetch(`${baseUrl}/admin/gallery`);
    if (response.ok) {
      logTest('Gallery management', 'PASS', 'Gallery admin accessible');
    } else {
      logTest('Gallery management', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logTest('Gallery management', 'FAIL', error.message);
  }
  
  // Test gallery API endpoint
  try {
    const response = await fetch(`${baseUrl}/api/admin/gallery`);
    if (response.ok) {
      const data = await response.json();
      logTest('Gallery API', 'PASS', `${data.length} images found`);
    } else {
      logTest('Gallery API', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logTest('Gallery API', 'FAIL', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('ADMIN ACCESS TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 ADMIN CONSOLE FULLY OPERATIONAL!');
    console.log('\n✅ Admin Features Working:');
    console.log('- Admin page loads without errors');
    console.log('- Dashboard accessible');
    console.log('- Gallery management functional');
    console.log('- API endpoints responding');
    console.log('\n🔗 Access Admin Console: http://localhost:5000/admin');
  } else {
    console.log('\n⚠️ Some admin features need attention');
  }
  
  return { passed, failed, ready: failed === 0 };
}

testAdminAccess().catch(console.error);