#!/usr/bin/env node

/**
 * Ko Lake Villa - Production Build Script
 * Handles TypeScript compilation with correct target environment
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

console.log('🚀 Starting Ko Lake Villa production build...');

try {
  // Clean previous build
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
    console.log('✅ Cleaned previous build');
  }

  // Build frontend with Vite
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('✅ Frontend build complete');

  // Build backend with esbuild and correct target
  console.log('🔧 Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=es2022', { 
    stdio: 'inherit' 
  });
  console.log('✅ Server build complete');

  console.log('🎉 Production build successful!');
  console.log('📁 Output: dist/ directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}