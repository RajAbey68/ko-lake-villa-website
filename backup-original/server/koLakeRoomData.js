// Ko Lake Villa – Official Room Definitions & Pricing Logic

const today = new Date();
today.setHours(0, 0, 0, 0);

const getDirectPrice = (airbnbPrice, checkinDateStr) => {
  const checkinDate = new Date(checkinDateStr);
  checkinDate.setHours(0, 0, 0, 0);
  const diffInDays = Math.ceil((checkinDate - today) / (1000 * 60 * 60 * 24));
  const discount = diffInDays <= 3 ? 0.15 : 0.10;
  const directPrice = (airbnbPrice * (1 - discount)).toFixed(2);
  const label = diffInDays <= 3 ? "Last-Minute Deal (15% Off)" : "Direct Booking (10% Off)";
  const savings = (airbnbPrice - directPrice).toFixed(2);
  return { directPrice, label, savings, discount: discount * 100 };
};

const rooms = [
  {
    name: "Entire Villa Exclusive (KNP)",
    slug: "knp",
    airbnbPrice: 1800,
    capacity: "16++ guests (up to 25)",
    features: ["All 7 rooms", "60-ft pool", "Rooftop terrace", "Lakefront view"],
    link: "https://airbnb.co.uk/h/knp",
    checkinDate: "2025-06-05"
  },
  {
    name: "Master Family Suite (KNP1)",
    slug: "knp1",
    airbnbPrice: 450,
    capacity: "6 guests",
    features: ["Lake views", "Master suite", "Pool access"],
    link: "https://airbnb.co.uk/h/knp1",
    checkinDate: "2025-06-05"
  },
  {
    name: "Triple/Twin Rooms (KNP3)",
    slug: "knp3",
    airbnbPrice: 180,
    capacity: "3 guests per room (4 rooms)",
    features: ["Flexible bedding", "Garden views", "Shared amenities"],
    link: "https://airbnb.co.uk/h/knp3",
    checkinDate: "2025-06-05"
  },
  {
    name: "Group Room (KNP6)",
    slug: "knp6",
    airbnbPrice: 250,
    capacity: "4 guests",
    features: ["Team layout", "Communal space", "Shared access"],
    link: "Coming Soon",
    checkinDate: "2025-06-05"
  }
];

// Add dynamic pricing to each room
rooms.forEach(room => {
  const { directPrice, label, savings, discount } = getDirectPrice(room.airbnbPrice, room.checkinDate);
  room.directPrice = directPrice;
  room.discountLabel = label;
  room.savings = savings;
  room.discountPercent = discount;
});

// Debug checker for room name integrity
const expectedNames = [
  "Entire Villa Exclusive (KNP)",
  "Master Family Suite (KNP1)",
  "Triple/Twin Rooms (KNP3)",
  "Group Room (KNP6)"
];

const roomTest = rooms.every((room, idx) => room.name === expectedNames[idx]);

if (!roomTest) {
  console.error("🚨 Room name mismatch detected! Please verify room array order or names.");
} else {
  console.log("✅ Room names match official Ko Lake Villa structure.");
  console.log("💰 Direct booking pricing calculated successfully:");
  rooms.forEach(room => {
    console.log(`   ${room.name}: Airbnb $${room.airbnbPrice} → Direct $${room.directPrice} (Save $${room.savings})`);
  });
}

module.exports = { rooms, getDirectPrice, expectedNames };