
// Admin Authentication Test
console.log('🔐 Testing Admin Authentication System...');

async function testAdminAuth() {
  try {
    // Test admin login page
    const loginResponse = await fetch('/admin/login');
    console.log('✅ Admin login page accessible:', loginResponse.status);
    
    // Test protected dashboard route
    const dashboardResponse = await fetch('/admin/dashboard');
    console.log('🛡️ Dashboard protection status:', dashboardResponse.status);
    
    if (dashboardResponse.status === 302) {
      console.log('✅ Correct redirect behavior - dashboard is protected');
    } else if (dashboardResponse.status === 200) {
      console.log('⚠️ Dashboard accessible without auth - check protection');
    }
    
    // Test gallery API
    const galleryResponse = await fetch('/api/gallery');
    console.log('📸 Gallery API status:', galleryResponse.status);
    
    if (galleryResponse.ok) {
      const galleryData = await galleryResponse.json();
      console.log('📊 Gallery images found:', galleryData.length);
    }
    
  } catch (error) {
    console.error('❌ Auth test error:', error);
  }
}

testAdminAuth();
