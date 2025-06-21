
#!/usr/bin/env node

/**
 * Emergency Restart Script
 * Fixes Vite connection issues and restarts cleanly
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function emergencyRestart() {
  console.log('🚨 EMERGENCY RESTART INITIATED');
  console.log('==============================');

  try {
    // Kill any existing processes
    console.log('🔄 Stopping existing processes...');
    await execAsync('pkill -f "node.*5000" || true');
    await execAsync('pkill -f "vite" || true');
    
    // Wait for processes to stop
    console.log('⏳ Waiting for cleanup...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Clear any lock files
    console.log('🧹 Cleaning up...');
    await execAsync('rm -f .vite-lock || true');
    
    console.log('✅ CLEANUP COMPLETE');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('   1. Click the "Run" button');
    console.log('   2. Or run: npm run dev');
    console.log('   3. Wait for "serving on port 5000" message');
    console.log('   4. Refresh your browser');
    
  } catch (error) {
    console.error('❌ Restart failed:', error.message);
    console.log('');
    console.log('🔧 MANUAL STEPS:');
    console.log('   1. Stop the current process (Ctrl+C)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Wait for server to start');
  }
}

emergencyRestart();
