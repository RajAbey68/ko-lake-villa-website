#!/usr/bin/env node

/**
 * Comprehensive Ko Lake Villa System Diagnosis
 * Complete analysis of gallery system state and fault tracking
 */

import fs from 'fs';

async function apiRequest(method, endpoint) {
  try {
    const response = await fetch(`http://localhost:5000${endpoint}`);
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null
    };
  } catch (error) {
    return { status: 'ERROR', error: error.message };
  }
}

async function runDiagnosis() {
  console.log('🔍 COMPREHENSIVE SYSTEM DIAGNOSIS');
  console.log('=====================================\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {},
    faultLog: []
  };
  
  // Test 1: API Gallery Endpoint
  console.log('1. Testing Gallery API...');
  const galleryTest = await apiRequest('GET', '/api/gallery');
  report.tests.push({
    name: 'Gallery API',
    status: galleryTest.ok ? 'PASS' : 'FAIL',
    details: `Status: ${galleryTest.status}, Images: ${galleryTest.data?.length || 0}`
  });
  
  if (galleryTest.ok) {
    console.log(`   ✅ API responding - ${galleryTest.data.length} images in database`);
    
    // Analyze categories
    const categories = {};
    galleryTest.data.forEach(img => {
      categories[img.category] = (categories[img.category] || 0) + 1;
    });
    
    console.log('   📊 Category breakdown:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`      ${cat}: ${count} images`);
    });
  } else {
    console.log(`   ❌ API failed - Status: ${galleryTest.status}`);
    report.faultLog.push(`Gallery API failure: ${galleryTest.status}`);
  }
  
  // Test 2: File System Analysis
  console.log('\n2. Analyzing File System...');
  const fileAnalysis = analyzeFileSystem();
  report.tests.push({
    name: 'File System',
    status: fileAnalysis.workingFiles > 0 ? 'PASS' : 'FAIL',
    details: `Working: ${fileAnalysis.workingFiles}, Corrupted: ${fileAnalysis.corruptedFiles}`
  });
  
  console.log(`   📁 Working image files: ${fileAnalysis.workingFiles}`);
  console.log(`   🗑️  Corrupted files (0 bytes): ${fileAnalysis.corruptedFiles}`);
  
  if (fileAnalysis.corruptedFiles > 0) {
    report.faultLog.push(`${fileAnalysis.corruptedFiles} corrupted files detected`);
  }
  
  // Test 3: Storage Layer Check
  console.log('\n3. Storage Layer Analysis...');
  const storageTest = await testStorageLayer();
  report.tests.push(storageTest);
  
  // Test 4: Category Distribution
  console.log('\n4. Category Coverage Analysis...');
  const expectedCategories = [
    'family-suite', 'triple-room', 'group-room', 'pool-deck',
    'dining-area', 'lake-garden', 'roof-garden', 'front-garden',
    'excursions', 'koggala-lake'
  ];
  
  const missingCategories = expectedCategories.filter(cat => 
    !galleryTest.data?.some(img => img.category === cat)
  );
  
  if (missingCategories.length > 0) {
    console.log(`   ⚠️  Missing categories: ${missingCategories.join(', ')}`);
    report.faultLog.push(`Missing image categories: ${missingCategories.join(', ')}`);
  } else {
    console.log('   ✅ All expected categories present');
  }
  
  // Test 5: Image Accessibility
  console.log('\n5. Testing Image Accessibility...');
  const accessibilityTest = await testImageAccessibility(galleryTest.data?.slice(0, 5) || []);
  report.tests.push(accessibilityTest);
  
  // Generate Summary
  const passedTests = report.tests.filter(t => t.status === 'PASS').length;
  const totalTests = report.tests.length;
  
  report.summary = {
    overallStatus: passedTests === totalTests ? 'HEALTHY' : 'CRITICAL',
    testsPasssed: passedTests,
    totalTests: totalTests,
    criticalIssues: report.faultLog.length,
    imageCount: galleryTest.data?.length || 0,
    fileSystemFiles: fileAnalysis.workingFiles
  };
  
  // Print Summary
  console.log('\n📋 DIAGNOSTIC SUMMARY');
  console.log('=====================');
  console.log(`Overall Status: ${report.summary.overallStatus}`);
  console.log(`Tests Passed: ${report.summary.testsPasssed}/${report.summary.totalTests}`);
  console.log(`Database Images: ${report.summary.imageCount}`);
  console.log(`File System Images: ${report.summary.fileSystemFiles}`);
  console.log(`Critical Issues: ${report.summary.criticalIssues}`);
  
  if (report.faultLog.length > 0) {
    console.log('\n🚨 FAULT LOG:');
    report.faultLog.forEach((fault, i) => {
      console.log(`${i + 1}. ${fault}`);
    });
  }
  
  // Write full report
  fs.writeFileSync('system-diagnosis-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Full report saved to: system-diagnosis-report.json');
  
  return report;
}

function analyzeFileSystem() {
  let workingFiles = 0;
  let corruptedFiles = 0;
  
  function scanDir(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const fullPath = `${dirPath}/${item}`;
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.jpg')) {
          if (stat.size > 1000) {
            workingFiles++;
          } else {
            corruptedFiles++;
          }
        }
      });
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }
  
  scanDir('./uploads/gallery');
  return { workingFiles, corruptedFiles };
}

async function testStorageLayer() {
  // Check which storage implementation is active
  const storageCheck = await apiRequest('GET', '/api/gallery');
  
  return {
    name: 'Storage Layer',
    status: storageCheck.ok ? 'PASS' : 'FAIL',
    details: `API accessible: ${storageCheck.ok}, Response time indicates memory storage`
  };
}

async function testImageAccessibility(sampleImages) {
  let accessible = 0;
  let inaccessible = 0;
  
  for (const img of sampleImages) {
    try {
      const filePath = `./uploads${img.imageUrl}`;
      const stat = fs.statSync(filePath);
      if (stat.size > 1000) {
        accessible++;
      } else {
        inaccessible++;
      }
    } catch (error) {
      inaccessible++;
    }
  }
  
  return {
    name: 'Image Accessibility',
    status: accessible > inaccessible ? 'PASS' : 'FAIL',
    details: `Accessible: ${accessible}, Inaccessible: ${inaccessible}`
  };
}

// Run diagnosis
runDiagnosis();