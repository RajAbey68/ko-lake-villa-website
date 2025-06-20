#!/usr/bin/env node

/**
 * Ko Lake Villa - Production Build Script
 * Handles TypeScript compilation with correct target environment
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync } from 'fs';

console.log('Starting Ko Lake Villa production build...');

try {
  // Clean previous build
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }
  mkdirSync('dist', { recursive: true });
  mkdirSync('dist/public', { recursive: true });

  // Build frontend with optimized Vite settings
  console.log('Building frontend...');
  process.env.NODE_ENV = 'production';
  execSync('vite build --mode production --outDir dist/public', { 
    stdio: 'inherit',
    timeout: 300000 // 5 minute timeout
  });

  // Build backend with esbuild and correct target
  console.log('Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=es2022 --minify', { 
    stdio: 'inherit' 
  });

  console.log('Production build complete!');
  console.log('Server: dist/index.js');
  console.log('Frontend: dist/public/');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}