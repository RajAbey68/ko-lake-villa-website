#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function migrateMetadata() {
  console.log('🔄 Migrating gallery metadata to centralized format...\n');
  
  const galleryDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
  const dataDir = path.join(process.cwd(), 'data');
  const metadataFile = path.join(dataDir, 'gallery-metadata.json');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }
  
  // Load existing centralized metadata
  let centralizedMetadata = {};
  if (fs.existsSync(metadataFile)) {
    try {
      const data = fs.readFileSync(metadataFile, 'utf-8');
      centralizedMetadata = JSON.parse(data);
      console.log(`📖 Loaded existing centralized metadata: ${Object.keys(centralizedMetadata).length} items`);
    } catch (error) {
      console.warn('⚠️  Could not load existing metadata, starting fresh');
    }
  }
  
  // Scan for .meta.json files
  let migratedCount = 0;
  let skippedCount = 0;
  
  function scanDirectory(dirPath, category) {
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      if (file.endsWith('.meta.json')) {
        const originalFile = file.replace('.meta.json', '');
        const imageId = `${category}/${originalFile}`;
        
        try {
          // Read the metadata file
          const metadataContent = fs.readFileSync(filePath, 'utf-8');
          const metadata = JSON.parse(metadataContent);
          
          // Check if already exists in centralized metadata
          if (centralizedMetadata[imageId]) {
            console.log(`⏭️  Skipped ${imageId} (already exists in centralized metadata)`);
            skippedCount++;
            continue;
          }
          
          // Add to centralized metadata
          centralizedMetadata[imageId] = {
            title: metadata.title || '',
            description: metadata.description || '',
            category: metadata.category || category,
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
            seoTitle: metadata.seoTitle || '',
            seoDescription: metadata.seoDescription || '',
            altText: metadata.altText || '',
            updatedAt: metadata.updatedAt || new Date().toISOString(),
            updatedBy: 'migration'
          };
          
          console.log(`✅ Migrated ${imageId}`);
          migratedCount++;
          
        } catch (error) {
          console.error(`❌ Failed to migrate ${imageId}:`, error.message);
        }
      }
    }
  }
  
  // Scan all category directories
  if (fs.existsSync(galleryDir)) {
    const categories = fs.readdirSync(galleryDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`🔍 Scanning ${categories.length} categories...\n`);
    
    for (const category of categories) {
      const categoryPath = path.join(galleryDir, category);
      console.log(`📁 Scanning ${category}/...`);
      scanDirectory(categoryPath, category);
    }
  }
  
  // Save centralized metadata
  try {
    fs.writeFileSync(metadataFile, JSON.stringify(centralizedMetadata, null, 2));
    console.log(`\n💾 Saved centralized metadata with ${Object.keys(centralizedMetadata).length} total items`);
  } catch (error) {
    console.error('❌ Failed to save centralized metadata:', error);
    return;
  }
  
  // Summary
  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Migrated: ${migratedCount} items`);
  console.log(`   ⏭️  Skipped: ${skippedCount} items (already existed)`);
  console.log(`   📦 Total in centralized metadata: ${Object.keys(centralizedMetadata).length} items`);
  
  if (migratedCount > 0) {
    console.log('\n🎯 Next steps:');
    console.log('   1. Test the new metadata API');
    console.log('   2. Verify gallery edits now persist');
    console.log('   3. Clean up old .meta.json files (optional)');
  }
  
  console.log('\n✅ Migration completed!');
}

// Run migration
migrateMetadata().catch(console.error); 