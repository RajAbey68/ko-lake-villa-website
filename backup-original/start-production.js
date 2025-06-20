#!/usr/bin/env node

/**
 * Ko Lake Villa - Production Server Starter
 * Handles production deployment for Replit
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Ko Lake Villa - Starting Production Server');

// Set production environment
process.env.NODE_ENV = 'production';

// Start the production server
const serverProcess = spawn('node', ['dist/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Terminating server...');
  serverProcess.kill('SIGTERM');
});