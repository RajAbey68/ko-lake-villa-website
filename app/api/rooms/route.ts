import { NextResponse } from 'next/server';

interface Room {
  id: string;
  name: string;
  subtitle: string;
  airbnbPrice: number;
  directPrice: number;
  savings: number;
  discount: string;
  lastMinuteDiscount: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  gallery: string[];
  features: string[];
  amenities: string[];
}

export async function GET() {
  try {
    // Return the exact room structure expected by the new UI
    const roomsData: Room[] = [
      {
        id: "KNP",
        name: "Entire Villa Exclusive",
        subtitle: "Perfect for Large Groups & Special Occasions",
        airbnbPrice: 431,
        directPrice: 388,
        savings: 43,
        discount: "10%",
        lastMinuteDiscount: "15%",
        guests: 12,
        bedrooms: 6,
        bathrooms: 4,
        image: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
        gallery: [
          "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
          "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg",
          "/uploads/gallery/lake-garden/KoggalaNinePeaks_lake-garden_0.jpg",
          "/uploads/gallery/front-garden/KoggalaNinePeaks_front-garden_0.jpg",
        ],
        features: [
          "Exclusive use of entire property",
          "Private infinity pool with lake views",
          "Fully equipped modern kitchen",
          "Multiple living and dining areas",
          "Private boat dock access",
          "Dedicated parking for 4 cars",
          "Garden and terrace spaces",
          "Premium lake-facing bedrooms",
        ],
        amenities: ["Private Pool", "Lake Access", "Full Kitchen", "Free Parking", "WiFi", "AC"],
      },
      {
        id: "KNP1",
        name: "Master Family Suite",
        subtitle: "Luxury Suite with Stunning Lake Views",
        airbnbPrice: 119,
        directPrice: 107,
        savings: 12,
        discount: "10%",
        lastMinuteDiscount: "15%",
        guests: 4,
        bedrooms: 1,
        bathrooms: 1,
        image: "/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg",
        gallery: [
          "/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg",
          "/uploads/gallery/family-suite/KoLakeHouse_family-suite_1.png",
          "/uploads/gallery/family-suite/cake-1.jpg",
          "/uploads/gallery/family-suite/cake-2.jpg",
        ],
        features: [
          "Spacious king-size bedroom",
          "Private balcony with lake views",
          "Luxury en-suite bathroom",
          "Sitting area with lake views",
          "Premium bedding and linens",
          "Mini-fridge and coffee station",
          "Direct lake access",
          "Shared pool and garden access",
        ],
        amenities: ["Lake View", "Private Balcony", "En-suite Bath", "Pool Access", "WiFi", "AC"],
      },
      {
        id: "KNP3",
        name: "Triple/Twin Rooms",
        subtitle: "Comfortable Accommodation for Small Groups",
        airbnbPrice: 70,
        directPrice: 63,
        savings: 7,
        discount: "10%",
        lastMinuteDiscount: "15%",
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
        image: "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg",
        gallery: [
          "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg",
          "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_1.jpg",
          "/uploads/gallery/dining-area/cake-1.jpg",
          "/uploads/gallery/dining-area/cake-2.jpg",
        ],
        features: [
          "Flexible twin or triple bed setup",
          "Garden and partial lake views",
          "Shared bathroom facilities",
          "Access to common areas",
          "Shared kitchen facilities",
          "Pool and garden access",
          "Budget-friendly option",
          "Perfect for backpackers",
        ],
        amenities: ["Garden View", "Shared Kitchen", "Pool Access", "WiFi", "AC", "Parking"],
      },
      {
        id: "KNP6",
        name: "Group Room",
        subtitle: "Ideal for Friends & Family Groups",
        airbnbPrice: 250,
        directPrice: 225,
        savings: 25,
        discount: "10%",
        lastMinuteDiscount: "15%",
        guests: 6,
        bedrooms: 2,
        bathrooms: 2,
        image: "/uploads/gallery/group-room/KoggalaNinePeaks_group-room_0.jpg",
        gallery: [
          "/uploads/gallery/group-room/KoggalaNinePeaks_group-room_0.jpg",
          "/uploads/gallery/group-room/KoggalaNinePeaks_group-room_1.jpg",
          "/uploads/gallery/excursions/KoggalaNinePeaks_excursions_0.jpg",
          "/uploads/gallery/excursions/KoggalaNinePeaks_excursions_1.jpg",
        ],
        features: [
          "Multiple bed configurations",
          "Shared living and dining space",
          "Two bathroom facilities",
          "Direct lake access",
          "Shared kitchen access",
          "Group-friendly layout",
          "Pool and garden access",
          "Perfect for friend groups",
        ],
        amenities: ["Multiple Beds", "Shared Space", "Lake Access", "Pool Access", "WiFi", "AC"],
      },
    ];

    return NextResponse.json(roomsData);
  } catch (error) {
    console.error('Failed to load rooms data:', error);
    return NextResponse.json({ error: 'Failed to load rooms data.' }, { status: 500 });
  }
} 