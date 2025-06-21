/**
 * Emergency Gallery Restoration Script
 * Rebuilds gallery database from existing image files
 */

import fs from 'fs';
import path from 'path';

// Gallery categories and their mappings
const categoryMappings = {
  'family-suite': ['family', 'suite', 'bedroom', 'living', 'bathroom'],
  'group-room': ['group', 'room', 'beds', 'multiple'],
  'pool-deck': ['pool', 'deck', 'swimming', 'infinity'],
  'lake-garden': ['lake', 'garden', 'view', 'sunset', 'landscape'],
  'dining': ['dining', 'food', 'restaurant', 'kitchen', 'meal'],
  'exterior': ['exterior', 'outside', 'building', 'facade'],
  'activities': ['activity', 'boat', 'kayak', 'fishing', 'water'],
  'amenities': ['amenity', 'wifi', 'facility', 'service'],
  'all-villa': ['villa', 'overview', 'general']
};

// Image descriptions based on filename patterns
const getImageData = (filename) => {
  const lower = filename.toLowerCase();
  
  if (lower.includes('bedroom') || lower.includes('suite')) {
    return {
      category: 'family-suite',
      description: 'Family Suite Bedroom',
      alt: 'Spacious family suite bedroom with lake view',
      tags: '#family #suite #bedroom #luxury #lakeview'
    };
  }
  
  if (lower.includes('living') || lower.includes('lounge')) {
    return {
      category: 'family-suite',
      description: 'Family Suite Living Area',
      alt: 'Comfortable living area with modern amenities',
      tags: '#family #suite #living #modern #comfort'
    };
  }
  
  if (lower.includes('bathroom') || lower.includes('bath')) {
    return {
      category: 'family-suite',
      description: 'Family Suite Bathroom',
      alt: 'Premium bathroom with modern fixtures',
      tags: '#family #suite #bathroom #premium #clean'
    };
  }
  
  if (lower.includes('group') || lower.includes('beds')) {
    return {
      category: 'group-room',
      description: 'Group Room with Multiple Beds',
      alt: 'Spacious group room accommodating multiple guests',
      tags: '#group #room #beds #family #spacious'
    };
  }
  
  if (lower.includes('pool') || lower.includes('deck')) {
    return {
      category: 'pool-deck',
      description: 'Infinity Pool Deck',
      alt: 'Beautiful infinity pool with lake views',
      tags: '#pool #deck #infinity #swimming #relaxation'
    };
  }
  
  if (lower.includes('lake') || lower.includes('view') || lower.includes('sunset')) {
    return {
      category: 'lake-garden',
      description: 'Lake View from Villa',
      alt: 'Stunning lake view from Ko Lake Villa',
      tags: '#lake #view #scenic #nature #tranquil'
    };
  }
  
  if (lower.includes('dining') || lower.includes('food') || lower.includes('kitchen')) {
    return {
      category: 'dining',
      description: 'Dining Experience',
      alt: 'Exceptional dining with lake views',
      tags: '#dining #food #restaurant #cuisine #experience'
    };
  }
  
  if (lower.includes('exterior') || lower.includes('building') || lower.includes('facade')) {
    return {
      category: 'exterior',
      description: 'Villa Exterior',
      alt: 'Ko Lake Villa exterior architecture',
      tags: '#exterior #architecture #building #design #villa'
    };
  }
  
  if (lower.includes('boat') || lower.includes('kayak') || lower.includes('fishing') || lower.includes('activity')) {
    return {
      category: 'activities',
      description: 'Lake Activities',
      alt: 'Water activities and lake adventures',
      tags: '#activities #lake #boat #kayak #adventure'
    };
  }
  
  // Default for general villa images
  return {
    category: 'all-villa',
    description: 'Ko Lake Villa',
    alt: 'Ko Lake Villa - luxury lakeside accommodation',
    tags: '#villa #luxury #accommodation #kolake #lakeside'
  };
};

async function restoreGalleryDatabase() {
  try {
    const galleryDir = 'uploads/gallery';
    const imageFiles = [];
    
    // Recursively find all image files
    function findImages(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findImages(fullPath);
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          imageFiles.push(fullPath);
        }
      });
    }
    
    findImages(galleryDir);
    
    console.log(`Found ${imageFiles.length} image files to restore`);
    
    // Generate SQL insert statements
    const insertStatements = [];
    let nextId = 21; // Start after existing records
    
    imageFiles.forEach((imagePath, index) => {
      const filename = path.basename(imagePath);
      const webPath = '/' + imagePath.replace(/\\/g, '/');
      const imageData = getImageData(filename);
      
      const sql = `INSERT INTO gallery_images (id, category, description, alt, tags, image_url, featured, sort_order, media_type) 
                   VALUES (${nextId + index}, '${imageData.category}', '${imageData.description}', '${imageData.alt}', '${imageData.tags}', '${webPath}', false, ${index + 100}, 'image');`;
      
      insertStatements.push(sql);
    });
    
    // Write SQL file
    const sqlContent = insertStatements.join('\n');
    fs.writeFileSync('restore-gallery.sql', sqlContent);
    
    console.log(`Generated ${insertStatements.length} SQL insert statements`);
    console.log('SQL file written to: restore-gallery.sql');
    console.log('\nNext steps:');
    console.log('1. Execute the SQL file to restore gallery database');
    console.log('2. Verify gallery images are restored');
    
    return true;
  } catch (error) {
    console.error('Error restoring gallery:', error);
    return false;
  }
}

// Run restoration
restoreGalleryDatabase();