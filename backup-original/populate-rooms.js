/**
 * Ko Lake Villa - Room Data Population
 * Using authentic property information for accommodations
 */

import { db } from './server/db.js';
import { rooms } from './shared/schema.js';

const roomsData = [
  {
    name: "KLV1 - Master Family Suite",
    description: "Spacious family suite with stunning lake views, separate living area, and premium amenities. Perfect for families seeking luxury and comfort at Ko Lake Villa.",
    capacity: 6,
    size: 45,
    imageUrl: "/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg",
    features: ["Lake Views", "Separate Living Area", "Private Balcony", "Kitchenette", "Premium Bathroom", "Air Conditioning"]
  },
  {
    name: "KLV3 - Triple/Twin Room",
    description: "Comfortable triple occupancy room with modern amenities and garden views. Ideal for friends or small families visiting the beautiful Ahangama area.",
    capacity: 3,
    size: 25,
    imageUrl: "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg",
    features: ["Three Comfortable Beds", "Air Conditioning", "Private Bathroom", "Garden Views", "Free WiFi", "Desk Workspace"]
  },
  {
    name: "KLV6 - Group Room",
    description: "Spacious group accommodation perfect for larger parties, with access to pool deck and dining areas. Experience Ko Lake Villa with your entire group.",
    capacity: 6,
    size: 35,
    imageUrl: "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg",
    features: ["Group Accommodation", "Pool Access", "Dining Area Access", "Multiple Sleeping Areas", "Shared Facilities", "Common Areas"]
  },
  {
    name: "KLV - Entire Villa",
    description: "Complete Ko Lake Villa experience with exclusive access to all rooms, facilities, and grounds. Perfect for special events, family reunions, or luxury group stays.",
    capacity: 18,
    size: 200,
    imageUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
    features: ["Entire Villa Access", "All Room Types", "Pool Deck", "Dining Areas", "Lake Garden", "Private Grounds", "Event Hosting", "Complete Privacy"]
  }
];

async function populateRooms() {
  console.log('Populating Ko Lake Villa room data...');
  
  try {
    for (const roomData of roomsData) {
      const result = await db.insert(rooms).values(roomData).returning();
      console.log(`✓ Added room: ${roomData.name}`);
    }
    console.log('Room data population completed successfully!');
  } catch (error) {
    console.error('Error populating rooms:', error);
  }
}

populateRooms();