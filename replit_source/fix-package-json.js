const fs = require('fs');

// Read the broken package.json
const content = fs.readFileSync('package.json', 'utf8');

// Remove Git merge conflict markers and resolve to the newer version
const fixed = content
  .replace(/<<<<<<< HEAD\n\s*"openai": "[\^0-9.]+",\n=======\n\s*"openai": "([\^0-9.]+)",\n>>>>>>> dev/g, 
    '"openai": "$1",')
  .replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> dev/g, '');

// Write the fixed version
fs.writeFileSync('package.json.fixed', fixed);

console.log('Package.json conflicts resolved');

// Validate JSON
try {
  JSON.parse(fixed);
  console.log('JSON validation passed');
  
  // Replace the original
  fs.copyFileSync('package.json.fixed', 'package.json');
  console.log('Fixed package.json applied');
} catch (e) {
  console.error('JSON validation failed:', e.message);
}