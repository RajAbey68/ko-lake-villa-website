/**
 * Fix Gallery Titles and Descriptions
 * Updates existing gallery images with proper titles and descriptions
 */

import fs from 'fs';

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

// Authentic Ko Lake Villa content based on your property
const authenticContent = {
  'family-suite': [
    {
      title: 'Master Suite with Lake Views',
      description: 'Spacious master suite featuring panoramic views of Koggala Lake with modern amenities and traditional Sri Lankan design elements.'
    },
    {
      title: 'Family Suite Living Area',
      description: 'Elegant family suite living area designed for comfort and relaxation, with direct access to private terrace overlooking the lake.'
    },
    {
      title: 'Private Bedroom Sanctuary',
      description: 'Beautifully appointed bedroom sanctuary offering tranquil lake views and premium bedding for the perfect rest.'
    }
  ],
  'dining-area': [
    {
      title: 'Lakeside Dining Experience',
      description: 'Enjoy authentic Sri Lankan cuisine prepared with fresh local ingredients while overlooking the serene waters of Koggala Lake.'
    },
    {
      title: 'Traditional Sri Lankan Cuisine',
      description: 'Traditional dining experience featuring local specialties and international favorites in an elegant lakeside setting.'
    }
  ],
  'pool-deck': [
    {
      title: 'Infinity Pool with Lake Views',
      description: 'Private infinity pool seamlessly blending with the horizon of Koggala Lake, creating the perfect setting for relaxation.'
    },
    {
      title: 'Private Pool Deck',
      description: 'Spacious pool deck with comfortable loungers and panoramic views, ideal for sunbathing and outdoor dining.'
    }
  ],
  'lake-garden': [
    {
      title: 'Tropical Lake Gardens',
      description: 'Beautifully landscaped tropical gardens leading directly to the shores of Koggala Lake with native Sri Lankan flora.'
    }
  ],
  'default': [
    {
      title: 'Ko Lake Villa Experience',
      description: 'Experience the beauty and tranquility of Ko Lake Villa, your perfect lakeside retreat in Ahangama, Galle.'
    },
    {
      title: 'Villa Architecture',
      description: 'Traditional Sri Lankan architecture beautifully integrated with modern luxury amenities and stunning lake views.'
    }
  ]
};

async function fixGalleryTitles() {
  console.log('🔍 Getting current gallery images...');
  
  // Get current gallery
  const response = await apiRequest('GET', '/api/gallery');
  const images = await response.json();
  
  console.log(`📸 Found ${images.length} images to update`);
  
  let updateCount = 0;
  
  for (const image of images) {
    try {
      const categoryContent = authenticContent[image.category] || authenticContent['default'];
      const contentIndex = updateCount % categoryContent.length;
      const content = categoryContent[contentIndex];
      
      let title = content.title;
      let description = content.description;
      
      if (image.mediaType === 'video') {
        title = `${title} - Video Tour`;
        description = `${description} Take a virtual tour and experience the authentic atmosphere of this beautiful space.`;
      }
      
      // Update the image with proper title and description
      const updateData = {
        title: title,
        description: description,
        alt: title  // Update alt text to match title
      };
      
      const updateResponse = await apiRequest('PATCH', `/api/admin/gallery/${image.id}`, updateData);
      
      if (updateResponse.ok) {
        console.log(`✅ Updated: ${title}`);
        updateCount++;
      } else {
        console.log(`❌ Failed to update image ${image.id}`);
      }
      
    } catch (error) {
      console.log(`❌ Error updating image ${image.id}:`, error.message);
    }
  }
  
  console.log(`\n📊 Update Complete: ${updateCount} images updated with authentic titles and descriptions`);
}

// Run the fix
fixGalleryTitles().catch(console.error);