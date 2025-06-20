
/**
 * Ko Lake Villa - Deployment Status Checker
 * Comprehensive error detection and log analysis
 */

class DeploymentStatusChecker {
  constructor() {
    this.baseUrl = window.location.origin;
    this.errors = [];
    this.warnings = [];
    this.successes = [];
  }

  async checkDeploymentStatus() {
    console.log('🔍 Checking Ko Lake Villa Deployment Status...\n');
    
    await this.checkServerHealth();
    await this.checkAPIEndpoints();
    await this.checkGallerySystem();
    await this.checkCriticalPages();
    await this.checkDatabaseConnectivity();
    
    this.generateReport();
  }

  async checkServerHealth() {
    console.log('🏥 Checking Server Health...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (response.ok) {
        this.successes.push('Server health check: PASS');
      } else {
        this.errors.push(`Server health check failed: ${response.status}`);
      }
    } catch (error) {
      this.errors.push(`Server unreachable: ${error.message}`);
    }
  }

  async checkAPIEndpoints() {
    console.log('🔌 Checking API Endpoints...');
    
    const endpoints = [
      '/api/content',
      '/api/gallery', 
      '/api/rooms',
      '/api/testimonials',
      '/api/pricing'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (response.ok) {
          this.successes.push(`API ${endpoint}: PASS`);
        } else {
          this.errors.push(`API ${endpoint}: FAIL (${response.status})`);
        }
      } catch (error) {
        this.errors.push(`API ${endpoint}: ERROR (${error.message})`);
      }
    }
  }

  async checkGallerySystem() {
    console.log('🖼️ Checking Gallery System...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/gallery`);
      if (response.ok) {
        const gallery = await response.json();
        if (Array.isArray(gallery) && gallery.length > 0) {
          this.successes.push(`Gallery loaded: ${gallery.length} items`);
        } else {
          this.warnings.push('Gallery is empty or malformed');
        }
      } else {
        this.errors.push(`Gallery API failed: ${response.status}`);
      }
    } catch (error) {
      this.errors.push(`Gallery system error: ${error.message}`);
    }
  }

  async checkCriticalPages() {
    console.log('📄 Checking Critical Pages...');
    
    const pages = ['/', '/accommodation', '/gallery', '/contact', '/admin'];
    
    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page}`);
        if (response.ok) {
          this.successes.push(`Page ${page}: PASS`);
        } else {
          this.errors.push(`Page ${page}: FAIL (${response.status})`);
        }
      } catch (error) {
        this.errors.push(`Page ${page}: ERROR (${error.message})`);
      }
    }
  }

  async checkDatabaseConnectivity() {
    console.log('💾 Checking Database Connectivity...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/content`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          this.successes.push('Database connectivity: PASS');
        } else {
          this.warnings.push('Database returns empty data');
        }
      } else {
        this.errors.push('Database connectivity: FAIL');
      }
    } catch (error) {
      this.errors.push(`Database error: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DEPLOYMENT STATUS REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Successes: ${this.successes.length}`);
    this.successes.forEach(success => console.log(`   ✓ ${success}`));
    
    console.log(`\n⚠️  Warnings: ${this.warnings.length}`);
    this.warnings.forEach(warning => console.log(`   ⚠ ${warning}`));
    
    console.log(`\n❌ Errors: ${this.errors.length}`);
    this.errors.forEach(error => console.log(`   ✗ ${error}`));
    
    // Deployment readiness assessment
    console.log('\n🚀 DEPLOYMENT READINESS:');
    if (this.errors.length === 0) {
      console.log('✅ READY FOR PRODUCTION');
      console.log('   All systems operational');
    } else if (this.errors.length <= 2) {
      console.log('⚠️  CAUTION - Minor issues present');
      console.log('   Consider fixing before full deployment');
    } else {
      console.log('❌ NOT READY - Multiple critical issues');
      console.log('   Must resolve errors before deployment');
    }
    
    return {
      errors: this.errors,
      warnings: this.warnings,
      successes: this.successes,
      ready: this.errors.length === 0
    };
  }
}

// Auto-run function
async function checkDeploymentStatus() {
  const checker = new DeploymentStatusChecker();
  return await checker.checkDeploymentStatus();
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.checkDeploymentStatus = checkDeploymentStatus;
  console.log('🔍 Deployment Status Checker loaded. Run: checkDeploymentStatus()');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DeploymentStatusChecker, checkDeploymentStatus };
}
