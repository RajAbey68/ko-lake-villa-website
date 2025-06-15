const fs = require('fs');

// Read the conflicted .replit file
const content = fs.readFileSync('.replit', 'utf8');

// Remove Git merge conflict markers and resolve to the merged version
const resolved = content
  .replace(/<<<<<<< HEAD\npackages = \["zip", "nano", "psmisc", "yakut"\]\n=======\npackages = \["zip", "nano", "psmisc", "yakut", "openssh", "unzip"\]\n>>>>>>> dev/g, 
    'packages = ["zip", "nano", "psmisc", "yakut", "openssh", "unzip"]')
  .replace(/<<<<<<< HEAD\n=======[\s\S]*?>>>>>>> dev/g, '');

// Write resolved content
fs.writeFileSync('.replit.resolved', resolved);

console.log('Configuration conflict resolved. Creating backup and applying fix...');

// Create backup of original
fs.copyFileSync('.replit', '.replit.backup');

// Apply the resolved version
fs.copyFileSync('.replit.resolved', '.replit');

console.log('Configuration fixed. Replit should now start properly.');