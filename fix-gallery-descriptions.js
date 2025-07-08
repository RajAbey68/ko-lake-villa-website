/**
 * Ko Lake Villa - Bulk Fix Gallery Descriptions
 * Adds intelligent descriptions to the 47 missing items
 */

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  return response.json();
}

function generateIntelligentDescription(image) {
  const filename = (image.imageUrl || '').toLowerCase();
  const category = image.category || 'entire-villa';
  const title = image.title || '';
  
  // Category-based intelligent descriptions
  const descriptions = {
    'koggala-lake': [
      'Breathtaking views of Koggala Lake from Ko Lake Villa, showcasing the pristine waters and natural beauty of this serene lakeside location.',
      'Stunning lakefront scenery at Ko Lake Villa, where guests can enjoy the tranquil beauty of Koggala Lake and its surrounding landscape.',
      'Picturesque Koggala Lake views from Ko Lake Villa, offering a peaceful retreat surrounded by Sri Lanka\'s natural splendor.',
      'Serene lake vistas from Ko Lake Villa, where the calm waters of Koggala Lake create a perfect backdrop for relaxation.'
    ],
    'family-suite': [
      'Spacious and comfortable family suite at Ko Lake Villa, designed to provide luxury accommodation for families seeking an unforgettable lakeside experience.',
      'Elegantly appointed family accommodation at Ko Lake Villa, featuring modern amenities and beautiful lake views for the perfect family getaway.',
      'Luxurious family suite offering comfort and style at Ko Lake Villa, with thoughtful design elements and stunning views of Koggala Lake.',
      'Premium family accommodation at Ko Lake Villa, providing ample space and luxury features for families to enjoy their Sri Lankan retreat.'
    ],
    'triple-room': [
      'Well-appointed triple room at Ko Lake Villa, perfect for small groups or families seeking comfortable accommodation with lake views.',
      'Stylish triple room accommodation at Ko Lake Villa, featuring modern amenities and easy access to the villa\'s premium facilities.',
      'Comfortable triple room at Ko Lake Villa, designed for guests who want to experience luxury while staying close to Koggala Lake.',
      'Modern triple room accommodation offering comfort and convenience at Ko Lake Villa, your lakeside retreat in Sri Lanka.'
    ],
    'group-room': [
      'Spacious group accommodation at Ko Lake Villa, ideal for larger parties seeking luxury lodging with stunning lake views.',
      'Premium group room at Ko Lake Villa, designed to accommodate multiple guests while maintaining the highest standards of comfort.',
      'Elegant group accommodation featuring modern amenities and beautiful lake vistas at Ko Lake Villa.',
      'Luxurious group room offering ample space and premium facilities for memorable stays at Ko Lake Villa.'
    ],
    'dining-area': [
      'Elegant dining space at Ko Lake Villa where guests can enjoy delicious meals while taking in spectacular views of Koggala Lake.',
      'Beautiful dining area at Ko Lake Villa, featuring an inviting atmosphere perfect for memorable meals with family and friends.',
      'Sophisticated dining room at Ko Lake Villa, offering the perfect setting for culinary experiences with stunning lake views.',
      'Charming dining space at Ko Lake Villa, where guests can savor authentic Sri Lankan cuisine and international dishes.'
    ],
    'pool-deck': [
      'Luxurious pool area at Ko Lake Villa, featuring crystal-clear waters and comfortable lounging spaces with panoramic lake views.',
      'Beautiful swimming pool at Ko Lake Villa, perfect for relaxation while enjoying the stunning scenery of Koggala Lake.',
      'Premium pool deck at Ko Lake Villa, offering the ideal spot for swimming, sunbathing, and unwinding in tropical luxury.',
      'Serene pool area at Ko Lake Villa, where guests can enjoy refreshing swims with breathtaking views of the surrounding landscape.'
    ],
    'lake-garden': [
      'Beautifully landscaped gardens at Ko Lake Villa, featuring lush tropical vegetation and direct access to Koggala Lake.',
      'Stunning lakeside gardens at Ko Lake Villa, where guests can stroll among exotic plants while enjoying serene water views.',
      'Meticulously maintained gardens leading to Koggala Lake, showcasing the natural beauty surrounding Ko Lake Villa.',
      'Tropical garden paradise at Ko Lake Villa, offering peaceful walking paths and spectacular lake vistas.'
    ],
    'roof-garden': [
      'Elevated garden terrace at Ko Lake Villa, providing panoramic views of Koggala Lake and the surrounding Sri Lankan landscape.',
      'Beautiful rooftop garden at Ko Lake Villa, featuring tropical plants and stunning vantage points overlooking the lake.',
      'Scenic roof garden at Ko Lake Villa, perfect for enjoying sunset views over Koggala Lake in a tranquil setting.',
      'Elevated outdoor space at Ko Lake Villa, offering breathtaking views and a peaceful retreat above the main villa.'
    ],
    'front-garden': [
      'Welcoming entrance gardens at Ko Lake Villa, featuring beautiful landscaping that sets the tone for your luxury lakeside stay.',
      'Beautifully designed front gardens at Ko Lake Villa, showcasing tropical flora and creating an inviting arrival experience.',
      'Elegant entrance landscaping at Ko Lake Villa, with carefully curated plants and pathways leading to your lakeside retreat.',
      'Stunning front garden at Ko Lake Villa, featuring lush vegetation and thoughtful design elements.'
    ],
    'excursions': [
      'Exciting excursion opportunities from Ko Lake Villa, showcasing the incredible natural beauty and cultural attractions of Sri Lanka.',
      'Adventure activities available from Ko Lake Villa, offering guests unique experiences in the stunning Koggala Lake region.',
      'Cultural and nature excursions from Ko Lake Villa, providing unforgettable experiences in southern Sri Lanka.',
      'Memorable outdoor adventures from Ko Lake Villa, featuring the best of Sri Lankan nature and local attractions.'
    ],
    'events': [
      'Special events and celebrations at Ko Lake Villa, creating magical moments against the backdrop of beautiful Koggala Lake.',
      'Memorable gatherings at Ko Lake Villa, where special occasions become unforgettable experiences with stunning lake views.',
      'Elegant event hosting at Ko Lake Villa, perfect for celebrations, weddings, and special occasions in a luxury setting.',
      'Beautiful event spaces at Ko Lake Villa, offering the perfect venue for memorable celebrations overlooking Koggala Lake.'
    ],
    'amenities': [
      'Premium amenities at Ko Lake Villa, designed to enhance your luxury lakeside experience with thoughtful touches and modern conveniences.',
      'Luxury facilities at Ko Lake Villa, featuring high-end amenities that ensure comfort and relaxation during your stay.',
      'Exceptional amenities at Ko Lake Villa, providing guests with everything needed for a perfect lakeside retreat in Sri Lanka.',
      'World-class facilities at Ko Lake Villa, offering premium amenities in a stunning lakeside setting.'
    ],
    'entire-villa': [
      'Magnificent Ko Lake Villa in its entirety, showcasing the luxury lakeside retreat that offers an unforgettable experience in Sri Lanka.',
      'Complete view of Ko Lake Villa, featuring elegant architecture and stunning positioning on the shores of Koggala Lake.',
      'Full perspective of Ko Lake Villa, displaying the premium accommodation and beautiful integration with the natural lakeside environment.',
      'Comprehensive view of Ko Lake Villa, highlighting the luxury features and spectacular setting on Koggala Lake.'
    ]
  };

  // Get appropriate descriptions for category
  const categoryDescriptions = descriptions[category] || descriptions['entire-villa'];
  
  // Select description based on image ID or random selection
  const descriptionIndex = (image.id || 0) % categoryDescriptions.length;
  return categoryDescriptions[descriptionIndex];
}

function generateTags(image) {
  const category = image.category || 'entire-villa';
  const filename = (image.imageUrl || '').toLowerCase();
  
  const baseTags = ['ko lake villa', 'sri lanka', 'luxury accommodation', 'lakeside retreat'];
  
  const categoryTags = {
    'koggala-lake': ['koggala lake', 'lake view', 'waterfront', 'natural beauty', 'scenic'],
    'family-suite': ['family accommodation', 'spacious', 'comfort', 'family friendly'],
    'triple-room': ['triple room', 'comfortable', 'modern amenities', 'group accommodation'],
    'group-room': ['group accommodation', 'large groups', 'spacious', 'premium'],
    'dining-area': ['dining', 'meals', 'culinary experience', 'elegant dining'],
    'pool-deck': ['swimming pool', 'pool area', 'relaxation', 'luxury amenities'],
    'lake-garden': ['gardens', 'landscaping', 'tropical plants', 'lakeside gardens'],
    'roof-garden': ['rooftop', 'elevated views', 'garden terrace', 'panoramic views'],
    'front-garden': ['entrance', 'landscaping', 'tropical gardens', 'welcoming'],
    'excursions': ['adventures', 'excursions', 'activities', 'sightseeing'],
    'events': ['events', 'celebrations', 'special occasions', 'gatherings'],
    'amenities': ['amenities', 'facilities', 'luxury features', 'premium services'],
    'entire-villa': ['villa exterior', 'architecture', 'complete villa', 'luxury property']
  };
  
  const specificTags = categoryTags[category] || [];
  return [...baseTags, ...specificTags].join(', ');
}

async function fixMissingDescriptions() {
  console.log('🔧 Ko Lake Villa - Fixing Missing Gallery Descriptions\n');
  
  try {
    // Get all gallery images
    const response = await fetch('http://localhost:5000/api/gallery');
    const images = await response.json();
    
    console.log(`📊 Total images: ${images.length}`);
    
    // Find images missing descriptions
    const missingDescriptions = images.filter(img => 
      !img.description || img.description.trim() === '' || img.description === 'Test description'
    );
    
    console.log(`🔍 Found ${missingDescriptions.length} images missing descriptions\n`);
    
    if (missingDescriptions.length === 0) {
      console.log('✅ All images already have descriptions!');
      return;
    }
    
    let updated = 0;
    let failed = 0;
    
    for (const image of missingDescriptions) {
      try {
        const description = generateIntelligentDescription(image);
        const tags = generateTags(image);
        
        // Update via API
        const updateResponse = await fetch(`http://localhost:5000/api/admin/gallery/${image.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description,
            tags: tags
          })
        });
        
        if (updateResponse.ok) {
          updated++;
          console.log(`✅ Updated ${image.title || image.id}: ${image.category}`);
        } else {
          failed++;
          console.log(`❌ Failed to update ${image.title || image.id}`);
        }
        
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        failed++;
        console.log(`❌ Error updating ${image.title || image.id}: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('DESCRIPTION FIX RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Successfully updated: ${updated}`);
    console.log(`❌ Failed to update: ${failed}`);
    console.log(`📊 Success rate: ${((updated / (updated + failed)) * 100).toFixed(1)}%`);
    
    if (updated > 0) {
      console.log('\n🎉 Gallery descriptions have been enhanced!');
      console.log('🔄 Refresh your gallery page to see the improvements.');
    }
    
  } catch (error) {
    console.error('❌ Failed to fix descriptions:', error);
  }
}

// Run the fix
fixMissingDescriptions();