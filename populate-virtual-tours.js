/**
 * Ko Lake Villa - Virtual Tours Data Population
 * Using authentic iPhone photos from the property
 */

const virtualToursData = [
  {
    roomId: "triple-room",
    roomName: "Triple Room",
    description: "Comfortable triple occupancy room with modern amenities and garden views. Perfect for friends or small families visiting Ko Lake Villa.",
    panoramaUrl: "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg",
    thumbnailUrl: "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_1.jpg",
    features: [
      "Three comfortable beds",
      "Air conditioning",
      "Private bathroom",
      "Garden views",
      "Free WiFi",
      "Desk workspace",
      "Tea/coffee facilities",
      "Daily housekeeping"
    ],
    isActive: true,
    sortOrder: 1
  },
  {
    roomId: "family-suite",
    roomName: "Family Suite",
    description: "Spacious family suite offering luxury accommodation with lake views and premium amenities for an unforgettable stay at Ko Lake Villa.",
    panoramaUrl: "/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg",
    thumbnailUrl: "/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png",
    features: [
      "Separate living area",
      "Master bedroom",
      "Lake views",
      "Private balcony",
      "Kitchenette",
      "Premium bathroom",
      "Air conditioning",
      "Luxury furnishings"
    ],
    isActive: true,
    sortOrder: 2
  },
  {
    roomId: "dining-area",
    roomName: "Dining Experience",
    description: "Elegant dining area with stunning lake views where guests enjoy authentic Sri Lankan cuisine prepared with fresh local ingredients.",
    panoramaUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_0.jpg",
    thumbnailUrl: "/uploads/gallery/dining-area/cake-1.jpg",
    features: [
      "Lake view dining",
      "Authentic Sri Lankan cuisine",
      "Fresh local ingredients",
      "Indoor & outdoor seating",
      "Traditional atmosphere",
      "Professional service",
      "Special dietary accommodations",
      "Group dining options"
    ],
    isActive: true,
    sortOrder: 3
  },
  {
    roomId: "pool-deck",
    roomName: "Pool Deck Area",
    description: "Relaxing pool deck with beautiful lake views, perfect for swimming, sunbathing, and enjoying the peaceful atmosphere of Ko Lake Villa.",
    panoramaUrl: "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg",
    thumbnailUrl: "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_1.jpg",
    features: [
      "Swimming pool",
      "Lake views",
      "Sun loungers",
      "Poolside service",
      "Tropical landscaping",
      "Safe swimming area",
      "Outdoor relaxation",
      "Photo opportunities"
    ],
    isActive: true,
    sortOrder: 4
  },
  {
    roomId: "entire-villa",
    roomName: "Entire Villa Experience",
    description: "Complete Ko Lake Villa experience showcasing the beautiful architecture and lakeside location in Ahangama, Galle.",
    panoramaUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
    thumbnailUrl: "/uploads/gallery/default/1747315800201-804896726-20250418_070740.jpg",
    features: [
      "Full villa access",
      "Multiple room options",
      "Lakeside location",
      "Private grounds",
      "Group accommodation",
      "Event hosting",
      "Complete privacy",
      "Exclusive experience"
    ],
    isActive: true,
    sortOrder: 5
  }
];

async function populateVirtualTours() {
  console.log('Populating virtual tours with authentic Ko Lake Villa data...');
  
  for (const tourData of virtualToursData) {
    try {
      const response = await fetch('/api/virtual-tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tourData)
      });
      
      if (response.ok) {
        console.log(`✓ Added virtual tour: ${tourData.roomName}`);
      } else {
        console.log(`✗ Failed to add: ${tourData.roomName}`);
      }
    } catch (error) {
      console.error(`Error adding ${tourData.roomName}:`, error);
    }
  }
  
  console.log('Virtual tours population completed!');
}

// Run the population
populateVirtualTours();