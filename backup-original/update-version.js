
/**
 * Ko Lake Villa - Version Update Utility
 * Updates version number and creates git tags
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get version and message from command line arguments
const [,, newVersion, releaseMessage] = process.argv;

if (!newVersion || !releaseMessage) {
  console.log('Usage: node update-version.js v1.4.0 "New pricing system and analytics update"');
  process.exit(1);
}

// Validate version format
if (!/^v\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('Version must be in format vX.Y.Z (e.g., v1.4.0)');
  process.exit(1);
}

const versionFile = path.join(__dirname, 'client/src/constants/version.ts');
const releaseUrl = `https://github.com/RajAbey68/ko-lake-villa-website/releases/tag/${newVersion}`;

// Update version file
const versionContent = `export const APP_VERSION = '${newVersion}';
export const RELEASE_LINK = '${releaseUrl}';

// Version history for reference
export const VERSION_HISTORY = {
  '${newVersion}': '${releaseMessage}',
  'v1.3.0': 'Added image compression tools and gallery management improvements',
  'v1.2.0': 'Enhanced admin dashboard with analytics and media export',
  'v1.1.0': 'Improved responsive design and booking system',
  'v1.0.0': 'Initial release with core functionality'
};
`;

try {
  // Write updated version file
  fs.writeFileSync(versionFile, versionContent);
  console.log(`✅ Updated version to ${newVersion}`);

  // Create git tag
  execSync(`git add ${versionFile}`, { stdio: 'inherit' });
  execSync(`git commit -m "Release ${newVersion}: ${releaseMessage}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${newVersion} -m "${releaseMessage}"`, { stdio: 'inherit' });
  
  console.log(`✅ Created git tag ${newVersion}`);
  console.log(`📝 Release message: ${releaseMessage}`);
  console.log(`🔗 Release URL: ${releaseUrl}`);
  console.log('\nNext steps:');
  console.log('1. Push changes: git push origin main');
  console.log(`2. Push tag: git push origin ${newVersion}`);
  console.log('3. Create release on GitHub with changelog');

} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
}
