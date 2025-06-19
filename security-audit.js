#!/usr/bin/env node
/**
 * Ko Lake Villa Security Audit
 * Run this periodically to check for security issues
 */

import { execSync } from 'child_process';

console.log('🔒 Ko Lake Villa Security Audit\n');

// Check for npm vulnerabilities
console.log('📦 Checking npm vulnerabilities...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Vulnerabilities found - run: npm audit fix');
}

// Check for sensitive files
console.log('\n🔍 Checking for sensitive files...');
const sensitivePatterns = ['.env', '*.key', '*.pem', 'config.json'];
sensitivePatterns.forEach(pattern => {
  try {
    const result = execSync(`find . -name "${pattern}" -not -path "./node_modules/*"`, { encoding: 'utf8' });
    if (result.trim()) {
      console.log(`⚠️  Found sensitive files: ${result.trim()}`);
    }
  } catch (e) {
    // No files found - this is good
  }
});

console.log('\n✅ Security audit complete');
