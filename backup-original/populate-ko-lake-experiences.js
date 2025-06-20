/**
 * Ko Lake Villa - Comprehensive Local Experiences Population
 * Adds authentic Sri Lankan experiences around Ko Lake area
 */

async function apiRequest(method, endpoint, body = null) {
  const baseUrl = 'http://localhost:5000';
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${method} ${endpoint}`, error);
    throw error;
  }
}

async function populateKoLakeExperiences() {
  console.log('🏝️ Adding Ko Lake Area Experiences...');

  // Authentic Ko Lake and Ahangama area experiences
  const koLakeExperiences = [
    // Water & Lake Activities
    {
      name: "Koggala Lake Boat Safari",
      description: "Explore the serene Koggala Lake on a traditional outrigger boat. Discover small islands with Buddhist temples, spot endemic bird species including kingfishers and herons, and learn about the lake's rich ecosystem from local guides.",
      category: "Water Activities",
      duration: "2-3 hours",
      difficulty: "Easy",
      price: 35,
      imageUrl: "/uploads/gallery/experiences/koggala-lake-boat.jpg",
      highlights: [
        "Traditional outrigger boat experience",
        "Visit to Cinnamon Island with spice gardens",
        "Bird watching with over 50 species",
        "Temple Island exploration",
        "Sunset timing available"
      ],
      bestTime: "Early morning (6-8 AM) or late afternoon (4-6 PM)",
      included: ["Boat transport", "Local guide", "Life jackets", "Refreshments"]
    },
    {
      name: "Stand-Up Paddleboarding on Ko Lake",
      description: "Peaceful SUP sessions on the calm waters directly from Ko Lake Villa's private dock. Perfect for beginners with equipment and basic instruction provided. Experience the lake from a unique perspective.",
      category: "Water Activities", 
      duration: "1-2 hours",
      difficulty: "Beginner to Intermediate",
      price: 25,
      imageUrl: "/uploads/gallery/experiences/sup-ko-lake.jpg",
      highlights: [
        "Private dock access",
        "Equipment provided",
        "Basic instruction included",
        "Calm lake conditions",
        "Photography opportunities"
      ],
      bestTime: "Early morning (6-9 AM) when lake is calmest",
      included: ["SUP board", "Paddle", "Life jacket", "Basic instruction"]
    },
    {
      name: "Traditional Fishing Experience",
      description: "Learn traditional Sri Lankan fishing methods with local fishermen on Koggala Lake. Use bamboo poles and traditional techniques while learning about sustainable fishing practices and local marine life.",
      category: "Cultural Activities",
      duration: "3-4 hours", 
      difficulty: "Easy",
      price: 40,
      imageUrl: "/uploads/gallery/experiences/traditional-fishing.jpg",
      highlights: [
        "Traditional bamboo pole fishing",
        "Local fisherman as guide",
        "Learn sustainable methods",
        "Fresh fish for villa cooking",
        "Lake ecology education"
      ],
      bestTime: "Early morning (5-9 AM) when fish are most active",
      included: ["Fishing equipment", "Local guide", "Boat transport", "Refreshments"]
    },

    // Cultural & Heritage Experiences
    {
      name: "Ahangama Village Cycle Tour",
      description: "Explore authentic village life around Ahangama on bicycle. Visit local markets, observe traditional crafts, interact with villagers, and experience daily life in rural Sri Lanka away from tourist areas.",
      category: "Cultural Activities",
      duration: "3-4 hours",
      difficulty: "Easy to Moderate", 
      price: 30,
      imageUrl: "/uploads/gallery/experiences/village-cycle-tour.jpg",
      highlights: [
        "Authentic village interactions",
        "Local market visits",
        "Traditional craft observations",
        "Rural landscape cycling",
        "Cultural immersion"
      ],
      bestTime: "Early morning (7-11 AM) when markets are active",
      included: ["Bicycle rental", "Local guide", "Helmet", "Water bottle", "Market snacks"]
    },
    {
      name: "Traditional Cooking Class with Village Family",
      description: "Learn to prepare authentic Sri Lankan dishes in a local village home. Shop for ingredients at the market, grind spices by hand, and cook over traditional wood fires with a welcoming local family.",
      category: "Cultural Activities",
      duration: "4-5 hours",
      difficulty: "Easy",
      price: 55,
      imageUrl: "/uploads/gallery/experiences/cooking-class.jpg", 
      highlights: [
        "Local family home setting",
        "Market shopping experience", 
        "Traditional spice grinding",
        "Wood fire cooking methods",
        "Family meal sharing"
      ],
      bestTime: "Morning start (9 AM) to prepare lunch",
      included: ["All ingredients", "Recipe cards", "Full meal", "Transportation", "Family interaction"]
    },
    {
      name: "Buddhist Temple & Meditation Experience",
      description: "Visit nearby Buddhist temples including the historic Kataluwa Purwarama Temple. Participate in meditation sessions, learn about Buddhist philosophy, and experience the spiritual side of Sri Lankan culture.",
      category: "Spiritual Activities",
      duration: "2-3 hours",
      difficulty: "Easy",
      price: 25,
      imageUrl: "/uploads/gallery/experiences/temple-meditation.jpg",
      highlights: [
        "Historic temple visits",
        "Guided meditation sessions", 
        "Buddhist philosophy introduction",
        "Monk interactions",
        "Peaceful spiritual environment"
      ],
      bestTime: "Early morning (6-9 AM) or evening (5-7 PM)",
      included: ["Temple entrance", "Meditation guide", "Transportation", "Cultural explanation"]
    },

    // Nature & Wildlife
    {
      name: "Handunugoda Tea Estate Experience", 
      description: "Visit the unique Handunugoda Tea Estate famous for its Virgin White Tea. Learn about tea processing, participate in tea tasting, and explore the beautiful estate grounds with panoramic views.",
      category: "Nature Activities",
      duration: "3-4 hours",
      difficulty: "Easy",
      price: 45,
      imageUrl: "/uploads/gallery/experiences/tea-estate.jpg",
      highlights: [
        "Virgin White Tea experience",
        "Tea processing demonstration",
        "Professional tea tasting",
        "Estate grounds exploration", 
        "Panoramic valley views"
      ],
      bestTime: "Morning (9 AM-12 PM) for best estate activity",
      included: ["Estate tour", "Tea tasting", "Transportation", "Light refreshments"]
    },
    {
      name: "Mangrove Kayaking Adventure",
      description: "Paddle through pristine mangrove ecosystems near Koggala. Observe diverse wildlife including water monitors, various bird species, and learn about mangrove conservation efforts in Sri Lanka.",
      category: "Nature Activities", 
      duration: "2-3 hours",
      difficulty: "Moderate",
      price: 40,
      imageUrl: "/uploads/gallery/experiences/mangrove-kayaking.jpg",
      highlights: [
        "Pristine mangrove exploration",
        "Wildlife observation",
        "Conservation education",
        "Peaceful natural environment",
        "Photography opportunities"
      ],
      bestTime: "Early morning (6-9 AM) for best wildlife viewing",
      included: ["Kayak equipment", "Life jacket", "Guide", "Water bottle", "Wildlife spotting guide"]
    },
    {
      name: "Snake Island Nature Walk",
      description: "Explore the famous Snake Island in Koggala Lake, known for its biodiversity and Buddhist temple. Walk nature trails, observe endemic species, and learn about island ecology from naturalist guides.",
      category: "Nature Activities",
      duration: "2-3 hours", 
      difficulty: "Easy to Moderate",
      price: 35,
      imageUrl: "/uploads/gallery/experiences/snake-island.jpg",
      highlights: [
        "Island biodiversity exploration",
        "Endemic species observation",
        "Buddhist temple visit",
        "Nature trail walking",
        "Ecological education"
      ],
      bestTime: "Morning (8-11 AM) for best wildlife activity",
      included: ["Boat transport", "Island guide", "Nature trails", "Temple visit", "Refreshments"]
    },

    // Adventure & Outdoor
    {
      name: "Coastal Cliff Walking & Stilt Fishing",
      description: "Walk along dramatic coastal cliffs near Koggala and observe traditional stilt fishermen at work. Learn about this unique fishing method and enjoy spectacular ocean views.",
      category: "Adventure Activities",
      duration: "2-3 hours",
      difficulty: "Moderate", 
      price: 30,
      imageUrl: "/uploads/gallery/experiences/stilt-fishing.jpg",
      highlights: [
        "Dramatic coastal cliff views",
        "Traditional stilt fishing observation",
        "Ocean photography opportunities",
        "Cultural fishing heritage",
        "Scenic walking paths"
      ],
      bestTime: "Early morning (6-9 AM) or late afternoon (4-6 PM)",
      included: ["Guide", "Transportation", "Water bottle", "Cultural explanation"]
    },
    {
      name: "Sunrise Yoga on the Lake Deck",
      description: "Start your day with peaceful yoga sessions on Ko Lake Villa's private deck overlooking the lake. Professional instructor guides through gentle flows suitable for all levels.",
      category: "Wellness Activities",
      duration: "1 hour",
      difficulty: "All Levels",
      price: 20,
      imageUrl: "/uploads/gallery/experiences/sunrise-yoga.jpg",
      highlights: [
        "Private deck setting",
        "Professional instruction",
        "All levels welcome",
        "Peaceful lake views",
        "Morning meditation"
      ],
      bestTime: "Sunrise (6-7 AM) for optimal experience",
      included: ["Yoga mats", "Professional instructor", "Meditation session", "Herbal tea"]
    },

    // Cultural Crafts & Arts
    {
      name: "Traditional Mask Carving Workshop",
      description: "Learn the ancient art of Sri Lankan mask carving with master craftsmen in nearby Ambalangoda. Create your own traditional devil dance mask while learning about cultural significance.",
      category: "Cultural Activities",
      duration: "4-5 hours",
      difficulty: "Intermediate", 
      price: 65,
      imageUrl: "/uploads/gallery/experiences/mask-carving.jpg",
      highlights: [
        "Master craftsman instruction",
        "Traditional carving techniques",
        "Cultural significance education",
        "Take home your creation",
        "Workshop visit"
      ],
      bestTime: "Morning start (9 AM) for full workshop",
      included: ["All materials", "Expert instruction", "Transportation", "Completed mask", "Cultural tour"]
    },
    {
      name: "Batik Fabric Painting Experience",
      description: "Create beautiful batik art using traditional wax-resist dyeing techniques. Learn from local artisans and create your own unique fabric piece to take home.",
      category: "Cultural Activities",
      duration: "3-4 hours",
      difficulty: "Easy to Intermediate",
      price: 50,
      imageUrl: "/uploads/gallery/experiences/batik-painting.jpg",
      highlights: [
        "Traditional batik techniques",
        "Local artisan instruction",
        "Create personal artwork",
        "Cultural art education",
        "Take home creation"
      ],
      bestTime: "Morning (9 AM-1 PM) for drying time",
      included: ["All materials", "Artisan instruction", "Fabric piece", "Transportation", "Cultural explanation"]
    },

    // Beach & Coastal
    {
      name: "Secret Beach Discovery Tour",
      description: "Discover hidden beaches and secluded coves along the Ahangama coastline. Access private beaches known only to locals and enjoy pristine coastal environments away from crowds.",
      category: "Beach Activities",
      duration: "3-4 hours",
      difficulty: "Easy to Moderate",
      price: 35,
      imageUrl: "/uploads/gallery/experiences/secret-beaches.jpg",
      highlights: [
        "Hidden beach access",
        "Local knowledge sharing",
        "Pristine coastal environments",
        "Photography opportunities",
        "Swimming and relaxation"
      ],
      bestTime: "Morning (8 AM-12 PM) or afternoon (2-6 PM)",
      included: ["Local guide", "Transportation", "Beach access", "Refreshments", "Snorkeling gear"]
    },
    {
      name: "Coconut Tree Climbing & Fresh King Coconut",
      description: "Learn traditional coconut climbing techniques from local experts. Climb coconut palms safely with proper instruction and enjoy fresh king coconuts straight from the tree.",
      category: "Adventure Activities",
      duration: "1-2 hours",
      difficulty: "Moderate to Challenging",
      price: 25,
      imageUrl: "/uploads/gallery/experiences/coconut-climbing.jpg",
      highlights: [
        "Traditional climbing techniques",
        "Expert safety instruction",
        "Fresh king coconut tasting",
        "Local skill learning",
        "Adventure challenge"
      ],
      bestTime: "Morning (8-11 AM) when cooler",
      included: ["Safety equipment", "Expert instruction", "Fresh coconuts", "Cultural explanation"]
    }
  ];

  console.log(`Adding ${koLakeExperiences.length} Ko Lake experiences...`);

  let successCount = 0;
  let errorCount = 0;

  for (const experience of koLakeExperiences) {
    try {
      console.log(`Adding: ${experience.name}...`);
      await apiRequest('POST', '/api/activities', experience);
      successCount++;
      console.log(`✅ Added: ${experience.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to add ${experience.name}:`, error.message);
    }
  }

  console.log('\n🎯 Ko Lake Experiences Population Summary:');
  console.log(`✅ Successfully added: ${successCount} experiences`);
  console.log(`❌ Failed to add: ${errorCount} experiences`);
  console.log(`📊 Total processed: ${koLakeExperiences.length} experiences`);

  if (successCount > 0) {
    console.log('\n🏝️ Ko Lake Area Experiences Now Available:');
    console.log('🚣 Water Activities - Lake boat safaris, SUP, traditional fishing');
    console.log('🏛️ Cultural Experiences - Village tours, cooking classes, temple visits');
    console.log('🌿 Nature Adventures - Tea estates, mangrove kayaking, wildlife walks');
    console.log('🎨 Traditional Crafts - Mask carving, batik painting, cultural arts');
    console.log('🏖️ Coastal Activities - Secret beaches, stilt fishing, cliff walking');
    console.log('🧘 Wellness - Sunrise yoga, meditation, peaceful lake activities');
  }

  return {
    success: successCount,
    failed: errorCount,
    total: koLakeExperiences.length
  };
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  populateKoLakeExperiences();
} else {
  // Node.js environment
  populateKoLakeExperiences().then(results => {
    console.log('\n✅ Ko Lake experiences population completed');
    process.exit(results.failed === 0 ? 0 : 1);
  }).catch(error => {
    console.error('❌ Population failed:', error);
    process.exit(1);
  });
}