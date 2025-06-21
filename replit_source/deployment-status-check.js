
/**
 * Ko Lake Villa - Live Deployment Status Check
 * Quick diagnosis of promotion to live issues
 */

async function checkPromotionToLive() {
  console.log('🔍 Ko Lake Villa - Checking Promotion to Live Status\n');
  console.log('='.repeat(50));
  
  const issues = [];
  const warnings = [];
  const baseUrl = window.location.origin;
  
  // Check 1: Environment Detection
  console.log('🌐 Environment Check...');
  const isDev = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  const isReplit = baseUrl.includes('replit.app') || baseUrl.includes('replit.dev');
  
  if (isDev) {
    issues.push('Currently running in development mode - not promoted to live');
    console.log('❌ Development environment detected');
  } else if (isReplit) {
    console.log('✅ Replit deployment environment detected');
  } else {
    console.log('✅ Live production environment detected');
  }
  
  // Check 2: Critical API Endpoints
  console.log('\n🔌 Testing Core APIs...');
  const criticalAPIs = [
    '/api/gallery',
    '/api/rooms', 
    '/api/pricing',
    '/api/testimonials'
  ];
  
  for (const api of criticalAPIs) {
    try {
      const response = await fetch(`${baseUrl}${api}`);
      if (response.ok) {
        console.log(`✅ ${api}: Working`);
      } else {
        issues.push(`${api} returning ${response.status}`);
        console.log(`❌ ${api}: Status ${response.status}`);
      }
    } catch (error) {
      issues.push(`${api} connection failed: ${error.message}`);
      console.log(`❌ ${api}: Connection failed`);
    }
  }
  
  // Check 3: Database Connectivity
  console.log('\n🗄️ Database Status...');
  try {
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    if (galleryResponse.ok) {
      const data = await galleryResponse.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ Database: ${data.length} gallery items loaded`);
      } else {
        warnings.push('Database connected but no gallery data');
        console.log('⚠️ Database: No gallery data found');
      }
    } else {
      issues.push(`Database connection failed (${galleryResponse.status})`);
      console.log(`❌ Database: Connection failed`);
    }
  } catch (error) {
    issues.push(`Database error: ${error.message}`);
    console.log(`❌ Database: ${error.message}`);
  }
  
  // Check 4: Static Assets
  console.log('\n📁 Static Assets...');
  try {
    const assetsToCheck = ['/favicon.ico', '/robots.txt'];
    for (const asset of assetsToCheck) {
      const response = await fetch(`${baseUrl}${asset}`, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${asset}: Available`);
      } else {
        warnings.push(`${asset} not accessible`);
        console.log(`⚠️ ${asset}: Not found`);
      }
    }
  } catch (error) {
    warnings.push(`Static asset check failed: ${error.message}`);
  }
  
  // Check 5: Performance
  console.log('\n⚡ Performance Check...');
  const startTime = performance.now();
  try {
    await fetch(`${baseUrl}/api/rooms`);
    const responseTime = performance.now() - startTime;
    
    if (responseTime < 1000) {
      console.log(`✅ API Response: ${responseTime.toFixed(0)}ms (Good)`);
    } else if (responseTime < 3000) {
      warnings.push(`Slow API response: ${responseTime.toFixed(0)}ms`);
      console.log(`⚠️ API Response: ${responseTime.toFixed(0)}ms (Slow)`);
    } else {
      issues.push(`Very slow API response: ${responseTime.toFixed(0)}ms`);
      console.log(`❌ API Response: ${responseTime.toFixed(0)}ms (Too Slow)`);
    }
  } catch (error) {
    issues.push(`Performance test failed: ${error.message}`);
  }
  
  // Generate Report
  console.log('\n' + '='.repeat(50));
  console.log('📊 PROMOTION TO LIVE STATUS REPORT');
  console.log('='.repeat(50));
  
  if (issues.length === 0 && !isDev) {
    console.log('✅ SUCCESSFULLY PROMOTED TO LIVE');
    console.log('   • All systems operational');
    console.log('   • APIs responding correctly');
    console.log('   • Database connected');
    console.log('   • Performance acceptable');
    
    if (warnings.length > 0) {
      console.log('\n⚠️ Minor issues to monitor:');
      warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
  } else if (isDev) {
    console.log('❌ NOT PROMOTED TO LIVE');
    console.log('   • Still running in development mode');
    console.log('   • Need to deploy to Replit for live promotion');
    
    console.log('\n🚀 TO PROMOTE TO LIVE:');
    console.log('   1. Click the "Deploy" button in Replit');
    console.log('   2. Choose "Autoscale Deployment"');
    console.log('   3. Configure domain settings');
    console.log('   4. Click "Deploy your project"');
    
  } else {
    console.log('❌ LIVE PROMOTION ISSUES DETECTED');
    console.log(`   • ${issues.length} critical issue(s) found`);
    
    console.log('\n🔧 ISSUES TO FIX:');
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    console.log('\n💡 IMMEDIATE ACTIONS:');
    console.log('   1. Check server logs for detailed errors');
    console.log('   2. Restart the deployment if needed');
    console.log('   3. Verify database connectivity');
    console.log('   4. Run quickFixDeployment() for automated fixes');
  }
  
  return {
    isLive: !isDev && issues.length === 0,
    environment: isDev ? 'development' : isReplit ? 'replit' : 'production',
    criticalIssues: issues.length,
    warnings: warnings.length,
    issues,
    warnings
  };
}

// Make available globally
window.checkPromotionToLive = checkPromotionToLive;

console.log('🔍 Ko Lake Villa Promotion Status Checker Loaded');
console.log('Run: checkPromotionToLive() - to check live deployment status');
