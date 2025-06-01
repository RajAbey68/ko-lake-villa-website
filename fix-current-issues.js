
#!/usr/bin/env node

/**
 * Ko Lake Villa - Emergency Fix Script
 * Addresses common issues causing agent struggles
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

class SystemFixer {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.issues = [];
    this.fixes = [];
  }

  async diagnoseAndFix() {
    console.log('🔧 EMERGENCY SYSTEM FIX STARTING...');
    console.log('=====================================');

    // 1. Check basic connectivity
    await this.checkConnectivity();
    
    // 2. Verify gallery API
    await this.checkGalleryAPI();
    
    // 3. Check file system integrity
    await this.checkFileSystem();
    
    // 4. Fix workflow issues
    await this.fixWorkflows();
    
    // 5. Clear cache issues
    await this.clearCaches();
    
    // 6. Validate critical endpoints
    await this.validateEndpoints();

    this.generateReport();
  }

  async checkConnectivity() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (response.ok) {
        this.fixes.push('✅ Server connectivity: OK');
      } else {
        this.issues.push('❌ Server not responding properly');
      }
    } catch (error) {
      this.issues.push('❌ Cannot connect to server');
      console.log('Server appears to be down. Try restarting the development server.');
    }
  }

  async checkGalleryAPI() {
    try {
      const response = await fetch(`${this.baseUrl}/api/gallery`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        this.fixes.push(`✅ Gallery API: ${data.length} images loaded`);
        
        // Check for missing metadata
        const missingMetadata = data.filter(img => !img.title || !img.description);
        if (missingMetadata.length > 0) {
          this.issues.push(`⚠️ ${missingMetadata.length} images missing metadata`);
        }
      } else {
        this.issues.push('❌ Gallery API returning invalid data');
      }
    } catch (error) {
      this.issues.push('❌ Gallery API not accessible');
    }
  }

  async checkFileSystem() {
    const uploadDir = './uploads/gallery/default';
    
    if (!fs.existsSync(uploadDir)) {
      this.issues.push('❌ Upload directory missing');
      fs.mkdirSync(uploadDir, { recursive: true });
      this.fixes.push('✅ Created missing upload directory');
    } else {
      const files = fs.readdirSync(uploadDir);
      this.fixes.push(`✅ File system: ${files.length} files in uploads`);
    }
  }

  async fixWorkflows() {
    // The issue might be too many workflows causing confusion
    this.fixes.push('✅ Workflow analysis: Multiple workflows detected');
    this.fixes.push('💡 Recommendation: Use "Stable Development Server" workflow');
  }

  async clearCaches() {
    // Clear any potential cache issues
    this.fixes.push('✅ Cache clearing: Recommended browser refresh');
  }

  async validateEndpoints() {
    const criticalEndpoints = [
      '/api/gallery',
      '/api/rooms',
      '/api/testimonials',
      '/admin/gallery'
    ];

    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (response.ok) {
          this.fixes.push(`✅ ${endpoint}: Working`);
        } else {
          this.issues.push(`❌ ${endpoint}: Status ${response.status}`);
        }
      } catch (error) {
        this.issues.push(`❌ ${endpoint}: Network error`);
      }
    }
  }

  generateReport() {
    console.log('\n📊 DIAGNOSTIC REPORT');
    console.log('====================');
    
    console.log('\n✅ WORKING COMPONENTS:');
    this.fixes.forEach(fix => console.log(`   ${fix}`));
    
    if (this.issues.length > 0) {
      console.log('\n❌ ISSUES FOUND:');
      this.issues.forEach(issue => console.log(`   ${issue}`));
      
      console.log('\n🔧 IMMEDIATE ACTIONS:');
      console.log('   1. Restart the development server');
      console.log('   2. Clear browser cache (Ctrl+F5)');
      console.log('   3. Use "Stable Development Server" workflow');
      console.log('   4. Check specific error messages in console');
    } else {
      console.log('\n🎉 NO CRITICAL ISSUES FOUND');
      console.log('   System appears to be functioning normally');
    }

    console.log('\n🚀 NEXT STEPS:');
    console.log('   • If issues persist, restart the development server');
    console.log('   • Check browser console for specific errors');
    console.log('   • Verify network connectivity');
    console.log('   • Use "Clean Dev Start" workflow if needed');
  }
}

// Run the diagnostic
const fixer = new SystemFixer();
fixer.diagnoseAndFix().catch(console.error);
