
/**
 * Ko Lake Villa - Emergency Deployment Fix
 * Quickly diagnose and resolve stuck deployment issues
 */

async function emergencyDeploymentFix() {
  console.log('🚨 Ko Lake Villa - Emergency Deployment Fix\n');
  console.log('='.repeat(50));
  
  const issues = [];
  const baseUrl = window.location.origin;
  
  // 1. Check if server is responding
  console.log('🔍 Checking server status...');
  try {
    const healthCheck = await fetch(`${baseUrl}/api/gallery`);
    if (healthCheck.ok) {
      console.log('✅ Server is responding');
    } else {
      console.log(`❌ Server issue: ${healthCheck.status}`);
      issues.push(`Server returning ${healthCheck.status}`);
    }
  } catch (error) {
    console.log(`❌ Server unreachable: ${error.message}`);
    issues.push('Server completely unreachable');
  }
  
  // 2. Check critical endpoints
  console.log('\n🔌 Testing critical endpoints...');
  const criticalEndpoints = ['/api/rooms', '/api/gallery', '/api/activities'];
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        console.log(`✅ ${endpoint} working`);
      } else {
        console.log(`❌ ${endpoint} failed: ${response.status}`);
        issues.push(`${endpoint} returning ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} error: ${error.message}`);
      issues.push(`${endpoint} network error`);
    }
  }
  
  // 3. Generate fix recommendations
  console.log('\n🔧 EMERGENCY FIX RECOMMENDATIONS:');
  
  if (issues.length === 0) {
    console.log('✅ System appears to be working - deployment might just be slow');
    console.log('💡 Try refreshing your browser and checking again in 30 seconds');
  } else {
    console.log('❌ Issues detected - here\'s how to fix:');
    console.log('\n🚀 IMMEDIATE ACTIONS:');
    console.log('1. Stop current deployment');
    console.log('2. Restart the application');
    console.log('3. Redeploy using these steps:');
    console.log('   - Click the "Deploy" button in Replit');
    console.log('   - Choose "Autoscale Deployment"');
    console.log('   - Set run command: npm run start');
    console.log('   - Wait for deployment to complete');
  }
  
  console.log('\n📊 DEPLOYMENT STATUS:');
  console.log(`Issues found: ${issues.length}`);
  console.log(`System health: ${issues.length === 0 ? 'GOOD' : 'NEEDS ATTENTION'}`);
  
  return {
    issuesFound: issues.length,
    issues,
    recommendation: issues.length === 0 ? 'WAIT_AND_REFRESH' : 'RESTART_AND_REDEPLOY'
  };
}

// Auto-run
if (typeof window !== 'undefined') {
  window.emergencyDeploymentFix = emergencyDeploymentFix;
  console.log('🚨 Emergency fix loaded. Run: emergencyDeploymentFix()');
} else {
  emergencyDeploymentFix();
}
