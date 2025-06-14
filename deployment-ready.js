#!/usr/bin/env node

/**
 * Ko Lake Villa - Deployment Ready Script
 * Bypasses build complexity and creates production-ready deployment
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('Preparing Ko Lake Villa for deployment...');

// Create production start script
const startScript = `#!/usr/bin/env node
process.env.NODE_ENV = 'production';
import('./server/index.js');
`;

writeFileSync('start.js', startScript);

// Create deployment configuration
const deployConfig = {
  name: "ko-lake-villa",
  type: "nodejs",
  main: "start.js",
  engines: {
    node: ">=18.0.0"
  },
  scripts: {
    start: "node start.js"
  }
};

writeFileSync('app.json', JSON.stringify(deployConfig, null, 2));

console.log('Deployment configuration created:');
console.log('- start.js: Production entry point');
console.log('- app.json: Deployment configuration');
console.log('Ready for deployment!');