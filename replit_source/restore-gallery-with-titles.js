/**
 * Restore Ko Lake Villa Gallery with Proper Titles and Descriptions
 * Rebuilds the gallery database from existing authentic property images
 */

import fs from 'fs';
import path from 'path';

async function apiRequest(method, endpoint, body = null) {
  const baseUrl = 'http://localhost:5000';
  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, config);
  return response;
}

function findAuthenticImages() {
  const uploadsDir = './uploads/gallery';
  const images = [];
  
  function scanDirectory(dirPath, category = 'default') {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath, item);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'].includes(ext)) {
          const isVideo = ['.mp4', '.mov'].includes(ext);
          images.push({
            filePath: itemPath,
            fileName: item,
            category: category,
            mediaType: isVideo ? 'video' : 'image',
            fileSize: stat.size
          });
        }
      }
    });
  }
  
  scanDirectory(uploadsDir);
  return images;
}

// Generate authentic titles and descriptions based on Ko Lake Villa property
function generateAuthenticContent(fileName, category, mediaType) {
  const categoryContent = {
    'family-suite': {
      titles: [
        'Master Suite with Lake Views',
        'Family Suite Living Area', 
        'Private Bedroom Sanctuary',
        'Suite with Private Terrace'
      ],
      descriptions: [
        'Spacious master suite featuring panoramic views of Koggala Lake with modern amenities and traditional Sri Lankan design elements.',
        'Elegant family suite living area designed for comfort and relaxation, with direct access to private terrace overlooking the lake.',
        'Beautifully appointed bedroom sanctuary offering tranquil lake views and premium bedding for the perfect rest.',
        'Private suite terrace perfect for morning coffee while enjoying stunning sunrise views over Koggala Lake.'
      ]
    },
    'dining-area': {
      titles: [
        'Lakeside Dining Experience',
        'Traditional Sri Lankan Cuisine',
        'Outdoor Dining Pavilion',
        'Breakfast with Lake Views'
      ],
      descriptions: [
        'Enjoy authentic Sri Lankan cuisine prepared with fresh local ingredients while overlooking the serene waters of Koggala Lake.',
        'Traditional dining experience featuring local specialties and international favorites in an elegant lakeside setting.',
        'Open-air dining pavilion perfect for romantic dinners and family gatherings with panoramic lake views.',
        'Start your day with a delicious breakfast featuring fresh tropical fruits and Sri Lankan tea while watching the lake come alive.'
      ]
    },
    'pool-deck': {
      titles: [
        'Infinity Pool with Lake Views',
        'Private Pool Deck',
        'Sunset Pool Experience',
        'Poolside Relaxation'
      ],
      descriptions: [
        'Private infinity pool seamlessly blending with the horizon of Koggala Lake, creating the perfect setting for relaxation.',
        'Spacious pool deck with comfortable loungers and panoramic views, ideal for sunbathing and outdoor dining.',
        'Experience magical sunsets from the pool while enjoying the changing colors reflected on the lake waters.',
        'Peaceful poolside retreat surrounded by tropical gardens with uninterrupted views of the pristine lake.'
      ]
    },
    'lake-garden': {
      titles: [
        'Tropical Lake Gardens',
        'Garden Pathways to Lake',
        'Native Plant Sanctuary',
        'Waterfront Garden Views'
      ],
      descriptions: [
        'Beautifully landscaped tropical gardens leading directly to the shores of Koggala Lake with native Sri Lankan flora.',
        'Winding garden pathways through lush tropical vegetation offering peaceful walks to the lake edge.',
        'Carefully curated collection of native plants and flowers creating a natural sanctuary for wildlife and guests.',
        'Stunning waterfront garden views showcasing the harmony between manicured landscapes and natural lake beauty.'
      ]
    },
    'default': {
      titles: [
        'Ko Lake Villa Experience',
        'Lakeside Villa Ambiance',
        'Villa Architecture',
        'Property Overview'
      ],
      descriptions: [
        'Experience the beauty and tranquility of Ko Lake Villa, your perfect lakeside retreat in Ahangama, Galle.',
        'Traditional Sri Lankan architecture beautifully integrated with modern luxury amenities and stunning lake views.',
        'Authentic villa design celebrating local craftsmanship while providing contemporary comfort and elegance.',
        'Complete property overview showcasing the unique charm and natural beauty of this exclusive lakeside location.'
      ]
    }
  };

  const content = categoryContent[category] || categoryContent['default'];
  const randomIndex = Math.floor(Math.random() * content.titles.length);
  
  let title = content.titles[randomIndex];
  let description = content.descriptions[randomIndex];
  
  if (mediaType === 'video') {
    title = `${title} - Video Tour`;
    description = `${description} Take a virtual tour and experience the authentic atmosphere of this beautiful space.`;
  }
  
  return { title, description };
}

async function restoreGalleryWithTitles() {
  console.log('🔍 Finding authentic Ko Lake Villa images...');
  
  const images = findAuthenticImages();
  console.log(`📸 Found ${images.length} authentic property images and videos`);
  
  // Clear existing gallery first
  console.log('🧹 Clearing existing gallery...');
  try {
    await apiRequest('DELETE', '/api/admin/gallery/clear');
  } catch (error) {
    console.log('⚠️ Could not clear gallery, continuing...');
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const image of images) {
    try {
      const { title, description } = generateAuthenticContent(
        image.fileName, 
        image.category, 
        image.mediaType
      );
      
      const galleryData = {
        imageUrl: image.filePath.replace('./uploads', '/uploads'),
        alt: title,
        title: title,
        description: description,
        category: image.category,
        mediaType: image.mediaType,
        featured: successCount < 6, // First 6 images as featured
        sortOrder: successCount + 1,
        fileSize: image.fileSize
      };
      
      const response = await apiRequest('POST', '/api/admin/gallery', galleryData);
      
      if (response.ok) {
        console.log(`✅ Added: ${title}`);
        successCount++;
      } else {
        console.log(`❌ Failed: ${image.fileName}`);
        failCount++;
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${image.fileName}:`, error.message);
      failCount++;
    }
  }
  
  console.log('\n📊 Gallery Restoration Complete:');
  console.log(`✅ Successfully added: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log('\n🎯 Gallery now ready with authentic titles and descriptions!');
}

// Run the restoration
restoreGalleryWithTitles().catch(console.error);