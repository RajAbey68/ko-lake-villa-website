
#!/usr/bin/env node

const fs = require('fs');

async function validateDeployment() {
  console.log('🚀 Ko Lake Villa - Deployment Validation');
  console.log('==========================================\n');

  let issues = [];
  let passed = 0;
  let total = 0;

  function check(description, condition, severity = 'error') {
    total++;
    if (condition) {
      console.log(`✅ ${description}`);
      passed++;
    } else {
      const icon = severity === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${description}`);
      issues.push({ description, severity });
    }
  }

  // Environment checks
  console.log('🔧 Environment Checks:');
  check('NODE_ENV is set', process.env.NODE_ENV);
  check('Package.json exists', fs.existsSync('package.json'));
  check('Client build directory exists', fs.existsSync('client/dist') || fs.existsSync('server/public'));
  check('Server entry point exists', fs.existsSync('server/index.ts'));

  // Build checks
  console.log('\n📦 Build Checks:');
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    check('Build script defined', pkg.scripts && pkg.scripts.build);
    check('Start script defined', pkg.scripts && pkg.scripts.start);
    check('Dev script defined', pkg.scripts && pkg.scripts.dev);
  }

  // File structure checks
  console.log('\n📁 File Structure:');
  check('Client source exists', fs.existsSync('client/src'));
  check('Server source exists', fs.existsSync('server'));
  check('Database schema exists', fs.existsSync('shared/schema.ts'));
  check('Static files exist', fs.existsSync('static') || fs.existsSync('public'));

  // Security checks
  console.log('\n🛡️ Security Checks:');
  check('No .env file in root (use Secrets)', !fs.existsSync('.env'));
  check('Gitignore exists', fs.existsSync('.gitignore'));
  check('No node_modules committed', !fs.existsSync('node_modules/.git'));

  // Replit specific checks
  console.log('\n🔧 Replit Configuration:');
  check('Replit config exists', fs.existsSync('.replit'));
  check('Nix config exists', fs.existsSync('replit.nix'));

  // Test checks
  console.log('\n🧪 Test Configuration:');
  check('Test files exist', fs.existsSync('tests') || fs.existsSync('test-matrix'));
  check('Playwright config exists', fs.existsSync('playwright.config.ts'));

  // Report
  console.log('\n📊 VALIDATION SUMMARY:');
  console.log('======================');
  console.log(`Total Checks: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);

  if (issues.length === 0) {
    console.log('\n🎉 All validation checks passed! Ready for deployment.');
    return true;
  } else {
    console.log('\n⚠️ Issues found:');
    issues.forEach(issue => {
      const icon = issue.severity === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${issue.description}`);
    });
    
    const criticalIssues = issues.filter(i => i.severity === 'error').length;
    if (criticalIssues === 0) {
      console.log('\n✅ No critical issues. Safe to deploy with warnings.');
      return true;
    } else {
      console.log('\n🚨 Critical issues must be fixed before deployment.');
      return false;
    }
  }
}

if (require.main === module) {
  validateDeployment().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { validateDeployment };
