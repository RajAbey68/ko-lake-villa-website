
/**
 * Ko Lake Villa - Quick Deployment Fix
 * Addresses common deployment failures
 */

async function quickFixDeployment() {
  console.log('🔧 Ko Lake Villa - Quick Deployment Fix\n');
  console.log('='.repeat(50));
  
  const fixes = [];
  const baseUrl = window.location.origin;
  
  // Fix 1: Test and Fix API Endpoints
  console.log('🔌 Checking API Endpoints...');
  
  try {
    const apiEndpoints = ['/api/rooms', '/api/gallery', '/api/activities'];
    
    for (const endpoint of apiEndpoints) {
      const response = await fetch(`${baseUrl}${endpoint}`);
      
      if (!response.ok) {
        fixes.push(`API ${endpoint} returning ${response.status}`);
        console.log(`❌ ${endpoint}: Status ${response.status}`);
        
        // Try to get error details
        try {
          const errorData = await response.text();
          console.log(`   Error details: ${errorData.substring(0, 100)}...`);
        } catch (e) {
          console.log(`   Could not read error details`);
        }
      } else {
        console.log(`✅ ${endpoint}: Working`);
      }
    }
  } catch (error) {
    fixes.push(`Network connectivity issues: ${error.message}`);
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  // Fix 2: Check Database Connection
  console.log('\n🗄️ Checking Database...');
  
  try {
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    
    if (galleryResponse.ok) {
      const data = await galleryResponse.json();
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ Database: ${data.length} images loaded`);
      } else {
        fixes.push('Database connected but no data found');
        console.log(`⚠️ Database: Connected but empty`);
      }
    } else {
      fixes.push(`Database connection failed: ${galleryResponse.status}`);
      console.log(`❌ Database: Connection failed (${galleryResponse.status})`);
    }
  } catch (error) {
    fixes.push(`Database error: ${error.message}`);
    console.log(`❌ Database Error: ${error.message}`);
  }
  
  // Fix 3: Check Static Files
  console.log('\n📁 Checking Static Files...');
  
  try {
    const staticTests = [
      { path: '/favicon.ico', name: 'Favicon' },
      { path: '/uploads', name: 'Uploads Directory' }
    ];
    
    for (const test of staticTests) {
      try {
        const response = await fetch(`${baseUrl}${test.path}`, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`✅ ${test.name}: Available`);
        } else {
          fixes.push(`${test.name} not accessible (${response.status})`);
          console.log(`❌ ${test.name}: Status ${response.status}`);
        }
      } catch (error) {
        fixes.push(`${test.name} error: ${error.message}`);
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`❌ Static Files Test Error: ${error.message}`);
  }
  
  // Fix 4: Environment Detection
  console.log('\n🌐 Environment Check...');
  
  const isDev = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  const isReplit = baseUrl.includes('replit.app') || baseUrl.includes('replit.dev');
  
  console.log(`Environment: ${isDev ? 'Development' : 'Production'}`);
  console.log(`Platform: ${isReplit ? 'Replit' : 'Other'}`);
  
  if (isDev) {
    fixes.push('Running in development mode - may cause production issues');
    console.log(`⚠️ Development mode detected`);
  }
  
  // Generate Fix Report
  console.log('\n' + '='.repeat(50));
  console.log('🔧 QUICK FIX RESULTS');
  console.log('='.repeat(50));
  
  if (fixes.length === 0) {
    console.log('✅ No critical issues detected');
    console.log('System appears to be working correctly');
  } else {
    console.log(`❌ ${fixes.length} issue(s) found:`);
    fixes.forEach((fix, index) => {
      console.log(`   ${index + 1}. ${fix}`);
    });
  }
  
  // Provide Solutions
  console.log('\n💡 QUICK SOLUTIONS:');
  
  if (fixes.some(f => f.includes('API'))) {
    console.log('🔌 API Issues:');
    console.log('   • Check if server is running on port 5000');
    console.log('   • Restart the application server');
    console.log('   • Check server logs for detailed errors');
  }
  
  if (fixes.some(f => f.includes('Database'))) {
    console.log('🗄️ Database Issues:');
    console.log('   • Verify database connection in server logs');
    console.log('   • Check if database file exists and is accessible');
    console.log('   • Run database initialization if needed');
  }
  
  if (fixes.some(f => f.includes('development'))) {
    console.log('🌐 Environment Issues:');
    console.log('   • Switch to production build: npm run build');
    console.log('   • Start production server: npm run start');
    console.log('   • Use Replit Deploy button for live hosting');
  }
  
  if (fixes.some(f => f.includes('Static'))) {
    console.log('📁 Static File Issues:');
    console.log('   • Check uploads directory permissions');
    console.log('   • Verify static file serving configuration');
    console.log('   • Ensure uploads directory exists');
  }
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Address the issues listed above');
  console.log('2. Restart your application');
  console.log('3. Run diagnoseLiveDeployment() to verify fixes');
  console.log('4. If issues persist, check server console logs');
  
  return {
    issuesFound: fixes.length,
    issues: fixes,
    environment: isDev ? 'development' : 'production',
    platform: isReplit ? 'replit' : 'other',
    needsRestart: fixes.length > 0
  };
}

// Make available globally
window.quickFixDeployment = quickFixDeployment;

console.log('🔧 Ko Lake Villa Quick Fix Loaded');
console.log('Run: quickFixDeployment() - for immediate issue diagnosis');
