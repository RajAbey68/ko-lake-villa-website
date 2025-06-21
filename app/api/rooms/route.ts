import { NextResponse } from "next/server"

// Data based on replit_source/server/koLakeRoomData.js
// In a real application, this would come from a database or CMS.
const rooms = [
  {
    id: "knp",
    name: "Entire Villa Exclusive (KNP)",
    description: "Book the entire Ko Lake Villa for an exclusive and private luxury experience. Perfect for large groups, families, or special events, ensuring you have the whole property to yourselves.",
    capacity: "16-25 Guests",
    size: "500", // in sqm
    features: ["All 7 Rooms", "Private 60-ft Pool", "Rooftop Terrace", "Full Lakefront Access", "Private Chef & Staff"],
    airbnbPrice: 1800,
    directPrice: 1620, // Example 10% discount
    imageUrl: "/placeholder.svg?height=400&width=600&text=Entire+Villa",
    slug: "entire-villa-exclusive"
  },
  {
    id: "knp1",
    name: "Master Family Suite (KNP1)",
    description: "A spacious and luxurious suite designed for families. Features multiple sleeping areas and a private living space to relax and connect with loved ones.",
    capacity: "6 Guests",
    size: "120",
    features: ["2 Bedrooms", "Private Balcony", "Lake Views", "En-suite Bathroom", "Pool Access"],
    airbnbPrice: 450,
    directPrice: 405,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Family+Suite",
    slug: "master-family-suite"
  },
  {
    id: "knp3",
    name: "Triple/Twin Rooms (KNP3)",
    description: "Four versatile rooms that can be configured for three individuals or as a twin-bedded room. Ideal for friends or smaller family groups seeking comfort and style.",
    capacity: "3 Guests per room",
    size: "40",
    features: ["Flexible Bedding (3 twins or 1 double + 1 twin)", "Garden Views", "Modern Amenities", "Shared Bathroom"],
    airbnbPrice: 180,
    directPrice: 162,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Triple+Room",
    slug: "triple-twin-rooms"
  },
  {
    id: "knp6",
    name: "Group Room (KNP6)",
    description: "A large, dynamic space designed for groups of friends or collaborators. Fosters a communal atmosphere while providing personal space and comfort.",
    capacity: "4 Guests",
    size: "60",
    features: ["Bunk-style Beds", "Communal Lounge Area", "Team Layout", "Garden Access"],
    airbnbPrice: 250,
    directPrice: 225,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Group+Room",
    slug: "group-room"
  }
];

export async function GET() {
  try {
    // In a real app, you might add logic for fetching/calculating dynamic prices here
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
