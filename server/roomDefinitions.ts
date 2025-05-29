// Ko Lake Villa – Official Room Definitions with Smart Baseline Pricing

import { koLakeSmartPricing } from './smartPricing';

interface RoomDefinition {
  name: string;
  slug: string;
  capacity: string;
  features: string[];
  link: string;
  checkinDate: string;
  directPrice?: string;
  discountLabel?: string;
  airbnbPrice?: number;
  savings?: string;
}

export const koLakeVillaRooms: RoomDefinition[] = [
  {
    name: "Entire Villa (KLV)",
    slug: "klv",
    capacity: "18+ guests (up to 25)",
    features: ["5 Triple Rooms + 2 Suites", "60-ft infinity pool", "Rooftop terrace", "Lakefront views"],
    link: "https://airbnb.co.uk/h/klv",
    checkinDate: "2025-06-05"
  },
  {
    name: "Master Family Suite (KLV1)",
    slug: "klv1", 
    capacity: "6+ guests",
    features: ["Lake views", "Master suite", "Pool access", "Private terrace"],
    link: "https://airbnb.co.uk/h/klv1",
    checkinDate: "2025-06-05"
  },
  {
    name: "Triple/Twin Rooms (KLV3)",
    slug: "klv3",
    capacity: "3+ guests per room",
    features: ["Flexible bedding", "Garden views", "Shared amenities", "A/C"],
    link: "https://airbnb.co.uk/h/klv3",
    checkinDate: "2025-06-05"
  },
  {
    name: "Group Room (KLV6)",
    slug: "klv6",
    capacity: "6+ guests",
    features: ["Group layout", "Communal space", "Shared access", "A/C"],
    link: "Coming Soon",
    checkinDate: "2025-06-05"
  }
];

// Apply smart baseline pricing to each room
koLakeVillaRooms.forEach(room => {
  const pricing = koLakeSmartPricing.getDirectBookingRate(room.checkinDate);
  room.airbnbPrice = pricing.airbnbBase;
  room.directPrice = pricing.directPrice;
  room.discountLabel = pricing.label;
  room.savings = pricing.savings;
});

// Debug checker for room name integrity
const expectedNames = [
  "Entire Villa Exclusive (KNP)",
  "Master Family Suite (KNP1)",
  "Triple/Twin Rooms (KNP3)",
  "Group Room (KNP6)"
];

export const validateRoomStructure = (): boolean => {
  const roomTest = koLakeVillaRooms.every((room, idx) => room.name === expectedNames[idx]);
  
  if (!roomTest) {
    console.error("🚨 Room name mismatch detected! Please verify room array order or names.");
    return false;
  } else {
    console.log("✅ Room names match official Ko Lake Villa structure.");
    return true;
  }
};

// Calculate savings for display
export const calculateSavings = (airbnbPrice: number, checkinDate: string) => {
  const { directPrice, label } = getDirectPrice(airbnbPrice, checkinDate);
  const savings = (airbnbPrice - parseFloat(directPrice)).toFixed(2);
  
  return {
    airbnbPrice: airbnbPrice.toFixed(2),
    directPrice,
    savings,
    discountLabel: label
  };
};

// Initialize and validate on import
validateRoomStructure();