import fs from 'fs';
import { spawn } from 'child_process';

// Read the file with conflicts
let content = fs.readFileSync('server/routes.ts', 'utf8');

console.log('Resolving all Git merge conflicts in server/routes.ts...');

// Remove all conflict markers and keep the dev branch version (newer)
content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\n([\s\S]*?)>>>>>>> dev/g, '$1');

// Write the resolved file
fs.writeFileSync('server/routes.ts', content);

console.log('All conflicts resolved in server/routes.ts');