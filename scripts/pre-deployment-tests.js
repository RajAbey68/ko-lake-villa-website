#!/usr/bin/env node

/**
 * Ko Lake Villa - Pre-Deployment Test Suite
 * Comprehensive regression and feature testing before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PreDeploymentTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green  
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  recordTest(testName, passed, details = '') {
    if (passed) {
      this.testResults.passed++;
      this.log(`✅ ${testName}`, 'success');
    } else {
      this.testResults.failed++;
      this.log(`❌ ${testName} - ${details}`, 'error');
    }
    
    this.testResults.details.push({
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  recordWarning(testName, details) {
    this.testResults.warnings++;
    this.log(`⚠️  ${testName} - ${details}`, 'warning');
    this.testResults.details.push({
      test: testName,
      passed: null,
      details,
      timestamp: new Date().toISOString(),
      warning: true
    });
  }

  async runBuildTests() {
    this.log('🏗️  Running Build Tests...', 'info');
    
    try {
      // Test 1: Clean build
      this.log('Testing clean build...');
      execSync('rm -rf .next', { stdio: 'pipe' });
      execSync('npm run build', { stdio: 'pipe' });
      this.recordTest('Clean Build', true);
      
      // Test 2: Build output validation
      const buildExists = fs.existsSync('.next');
      this.recordTest('Build Output Exists', buildExists);
      
      // Test 3: Static pages generated
      const staticFiles = [
        '.next/server/app/page.js',
        '.next/server/app/accommodation/page.js',
        '.next/server/app/dining/page.js',
        '.next/server/app/experiences/page.js',
        '.next/server/app/gallery/page.js',
        '.next/server/app/admin/page.js'
      ];
      
      const missingFiles = staticFiles.filter(file => !fs.existsSync(file));
      this.recordTest('All Pages Generated', missingFiles.length === 0, 
        missingFiles.length > 0 ? `Missing: ${missingFiles.join(', ')}` : '');
      
    } catch (error) {
      this.recordTest('Build Process', false, error.message);
    }
  }

  async runCodeQualityTests() {
    this.log('🔍 Running Code Quality Tests...', 'info');
    
    try {
      // Test 1: TypeScript compilation
      this.log('Testing TypeScript compilation...');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.recordTest('TypeScript Compilation', true);
    } catch (error) {
      this.recordTest('TypeScript Compilation', false, 'Type errors found');
    }
    
    try {
      // Test 2: ESLint validation
      this.log('Testing ESLint validation...');
      execSync('npm run lint', { stdio: 'pipe' });
      this.recordTest('ESLint Validation', true);
    } catch (error) {
      this.recordWarning('ESLint Validation', 'Linting issues found (non-blocking)');
    }
  }

  async runComponentTests() {
    this.log('🧩 Running Component Tests...', 'info');
    
    // Test key component files exist
    const criticalComponents = [
      'app/page.tsx',
      'app/layout.tsx',
      'app/gallery/page.tsx',
      'app/accommodation/page.tsx',
      'app/dining/page.tsx',
      'app/experiences/page.tsx',
      'app/admin/page.tsx',
      'components/ui/button.tsx',
      'components/ui/card.tsx'
    ];
    
    criticalComponents.forEach(component => {
      const exists = fs.existsSync(component);
      this.recordTest(`Component: ${component}`, exists);
    });
    
    // Test for missing API dependencies (regression test for gallery issue)
    const galleryContent = fs.readFileSync('app/gallery/page.tsx', 'utf8');
    const hasAPICall = galleryContent.includes('/api/gallery');
    this.recordTest('Gallery: No API Dependencies', !hasAPICall, 
      hasAPICall ? 'Gallery still has API calls - will cause loading issues' : '');
  }

  async runAssetTests() {
    this.log('🖼️  Running Asset Tests...', 'info');
    
    // Test critical images exist
    const criticalAssets = [
      'public/images/hero-pool.jpg',
      'public/images/excursions-hero.jpg',
      'public/placeholder.svg'
    ];
    
    criticalAssets.forEach(asset => {
      const exists = fs.existsSync(asset);
      this.recordTest(`Asset: ${asset}`, exists);
    });
    
    // Test for placeholder dependency
    const pageFiles = [
      'app/page.tsx',
      'app/gallery/page.tsx',
      'components/public-gallery.tsx'
    ];
    
    pageFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const hasPlaceholder = content.includes('placeholder.svg');
        if (hasPlaceholder) {
          this.recordWarning(`Placeholder Usage: ${file}`, 'Uses placeholder.svg - replace with real images');
        }
      }
    });
  }

  async runConfigurationTests() {
    this.log('⚙️  Running Configuration Tests...', 'info');
    
    // Test package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    this.recordTest('Package.json Valid', !!packageJson.name);
    
    // Test for problematic dependencies
    const hasPnpmLock = fs.existsSync('pnpm-lock.yaml');
    this.recordTest('No pnpm-lock.yaml', !hasPnpmLock, 
      hasPnpmLock ? 'pnpm-lock.yaml exists - will cause deployment conflicts' : '');
    
    const hasPackageLock = fs.existsSync('package-lock.json');
    this.recordTest('npm package-lock.json exists', hasPackageLock);
    
    // Test Next.js config
    const nextConfigExists = fs.existsSync('next.config.mjs');
    this.recordTest('Next.js Config Exists', nextConfigExists);
    
    // Test for problematic vercel.json
    const vercelJsonExists = fs.existsSync('vercel.json');
    if (vercelJsonExists) {
      this.recordWarning('vercel.json Exists', 'Manual Vercel config - may cause deployment issues');
    }
  }

  async runBrandComplianceTests() {
    this.log('🎨 Running Brand Compliance Tests...', 'info');
    
    // Check critical brand elements in homepage
    const homepageContent = fs.readFileSync('app/page.tsx', 'utf8');
    
    const brandChecks = [
      { element: 'Ko Lake Villa', name: 'Brand Name' },
      { element: 'Relax, Revive, Connect', name: 'Tagline' },
      { element: '+94711730345', name: 'Phone Number' },
      { element: 'amber-', name: 'Brand Colors (Amber)' },
      { element: 'wa.me/94711730345', name: 'WhatsApp Integration' }
    ];
    
    brandChecks.forEach(check => {
      const hasElement = homepageContent.includes(check.element);
      this.recordTest(`Brand: ${check.name}`, hasElement);
    });
    
    // Check for prohibited blue colors
    const hasBlueColors = homepageContent.includes('blue-') || homepageContent.includes('bg-blue');
    this.recordTest('Brand: No Blue Colors', !hasBlueColors, 
      hasBlueColors ? 'Blue colors found - violates brand guidelines' : '');
  }

  async runPerformanceTests() {
    this.log('⚡ Running Performance Tests...', 'info');
    
    try {
      // Test build size
      const buildOutput = execSync('npm run build', { encoding: 'utf8' });
      
      // Parse build output for page sizes
      const pageSizeRegex = /○\s+\/\s+(\d+\.?\d*\s*\w+)/;
      const match = buildOutput.match(pageSizeRegex);
      
      if (match) {
        const homepageSize = match[1];
        this.log(`Homepage size: ${homepageSize}`);
        
        // Basic performance check (warn if > 10KB)
        const sizeInKB = parseFloat(homepageSize);
        if (sizeInKB > 10) {
          this.recordWarning('Homepage Size', `${homepageSize} - consider optimization`);
        } else {
          this.recordTest('Homepage Size Optimal', true);
        }
      }
      
    } catch (error) {
      this.recordWarning('Performance Analysis', 'Could not analyze build output');
    }
  }

  async runRegressionTests() {
    this.log('🔄 Running Regression Tests...', 'info');
    
    // Specific regression tests for known issues
    
    // 1. Gallery API dependency (the issue we just fixed)
    const galleryContent = fs.readFileSync('app/gallery/page.tsx', 'utf8');
    const hasStaticData = galleryContent.includes('staticGalleryData') || 
                          galleryContent.includes('mediaItems:');
    this.recordTest('Gallery: Uses Static Data', hasStaticData,
      !hasStaticData ? 'Gallery may have API dependencies that cause loading issues' : '');
    
    // 2. Package manager conflicts
    const npmrcExists = fs.existsSync('.npmrc');
    const pnpmExists = fs.existsSync('pnpm-lock.yaml');
    this.recordTest('Package Manager: No Conflicts', !pnpmExists);
    
    // 3. Import errors (check for common problematic imports)
    const problematicImports = [
      { file: 'app/page.tsx', import: 'Pool', description: 'Pool icon not in lucide-react' }
    ];
    
    problematicImports.forEach(check => {
      if (fs.existsSync(check.file)) {
        const content = fs.readFileSync(check.file, 'utf8');
        const hasProblematicImport = content.includes(`import.*${check.import}.*from.*lucide-react`);
        this.recordTest(`Import: No ${check.import} from lucide-react`, !hasProblematicImport,
          hasProblematicImport ? check.description : '');
      }
    });
    
    // 4. Empty API directories
    const apiDirExists = fs.existsSync('app/api');
    if (apiDirExists) {
      this.recordWarning('API Directory', 'app/api exists - may cause deployment issues if empty');
    }
  }

  async runDeploymentReadinessTests() {
    this.log('🚀 Running Deployment Readiness Tests...', 'info');
    
    // Test environment variables and deployment config
    const envLocal = fs.existsSync('.env.local');
    const envExample = fs.existsSync('.env.example');
    
    if (envLocal) {
      this.recordWarning('Environment Variables', '.env.local exists - check secrets not committed');
    }
    
    // Test Git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const hasUncommittedChanges = gitStatus.trim().length > 0;
      this.recordTest('Git: No Uncommitted Changes', !hasUncommittedChanges,
        hasUncommittedChanges ? 'Uncommitted changes found' : '');
    } catch (error) {
      this.recordWarning('Git Status', 'Could not check git status');
    }
    
    // Test critical files for deployment
    const deploymentFiles = [
      'package.json',
      'next.config.mjs',
      'tailwind.config.ts',
      'tsconfig.json'
    ];
    
    deploymentFiles.forEach(file => {
      const exists = fs.existsSync(file);
      this.recordTest(`Deployment: ${file}`, exists);
    });
  }

  generateTestReport() {
    this.log('\n📊 GENERATING TEST REPORT...', 'info');
    
    const report = {
      summary: {
        total: this.testResults.passed + this.testResults.failed,
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        warnings: this.testResults.warnings,
        timestamp: new Date().toISOString()
      },
      details: this.testResults.details
    };
    
    // Write detailed report
    fs.writeFileSync('pre-deployment-report.json', JSON.stringify(report, null, 2));
    
    // Console summary
    console.log('\n' + '='.repeat(60));
    console.log('🏁 PRE-DEPLOYMENT TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`⚠️  Warnings: ${this.testResults.warnings}`);
    console.log(`📄 Detailed Report: pre-deployment-report.json`);
    
    if (this.testResults.failed > 0) {
      console.log('\n🚫 DEPLOYMENT NOT RECOMMENDED');
      console.log('Fix failing tests before deployment');
      return false;
    } else if (this.testResults.warnings > 0) {
      console.log('\n⚠️  DEPLOYMENT WITH CAUTION');
      console.log('Review warnings before deployment');
      return true;
    } else {
      console.log('\n🎉 READY FOR DEPLOYMENT');
      return true;
    }
  }

  async runAllTests() {
    this.log('🚀 STARTING PRE-DEPLOYMENT TEST SUITE', 'info');
    this.log('Ko Lake Villa - Comprehensive Testing', 'info');
    
    await this.runBuildTests();
    await this.runCodeQualityTests();
    await this.runComponentTests();
    await this.runAssetTests();
    await this.runConfigurationTests();
    await this.runBrandComplianceTests();
    await this.runPerformanceTests();
    await this.runRegressionTests();
    await this.runDeploymentReadinessTests();
    
    return this.generateTestReport();
  }
}

// Main execution
async function main() {
  const tester = new PreDeploymentTester();
  
  try {
    const isReady = await tester.runAllTests();
    process.exit(isReady ? 0 : 1);
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PreDeploymentTester; 