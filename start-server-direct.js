// Direct server startup to bypass configuration issues
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Find Node.js binary
const possiblePaths = [
  '/nix/store/*/bin/node',
  './node_modules/.bin/node',
  '/usr/bin/node',
  'node'
];

function findNode() {
  for (const nodePath of possiblePaths) {
    try {
      if (fs.existsSync(nodePath)) {
        return nodePath;
      }
    } catch (e) {}
  }
  return null;
}

function startServer() {
  console.log('🚀 Starting Ko Lake Villa server directly...');
  
  const nodePath = findNode();
  if (!nodePath) {
    console.error('❌ Node.js not found');
    process.exit(1);
  }
  
  console.log(`Using Node.js at: ${nodePath}`);
  
  // Set environment variables
  process.env.NODE_ENV = 'development';
  process.env.PORT = '5000';
  
  // Start the server using tsx
  const server = spawn(nodePath, ['./node_modules/.bin/tsx', 'server/index.ts'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  server.on('error', (err) => {
    console.error('Server start error:', err);
  });
  
  server.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
  });
  
  // Keep process alive
  process.on('SIGINT', () => {
    console.log('Stopping server...');
    server.kill();
    process.exit(0);
  });
}

startServer();