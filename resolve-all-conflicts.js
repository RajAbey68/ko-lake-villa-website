import fs from 'fs';
import path from 'path';

function resolveFileConflicts(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all Git merge conflict markers, keeping the dev branch version
  const resolved = content.replace(/<<<<<<< HEAD[\s\S]*?=======\n([\s\S]*?)>>>>>>> dev/g, '$1');
  
  fs.writeFileSync(filePath, resolved);
  console.log(`Resolved conflicts in: ${filePath}`);
}

function findFilesWithConflicts(dir) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('<<<<<<< HEAD')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}

console.log('Finding all files with Git merge conflicts...');
const conflictFiles = findFilesWithConflicts('.');

console.log(`Found ${conflictFiles.length} files with conflicts:`);
conflictFiles.forEach(file => console.log(`  - ${file}`));

console.log('\nResolving all conflicts...');
conflictFiles.forEach(resolveFileConflicts);

console.log('All Git merge conflicts resolved!')