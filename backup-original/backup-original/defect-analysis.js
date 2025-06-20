/**
 * Ko Lake Villa - Current Defect Analysis
 * Identifies and categorizes any remaining issues
 */

class DefectAnalysis {
  constructor() {
    this.defects = [];
    this.baseUrl = window.location.origin;
  }

  async testAPI(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return {
        ok: response.ok,
        status: response.status,
        data: await response.json().catch(() => null),
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        error: error.message
      };
    }
  }

  logDefect(category, severity, description, fix = null) {
    const defect = {
      category,
      severity, // critical, high, medium, low
      description,
      fix,
      timestamp: new Date().toISOString()
    };
    
    this.defects.push(defect);
    
    const icon = severity === 'critical' ? '🚨' : 
                 severity === 'high' ? '⚠️' : 
                 severity === 'medium' ? '⚡' : '💡';
    
    console.log(`${icon} [${severity.toUpperCase()}] ${category}: ${description}`);
    if (fix) {
      console.log(`   💡 Fix: ${fix}`);
    }
  }

  async analyzeAPIs() {
    console.log('🔍 Testing API Endpoints...');
    
    const criticalAPIs = [
      '/api/content',
      '/api/pricing',
      '/api/gallery',
      '/api/rooms',
      '/api/testimonials',
      '/api/activities'
    ];

    for (const endpoint of criticalAPIs) {
      const result = await this.testAPI(endpoint);
      if (!result.ok) {
        this.logDefect(
          'API', 
          'high', 
          `${endpoint} returns ${result.status} - ${result.error || 'Not accessible'}`,
          `Check server routes and ensure endpoint is properly implemented`
        );
      }
    }

    // Test form submissions
    const testContact = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message content that is long enough',
      messageType: 'message'
    };

    const contactResult = await this.testAPI('/api/contact', 'POST', testContact);
    if (!contactResult.ok) {
      this.logDefect(
        'Forms',
        'critical',
        `Contact form failing: ${contactResult.status} - ${contactResult.data?.message || 'Unknown error'}`,
        'Check contact form validation and database schema'
      );
    }
  }

  async analyzePages() {
    console.log('🔍 Testing Page Navigation...');
    
    const pages = [
      '/',
      '/accommodation',
      '/gallery',
      '/contact',
      '/booking',
      '/admin',
      '/admin/gallery'
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page}`);
        if (!response.ok && response.status !== 404) {
          this.logDefect(
            'Navigation',
            'medium',
            `Page ${page} returns ${response.status}`,
            'Check routing configuration'
          );
        }
      } catch (error) {
        this.logDefect(
          'Navigation',
          'high',
          `Page ${page} throws error: ${error.message}`,
          'Check page component and routing'
        );
      }
    }
  }

  analyzeConsoleErrors() {
    console.log('🔍 Checking Console Errors...');
    
    // Check for JavaScript errors
    const errors = [];
    const originalError = console.error;
    console.error = function(...args) {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };

    // Restore after a moment
    setTimeout(() => {
      console.error = originalError;
      
      if (errors.length > 0) {
        errors.forEach(error => {
          this.logDefect(
            'JavaScript',
            'medium',
            `Console error: ${error}`,
            'Review browser console and fix JavaScript errors'
          );
        });
      }
    }, 1000);
  }

  async analyzeDatabase() {
    console.log('🔍 Testing Database Operations...');
    
    // Test database connection through API
    const dbTests = [
      { endpoint: '/api/rooms', operation: 'Read rooms' },
      { endpoint: '/api/testimonials', operation: 'Read testimonials' },
      { endpoint: '/api/activities', operation: 'Read activities' }
    ];

    for (const test of dbTests) {
      const result = await this.testAPI(test.endpoint);
      if (!result.ok) {
        this.logDefect(
          'Database',
          'high',
          `${test.operation} failed: ${result.status}`,
          'Check database connection and table schemas'
        );
      } else if (!Array.isArray(result.data)) {
        this.logDefect(
          'Database',
          'medium',
          `${test.operation} returns invalid data format`,
          'Check API response formatting'
        );
      }
    }
  }

  analyzePerformance() {
    console.log('🔍 Checking Performance Issues...');
    
    // Check for slow loading
    const loadTime = performance.now();
    if (loadTime > 3000) {
      this.logDefect(
        'Performance',
        'medium',
        `Slow page load time: ${loadTime.toFixed(2)}ms`,
        'Optimize bundle size and API response times'
      );
    }

    // Check for memory leaks (basic)
    if (performance.memory && performance.memory.usedJSHeapSize > 50000000) {
      this.logDefect(
        'Performance',
        'low',
        `High memory usage: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        'Review for memory leaks and optimize components'
      );
    }
  }

  async runFullAnalysis() {
    console.log('🔍 Ko Lake Villa - Defect Analysis Starting...\n');
    
    await this.analyzeAPIs();
    await this.analyzePages();
    await this.analyzeDatabase();
    this.analyzeConsoleErrors();
    this.analyzePerformance();
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 DEFECT ANALYSIS REPORT');
    console.log('==========================================');
    
    const categorized = this.defects.reduce((acc, defect) => {
      if (!acc[defect.severity]) acc[defect.severity] = [];
      acc[defect.severity].push(defect);
      return acc;
    }, {});

    const severityOrder = ['critical', 'high', 'medium', 'low'];
    
    if (this.defects.length === 0) {
      console.log('✅ NO DEFECTS FOUND - System appears to be working correctly');
      console.log('\n🎉 Ko Lake Villa is ready for production deployment!');
      return;
    }

    severityOrder.forEach(severity => {
      const defects = categorized[severity] || [];
      if (defects.length > 0) {
        const icon = severity === 'critical' ? '🚨' : 
                     severity === 'high' ? '⚠️' : 
                     severity === 'medium' ? '⚡' : '💡';
        
        console.log(`\n${icon} ${severity.toUpperCase()} ISSUES (${defects.length})`);
        defects.forEach((defect, index) => {
          console.log(`   ${index + 1}. [${defect.category}] ${defect.description}`);
          if (defect.fix) {
            console.log(`      → ${defect.fix}`);
          }
        });
      }
    });

    console.log('\n📋 SUMMARY:');
    console.log(`   🚨 Critical: ${(categorized.critical || []).length}`);
    console.log(`   ⚠️  High: ${(categorized.high || []).length}`);
    console.log(`   ⚡ Medium: ${(categorized.medium || []).length}`);
    console.log(`   💡 Low: ${(categorized.low || []).length}`);
    
    const criticalCount = (categorized.critical || []).length;
    const highCount = (categorized.high || []).length;
    
    console.log('\n🎯 DEPLOYMENT READINESS:');
    if (criticalCount === 0 && highCount === 0) {
      console.log('   ✅ READY FOR DEPLOYMENT');
    } else if (criticalCount === 0) {
      console.log('   ⚠️  DEPLOYMENT POSSIBLE - Address high priority issues post-deployment');
    } else {
      console.log('   ❌ NOT READY - Critical issues must be resolved first');
    }

    return this.defects;
  }
}

// Auto-run analysis
async function analyzeDefects() {
  const analysis = new DefectAnalysis();
  await analysis.runFullAnalysis();
  return analysis.defects;
}

// Export for both browser and Node.js
if (typeof window !== 'undefined') {
  console.log('Starting Ko Lake Villa Defect Analysis...');
  analyzeDefects();
}

if (typeof module !== 'undefined') {
  module.exports = { analyzeDefects, DefectAnalysis };
}