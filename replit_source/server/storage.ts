import { 
  users, type User, type InsertUser, type UpsertUser,
  rooms, type Room, type InsertRoom,
  testimonials, type Testimonial, type InsertTestimonial,
  activities, type Activity, type InsertActivity,
  diningOptions, type DiningOption, type InsertDiningOption,
  galleryImages, type GalleryImage, type InsertGalleryImage,
  bookingInquiries, type BookingInquiry, type InsertBookingInquiry,
  contactMessages, type ContactMessage, type InsertContactMessage,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  contentDocuments, type ContentDocument, type InsertContentDocument,
  visitorUploads,
  type PageHeroImage,
  type InsertPageHeroImage,
  type VisitorUpload,
  type InsertVisitorUpload,
} from "@shared/schema";
import { db } from "./db";
import { eq, inArray, desc } from "drizzle-orm";

// Define storage interface with all required CRUD operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // For backward compatibility
  getUserByUsername?(username: string): Promise<User | undefined>;
  createUser?(user: InsertUser): Promise<User>;

  // Room operations
  getRooms(): Promise<Room[]>;
  getRoomById(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Activity operations
  getActivities(): Promise<Activity[]>;
  getActivityById(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dining options operations
  getDiningOptions(): Promise<DiningOption[]>;
  getDiningOptionById(id: number): Promise<DiningOption | undefined>;
  createDiningOption(diningOption: InsertDiningOption): Promise<DiningOption>;

  // Gallery operations
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  getGalleryImageById(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(galleryImage: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(galleryImage: Partial<GalleryImage> & { id: number }): Promise<GalleryImage>;
  updateGalleryImageCategory(id: number, category: string): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<boolean>;
  deleteAllGalleryImages(): Promise<number>; // Returns count of deleted images

  // Booking operations
  createBookingInquiry(bookingInquiry: InsertBookingInquiry): Promise<BookingInquiry>;
  getBookingInquiries(): Promise<BookingInquiry[]>;
  markBookingInquiryAsProcessed(id: number): Promise<BookingInquiry | undefined>;

  // Contact operations
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;

  // Newsletter operations
  subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;

  // Page hero image operations
  getPageHeroImage(pageName: string): Promise<PageHeroImage | undefined>;
  setPageHeroImage(pageHeroImage: InsertPageHeroImage): Promise<PageHeroImage>;
  getAllPageHeroImages(): Promise<PageHeroImage[]>;

  // Content management operations
  getAllContent(): Promise<any[]>;
  saveContent(content: any[]): Promise<void>;

  // Content document operations
  getContentDocuments(): Promise<ContentDocument[]>;
  getContentDocumentById(id: number): Promise<ContentDocument | undefined>;
  getContentDocumentsByCategory(category: string): Promise<ContentDocument[]>;
  createContentDocument(document: InsertContentDocument): Promise<ContentDocument>;
  updateContentDocument(document: Partial<ContentDocument> & { id: number }): Promise<ContentDocument>;
  deleteContentDocument(id: number): Promise<boolean>;

  // Special request operations
  createSpecialRequest(request: any): Promise<any>;
  getSpecialRequests(): Promise<any[]>;

  // Visitor uploads management
  createVisitorUpload(data: InsertVisitorUpload): Promise<VisitorUpload>;
  getVisitorUploads(status?: string): Promise<VisitorUpload[]>;
  getVisitorUploadById(id: number): Promise<VisitorUpload | undefined>;
  approveVisitorUpload(id: number, approvedBy: string, notes?: string): Promise<boolean>;
  rejectVisitorUpload(id: number, approvedBy: string, notes?: string): Promise<boolean>;
  deleteVisitorUpload(id: number): Promise<boolean>;
  publishVisitorUpload(id: number): Promise<GalleryImage | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rooms: Map<number, Room>;
  private testimonials: Map<number, Testimonial>;
  private activities: Map<number, Activity>;
  private diningOptions: Map<number, DiningOption>;
  private galleryImages: Map<number, GalleryImage>;
  private bookingInquiries: Map<number, BookingInquiry>;
  private contactMessages: Map<number, ContactMessage>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private pageHeroImages: Map<string, PageHeroImage>;
  private websiteContent: Map<string, any>;
  private specialRequests: Map<number, any>;
  private visitorUploads: Map<number, VisitorUpload>;

  private nextUserId: number;
  private nextRoomId: number;
  private nextTestimonialId: number;
  private nextActivityId: number;
  private nextDiningOptionId: number;
  private nextGalleryImageId: number;
  private nextBookingInquiryId: number;
  private nextContactMessageId: number;
  private nextNewsletterSubscriberId: number;
  private nextSpecialRequestId: number;
  private nextVisitorUploadId: number;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.testimonials = new Map();
    this.activities = new Map();
    this.diningOptions = new Map();
    this.galleryImages = new Map();
    this.bookingInquiries = new Map();
    this.contactMessages = new Map();
    this.newsletterSubscribers = new Map();
    this.pageHeroImages = new Map();
    this.websiteContent = new Map();
    this.specialRequests = new Map();
    this.visitorUploads = new Map();

    this.nextUserId = 1;
    this.nextRoomId = 1;
    this.nextTestimonialId = 1;
    this.nextActivityId = 1;
    this.nextDiningOptionId = 1;
    this.nextGalleryImageId = 1;
    this.nextBookingInquiryId = 1;
    this.nextContactMessageId = 1;
    this.nextNewsletterSubscriberId = 1;
    this.nextSpecialRequestId = 1;
    this.nextVisitorUploadId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // Initialize data with authentic Airbnb structure and smart pricing
  private initializeData() {
    // Clear existing rooms first
    this.rooms.clear();

    // Ko Lake Villa - Real Airbnb Rates (extracted from live data)
    const BASE_RATES = {
      klv: 431,    // Entire Villa – real Airbnb rate with discounts applied
      klv1: 119,   // Family Suite – actual current rate
      klv3: 70,    // Triple/Twin per room – actual current rate
      klv6: 250,   // Group Room (planned)
    };

    const ROOM_CONFIG = [
      {
        id: "klv",
        name: "Entire Villa (KLV)",
        description: "Book the entire Ko Lake Villa exclusively - 5 triple rooms + 2 suites, 60-ft infinity pool, rooftop terrace, and lakefront grounds. Sleeps 18+ guests (up to 25). Perfect for corporate retreats, family reunions, or group celebrations.",
        airbnb: process.env.AIRBNB_KLV_URL || "https://airbnb.co.uk/h/klv",
        guests: "25+ guests",
        capacity: 25,
        size: 500,
        features: ["5 Triple Rooms + 2 Suites", "60-ft infinity pool", "Rooftop terrace", "Lakefront views"],
        imageUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
        checkinDate: "2025-06-05",
      },
      {
        id: "klv1", 
        name: "Master Family Suite (KLV1)",
        description: "Premium lakefront family suite sleeping 6+ guests. Master bedroom plus additional sleeping areas with stunning Koggala Lake views and direct pool access.",
        airbnb: process.env.AIRBNB_KLV1_URL || "https://airbnb.co.uk/h/klv1",
        guests: "6+ guests",
        capacity: 8,
        size: 60,
        features: ["Lake views", "Master suite", "Pool access", "Private terrace"],
        imageUrl: "/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg",
        checkinDate: "2025-06-05",
      },
      {
        id: "klv6",
        name: "Group Room (KLV6)",
        description: "Spacious group accommodation perfect for team retreats, wellness groups, or extended families. Designed for collaborative stays with shared spaces and modern amenities.",
        airbnb: process.env.AIRBNB_KLV6_URL || "https://airbnb.co.uk/h/klv6",
        guests: "6+ guests",
        capacity: 8,
        size: 40,
        features: ["Group layout", "Communal space", "Shared access", "A/C"],
        imageUrl: "/uploads/gallery/default/1747446102756-742973380-20250329_154102.jpg",
        checkinDate: "2025-06-05",
      },
      {
        id: "klv3",
        name: "Triple/Twin Rooms (KLV3)", 
        description: "Four flexible rooms, each sleeping 3+ guests per room. Perfect for friends, colleagues, or families wanting separate but connected accommodation. Choose twin or triple configurations.",
        airbnb: process.env.AIRBNB_KLV3_URL || "https://airbnb.co.uk/h/klv3",
        guests: "3+ guests per room",
        capacity: 4,
        size: 35,
        features: ["4 rooms available", "Flexible bedding", "Garden views", "A/C"],
        imageUrl: "/uploads/gallery/default/1747332069008-457831002-20250413_131721.jpg",
        checkinDate: "2025-06-05",
      },
    ];

    // Smart pricing function
    const getSmartRate = (baseRate: number, checkinDate: string): { directPrice: number, label: string } => {
      const today = new Date();
      const checkin = new Date(checkinDate);
      const daysToCheckin = Math.ceil((checkin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const discount = daysToCheckin <= 3 ? 0.15 : 0.10;
      const directPrice = +(baseRate * (1 - discount)).toFixed(2);
      const label = daysToCheckin <= 3 ? "15% Off – Last Minute!" : "10% Off – Book Direct";
      return { directPrice, label };
    };

    // Create rooms with smart pricing
    const sampleRooms: InsertRoom[] = ROOM_CONFIG.map(room => {
      const baseRate = BASE_RATES[room.id as keyof typeof BASE_RATES];
      const { directPrice, label } = getSmartRate(baseRate, room.checkinDate);

      return {
        name: room.name,
        description: room.description,
        price: directPrice,
        capacity: room.capacity,
        size: room.size,
        imageUrl: room.imageUrl,
        features: [...room.features, room.airbnb]
      };
    });

    // Validation function
    const validateRoomNames = (ROOM_CONFIG: any[]) => {
      const expected = [
        "Entire Villa (KLV)",
        "Master Family Suite (KLV1)",
        "Triple/Twin Rooms (KLV3)",
        "Group Room (KLV6)"
      ];
      const match = ROOM_CONFIG.every((room, index) => room.name === expected[index]);
      console.log(match ? "✅ Room names updated to KLV structure." : "❌ Room name mismatch found.");
      return match;
    };

    // Validate room structure
    validateRoomNames(ROOM_CONFIG);

    sampleRooms.forEach(room => this.createRoom(room));

    // Sample testimonials
    const sampleTestimonials: InsertTestimonial[] = [
      {
        rating: 5,
        comment: "Absolutely breathtaking! The views of the lake are spectacular, and the villa itself is a perfect blend of luxury and comfort. The staff went above and beyond to make our stay memorable.",
        guestName: "James & Diana",
        guestCountry: "United Kingdom",
        avatarInitials: "JD"
      },
      {
        rating: 5,
        comment: "We booked the entire villa for our family reunion and it was perfect. The spacious rooms, beautiful common areas, and the private chef service made it an unforgettable experience. We'll definitely be back!",
        guestName: "Sarah M.",
        guestCountry: "Australia",
        avatarInitials: "SM"
      },
      {
        rating: 4.5,
        comment: "As a digital nomad, I stayed at Ko Lake Villa for a month and loved every minute. The peaceful environment, reliable WiFi, and the ability to work with a view of the lake made it the perfect workation spot.",
        guestName: "Robert T.",
        guestCountry: "Canada",
        avatarInitials: "RT"
      }
    ];

    sampleTestimonials.forEach(testimonial => this.createTestimonial(testimonial));

    // Sample activities
    const sampleActivities: InsertActivity[] = [
      {
        name: "Lake Activities",
        description: "Enjoy the serenity of the lake with activities like kayaking, paddleboarding, and fishing available right from our private dock.",
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/koggala-lake-boat-ride-AvQ70njKxkUjwyPL.jpg"
      },
      {
        name: "Nature Trails",
        description: "Explore the surrounding natural beauty with guided or self-guided hikes on nearby trails suitable for all fitness levels.",
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1000,h=667,fit=crop/AGB2Mlr1kBCLQG4w/tea-plantations-1-m2EKDDE4lRc4J17Z.jpg"
      },
      {
        name: "Cultural Experiences",
        description: "Immerse yourself in local culture with village visits, traditional cooking classes, and artisan craft workshops.",
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=945,h=630,fit=crop/AGB2Mlr1kBCLQG4w/dsc01272-mVL9DDb1e2SaGRbV.jpg"
      }
    ];

    sampleActivities.forEach(activity => this.createActivity(activity));

    // Sample dining options
    const sampleDiningOptions: InsertDiningOption[] = [
      {
        name: "Private Chef Services",
        description: "Our private chef service brings the restaurant experience to your accommodation. Enjoy personalized menus featuring fresh local ingredients and international cuisine, tailored to your preferences and dietary requirements.",
        imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_0.jpg",
        features: ["Customized menu planning", "Local and international cuisine options", "Dietary accommodations available", "Breakfast, lunch, dinner, and special occasion services"]
      },
      {
        name: "Dining Experiences",
        description: "Create unforgettable dining memories with our specialized dining experiences. From romantic lakeside dinners to family barbecues, we can arrange a variety of dining options to enhance your stay.",
        imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_1.jpg",
        features: ["Lakeside romantic dinners", "Family barbecue setups", "Picnic baskets for outings", "Special celebration catering"]
      }
    ];

    sampleDiningOptions.forEach(diningOption => this.createDiningOption(diningOption));

    // Sample gallery images - organized by categories as requested
    const sampleGalleryImages: InsertGalleryImage[] = [
      // Family Suite - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
        alt: "Master Suite with Lake Views",
        title: "Master Suite with Lake Views",
        description: "Spacious master suite featuring panoramic views of Koggala Lake with modern amenities and traditional Sri Lankan design elements.",
        category: "family-suite",
        mediaType: "image",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747315800201-804896726-20250418_070740.jpg",
        alt: "Family Suite Living Area",
        title: "Family Suite Living Area", 
        description: "Elegant family suite living area designed for comfort and relaxation, with direct access to private terrace overlooking the lake.",
        category: "family-suite",
        mediaType: "image",
        sortOrder: 2
      },
      {
        imageUrl: "/uploads/gallery/default/1747318402896-391223206-20250420_170226.jpg",
        alt: "Private Bedroom Sanctuary",
        title: "Private Bedroom Sanctuary",
        description: "Beautifully appointed bedroom sanctuary offering tranquil lake views and premium bedding for the perfect rest.",
        category: "family-suite",
        mediaType: "image",
        sortOrder: 3
      },

      // Group Room - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747332069008-457831002-20250413_131721.jpg",
        alt: "Group Room with Multiple Beds",
        title: "Spacious Group Accommodation",
        description: "Perfect for team retreats or extended families, featuring multiple beds and shared spaces designed for collaborative stays.",
        category: "group-room",
        mediaType: "image",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4",
        alt: "Group Room Tour",
        title: "Group Room Video Tour",
        description: "Take a virtual walkthrough of our spacious group accommodation with modern amenities and lake views.",
        category: "group-room",
        mediaType: "video",
        sortOrder: 2
      },

      // Triple Room - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747346948159-145995621-20250420_170258.mp4",
        alt: "Triple Room Tour",
        title: "Triple Room Video Tour",
        description: "Explore our flexible triple rooms perfect for friends or families, with options for twin or triple bed configurations.",
        category: "triple-room",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747347253299-598773798-20250420_170648.mp4",
        alt: "Triple Room Overview",
        title: "Triple Room Features",
        description: "Discover the comfortable amenities and garden views available in our flexible triple room accommodation.",
        category: "triple-room",
        mediaType: "video",
        sortOrder: 2
      },

      // Dining Area - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747348711121-217846602-20250420_170654.mp4",
        alt: "Dining Experience",
        title: "Lakeside Dining Experience",
        description: "Enjoy authentic Sri Lankan cuisine prepared with fresh local ingredients while overlooking Koggala Lake.",
        category: "dining-area",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747359245374-177273305-20250420_170815.mp4",
        alt: "Dining Area Tour",
        title: "Dining Area Walkthrough",
        description: "Take a virtual tour of our elegant dining space where guests gather to enjoy delicious meals and lake views.",
        category: "dining-area",
        mediaType: "video",
        sortOrder: 2
      },
      {
        imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_0.jpg",
        alt: "Delicious Local Cake",
        title: "Sri Lankan Specialty Cake",
        description: "Traditional Sri Lankan cake served in our dining area, made with authentic local ingredients and spices.",
        category: "dining-area",
        mediaType: "image",
        featured: false,
        sortOrder: 3
      },
      {
        imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_1.jpg",
        alt: "Traditional Sri Lankan Dessert",
        title: "Authentic Local Dessert",
        description: "Handmade traditional Sri Lankan dessert featuring coconut and local spices, served fresh in our dining area.",
        category: "dining-area",
        mediaType: "image",
        featured: false,
        sortOrder: 4
      },

      // Pool Deck - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747367220545-41420806-20250420_170745.mp4",
        alt: "Pool Deck Tour",
        title: "Pool Deck & Lake Views",
        description: "Experience the tranquil pool area with stunning panoramic views of Koggala Lake - perfect for relaxation and swimming.",
        category: "pool-deck",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
        alt: "Pool Deck View",
        title: "Poolside Paradise",
        description: "Relax by the infinity pool while enjoying unobstructed views of the serene Koggala Lake and surrounding nature.",
        category: "pool-deck",
        mediaType: "image",
        sortOrder: 2
      },

      // Lake Garden - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747315800201-804896726-20250418_070740.jpg",
        alt: "Lake Garden View",
        title: "Lakeside Garden Sanctuary",
        description: "Walk through our beautifully landscaped gardens that lead directly to the shores of Koggala Lake, offering peaceful meditation spots.",
        category: "lake-garden",
        mediaType: "image",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747318402896-391223206-20250420_170226.jpg",
        alt: "Lake Garden Area",
        title: "Tropical Garden Pathways",
        description: "Discover winding paths through lush tropical vegetation with comfortable seating areas overlooking the tranquil lake waters.",
        category: "lake-garden",
        mediaType: "image",
        sortOrder: 2
      },

      // Roof Garden - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
        alt: "Roof Garden View",
        category: "roof-garden",
        mediaType: "image",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747332069008-457831002-20250413_131721.jpg",
        alt: "Roof Garden Lounge",
        category: "roof-garden",
        mediaType: "image",
        sortOrder: 2
      },

      // Front Garden and Entrance - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4",
        alt: "Villa Entrance Tour",
        category: "front-garden",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747346948159-145995621-20250420_170258.mp4",
        alt: "Front Garden Walk",
        category: "front-garden",
        mediaType: "video",
        sortOrder: 2
      },

      // Koggala Lake Ahangama and Surrounding - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747347253299-598773798-20250420_170648.mp4",
        alt: "Koggala Lake Tour",
        category: "koggala-lake",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747348711121-217846602-20250420_170654.mp4",
        alt: "Lake Activities Video",
        category: "koggala-lake",
        mediaType: "video",
        sortOrder: 2
      },

      // Excursions - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747359245374-177273305-20250420_170815.mp4",
        alt: "Local Excursion Video",
        category: "excursions",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747367220545-41420806-20250420_170745.mp4",
        alt: "Beach Tour",
        category: "excursions",
        mediaType: "video",
        sortOrder: 2
      },
       // Events - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747359245374-177273305-20250420_170815.mp4",
        alt: "Local Event Video",
        category: "events",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747367220545-41420806-20250420_170745.mp4",
        alt: "Events",
        category: "events",
        mediaType: "video",
        sortOrder: 2
      },
       // Friends - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747359245374-177273305-20250420_170815.mp4",
        alt: "Friends at Villa",
        category: "friends",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747367220545-41420806-20250420_170745.mp4",
        alt: "Friends",
        category: "friends",
        mediaType: "video",
        sortOrder: 2
      }
    ];

    sampleGalleryImages.forEach(galleryImage => this.createGalleryImage(galleryImage));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Room methods
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.nextRoomId++;
    const room: Room = { ...insertRoom, id };
    this.rooms.set(id, room);
    return room;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.nextTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivityById(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.nextActivityId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Dining options methods
  async getDiningOptions(): Promise<DiningOption[]> {
    return Array.from(this.diningOptions.values());
  }

  async getDiningOptionById(id: number): Promise<DiningOption | undefined> {
    return this.diningOptions.get(id);
  }

  async createDiningOption(insertDiningOption: InsertDiningOption): Promise<DiningOption> {
    const id = this.nextDiningOptionId++;
    const diningOption: DiningOption = { ...insertDiningOption, id };
    this.diningOptions.set(id, diningOption);
    return diningOption;
  }

  // Gallery methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).filter(
      (image) => image.category === category
    );
  }

  async getGalleryImageById(id: number): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(insertGalleryImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.nextGalleryImageId++;

    // Ensure all required fields have values
    const galleryImage: GalleryImage = { 
      ...insertGalleryImage, 
      id,
      featured: insertGalleryImage.featured ?? false,
      sortOrder: insertGalleryImage.sortOrder ?? 0,
      mediaType: insertGalleryImage.mediaType ?? "image"
    };

    this.galleryImages.set(id, galleryImage);
    return galleryImage;
  }

  async updateGalleryImage(partialGalleryImage: Partial<GalleryImage> & { id: number }): Promise<GalleryImage> {
    const { id } = partialGalleryImage;
    console.log(`[STORAGE] Updating gallery image ${id} with:`, partialGalleryImage);
    
    const existingImage = this.galleryImages.get(id);

    if (!existingImage) {
      console.error(`[STORAGE] Gallery image with ID ${id} not found`);
      throw new Error(`Gallery image with ID ${id} not found`);
    }

    console.log(`[STORAGE] Existing image before update:`, existingImage);

    // Update the existing image with the new properties
    const updatedImage: GalleryImage = {
      ...existingImage,
      ...partialGalleryImage,
      id // Ensure ID is always preserved
    };

    console.log(`[STORAGE] Updated image after merge:`, updatedImage);

    this.galleryImages.set(id, updatedImage);
    
    // Verify the update was saved
    const verifyImage = this.galleryImages.get(id);
    console.log(`[STORAGE] Verification - image after save:`, verifyImage);
    
    return updatedImage;
  }

  async updateGalleryImageCategory(id: number, category: string): Promise<GalleryImage> {
    const existingImage = this.galleryImages.get(id);

    if (!existingImage) {
      throw new Error(`Gallery image with ID ${id} not found`);
    }

    // Update the image category
    const updatedImage: GalleryImage = {
      ...existingImage,
      category
    };

    this.galleryImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    if (!this.galleryImages.has(id)) {
      return false;
    }

    return this.galleryImages.delete(id);
  }

  async deleteAllGalleryImages(): Promise<number> {
    const count = this.galleryImages.size;
    this.galleryImages.clear();
    return count;
  }

  // Booking methods
  async createBookingInquiry(insertBookingInquiry: InsertBookingInquiry): Promise<BookingInquiry> {
    const id = this.nextBookingInquiryId++;
    const createdAt = new Date().toISOString();
    const bookingInquiry: BookingInquiry = { 
      ...insertBookingInquiry, 
      id, 
      createdAt, 
      processed: false 
    };
    this.bookingInquiries.set(id, bookingInquiry);
    return bookingInquiry;
  }

  async getBookingInquiries(): Promise<BookingInquiry[]> {
    return Array.from(this.bookingInquiries.values());
  }

  async markBookingInquiryAsProcessed(id: number): Promise<BookingInquiry | undefined> {
    const bookingInquiry = this.bookingInquiries.get(id);
    if (bookingInquiry) {
      const updatedBookingInquiry: BookingInquiry = {
        ...bookingInquiry,
        processed: true
      };
      this.bookingInquiries.set(id, updatedBookingInquiry);
      return updatedBookingInquiry;
    }
    return undefined;
  }

  // Contact methods
  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.nextContactMessageId++;
    const createdAt = new Date().toISOString();
    const contactMessage: ContactMessage = { 
      ...insertContactMessage, 
      id, 
      createdAt, 
      read: false 
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const contactMessage = this.contactMessages.get(id);
    if (contactMessage) {
      const updatedContactMessage: ContactMessage = {
        ...contactMessage,
        read: true
      };
      this.contactMessages.set(id, updatedContactMessage);
      return updatedContactMessage;
    }
    return undefined;
  }

  // Newsletter methods
  async subscribeToNewsletter(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === insertSubscriber.email
    );

    if (existingSubscriber) {
      // If subscriber exists but is inactive, reactivate them
      if (!existingSubscriber.active) {
        const updatedSubscriber: NewsletterSubscriber = {
          ...existingSubscriber,
          active: true
        };
        this.newsletterSubscribers.set(existingSubscriber.id, updatedSubscriber);
        return updatedSubscriber;
      }
      // If already active, just return the existing subscriber
      return existingSubscriber;
    }

    // Create new subscriber
    const id = this.nextNewsletterSubscriberId++;
    const createdAt = new Date().toISOString();
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt, 
      active: true 
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const subscriber = Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email
    );

    if (subscriber) {
      const updatedSubscriber: NewsletterSubscriber = {
        ...subscriber,
        active: false
      };
      this.newsletterSubscribers.set(subscriber.id, updatedSubscriber);
      return true;
    }
    return false;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values()).filter(
      (subscriber) => subscriber.active
    );
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email && subscriber.active
    );
  }

  // Content management operations
  async getAllContent(): Promise<any[]> {
    // Initialize with default content if none exists
    if (this.websiteContent.size === 0) {
      const defaultContent = [
        {
          id: 'home-hero-title',
          page: 'home',
          section: 'hero',
          title: 'Hero Title',
          content: 'Welcome to Lakeside Luxury',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'home-hero-subtitle',
          page: 'home',
          section: 'hero',
          title: 'Hero Subtitle',
          content: 'Ko Lake Villa is a boutique accommodation nestled on the shores of a serene lake in Ahangama, Galle, offering a perfect blend of luxury, comfort, and natural beauty. Our villa provides an exclusive retreat for travelers seeking tranquility and authentic Sri Lankan experience.',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'accommodation-title',
          page: 'accommodation',
          section: 'hero',
          title: 'Page Title',
          content: 'Luxury Accommodations',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'dining-title',
          page: 'dining',
          section: 'hero',
          title: 'Page Title',
          content: 'Culinary Excellence',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'dining-description',
          page: 'dining',
          section: 'hero',
          title: 'Dining Description',
          content: 'Experience exceptional culinary delights at Ko Lake Villa. Our kitchen offers authentic Sri Lankan cuisine alongside international favorites, prepared with fresh local ingredients and served with stunning lake views.',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'experiences-title',
          page: 'experiences',
          section: 'hero',
          title: 'Page Title',
          content: 'Unique Experiences',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'experiences-description',
          page: 'experiences',
          section: 'hero',
          title: 'Experience Description',
          content: 'Discover unforgettable adventures at Ko Lake Villa. From serene lake excursions and traditional fishing experiences to cultural tours of nearby temples and local markets, we offer authentic Sri Lankan experiences.',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'gallery-title',
          page: 'gallery',
          section: 'hero',
          title: 'Page Title',
          content: 'Photo Gallery',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'gallery-description',
          page: 'gallery',
          section: 'hero',
          title: 'Gallery Description',
          content: 'Explore the beauty of Ko Lake Villa through our curated photo collection. From stunning lake views and luxurious accommodations to culinary delights and unique experiences.',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'contact-title',
          page: 'contact',
          section: 'hero',
          title: 'Page Title',
          content: 'Get in Touch',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'contact-description',
          page: 'contact',
          section: 'hero',
          title: 'Contact Description',
          content: 'Ready to experience the tranquility of Ko Lake Villa? Contact us to make your reservation or inquire about our accommodations, dining, and unique experiences.',
          lastUpdated: new Date().toISOString()
        }
      ];

      defaultContent.forEach(item => {
        this.websiteContent.set(item.id, item);
      });
    }

    return Array.from(this.websiteContent.values());
  }

  async saveContent(content: any[]): Promise<void> {
    content.forEach(item => {
      item.lastUpdated = new Date().toISOString();
      this.websiteContent.set(item.id, item);
    });
  }

  // Page hero image operations (placeholder methods)
  async getPageHeroImage(pageName: string): Promise<any | undefined> {
    return this.pageHeroImages.get(pageName);
  }

  async setPageHeroImage(pageHeroImage: any): Promise<any> {
    this.pageHeroImages.set(pageHeroImage.pageName, pageHeroImage);
    return pageHeroImage;
  }

  async getAllPageHeroImages(): Promise<any[]> {
    return Array.from(this.pageHeroImages.values());
  }

   // Visitor upload operations
  async createVisitorUpload(upload: InsertVisitorUpload): Promise<VisitorUpload> {
    const id = this.nextVisitorUploadId++;
    const createdAt = new Date().toISOString();
    const visitorUpload: VisitorUpload = {
      ...upload,
      id,
      createdAt,
      status: 'pending', // Default status
      approvedAt: null,
      approvedBy: null,
      moderatorNotes: null
    };
    this.visitorUploads.set(id, visitorUpload);
    return visitorUpload;
  }

  async getVisitorUploads(status?: string): Promise<VisitorUpload[]> {
    let uploads = Array.from(this.visitorUploads.values());
    if (status) {
      uploads = uploads.filter(upload => upload.status === status);
    }
    return uploads;
  }

  async getVisitorUploadById(id: number): Promise<VisitorUpload | undefined> {
    return this.visitorUploads.get(id);
  }

  async approveVisitorUpload(id: number, approvedBy: string, notes?: string): Promise<boolean> {
    const upload = this.visitorUploads.get(id);
    if (!upload) return false;

    const updatedUpload: VisitorUpload = {
      ...upload,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: approvedBy,
      moderatorNotes: notes || null
    };
    this.visitorUploads.set(id, updatedUpload);
    return true;
  }

  async rejectVisitorUpload(id: number, approvedBy: string, notes?: string): Promise<boolean> {
    const upload = this.visitorUploads.get(id);
    if (!upload) return false;

    const updatedUpload: VisitorUpload = {
      ...upload,
      status: 'rejected',
      approvedBy: approvedBy,
      moderatorNotes: notes || null
    };
    this.visitorUploads.set(id, updatedUpload);
    return true;
  }

  async deleteVisitorUpload(id: number): Promise<boolean> {
    return this.visitorUploads.delete(id);
  }

   async publishVisitorUpload(id: number): Promise<GalleryImage | undefined> {
      const upload = this.visitorUploads.get(id);
        if (!upload || upload.status !== 'approved') {
          return undefined; // Or handle the error as you see fit
        }

        // Map VisitorUpload data to GalleryImage
        const galleryImage: GalleryImage = {
          id: this.nextGalleryImageId++, // Generate a new ID
          imageUrl: upload.imageUrl,
          alt: upload.alt,
          category: upload.category,
          mediaType: upload.mediaType,
          featured: false,
          sortOrder: 0
        };

        this.galleryImages.set(galleryImage.id, galleryImage);
        return galleryImage;
  }

  // Content document operations
  async getContentDocuments(): Promise<ContentDocument[]> {
    return await db.select().from(contentDocuments);
  }

  async getContentDocumentById(id: number): Promise<ContentDocument | undefined> {
    const result = await db.select().from(contentDocuments).where(eq(contentDocuments.id, id));
    return result[0];
  }

  async getContentDocumentsByCategory(category: string): Promise<ContentDocument[]> {
    return await db.select().from(contentDocuments).where(eq(contentDocuments.category, category));
  }

  async createContentDocument(document: InsertContentDocument): Promise<ContentDocument> {
    const result = await db.insert(contentDocuments).values(document).returning();
    return result[0];
  }

  async updateContentDocument(document: Partial<ContentDocument> & { id: number }): Promise<ContentDocument> {
    const result = await db.update(contentDocuments)
      .set(document)
      .where(eq(contentDocuments.id, document.id))
      .returning();
    return result[0];
  }

  async deleteContentDocument(id: number): Promise<boolean> {
    const result = await db.delete(contentDocuments).where(eq(contentDocuments.id, id));
    return result.rowCount > 0;
  }

  // Special request operations
  async createSpecialRequest(request: any): Promise<any> {
    const specialRequest = {
      id: this.nextSpecialRequestId++,
      ...request,
      createdAt: new Date().toISOString()
    };
    this.specialRequests.set(specialRequest.id, specialRequest);
    return specialRequest;
  }

  async getSpecialRequests(): Promise<any[]> {
    return Array.from(this.specialRequests.values());
  }
}

// Database storage implementation
class DbStorage implements IStorage {
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(galleryImages.sortOrder, galleryImages.id);
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages)
      .where(eq(galleryImages.category, category))
      .orderBy(galleryImages.sortOrder, galleryImages.id);
  }

  // Batch operations for better efficiency
  async getGalleryImagesBatch(imageIds: number[]): Promise<GalleryImage[]> {
    if (imageIds.length === 0) return [];
    return db.select().from(galleryImages)
      .where(inArray(galleryImages.id, imageIds));
  }

  async updateGalleryImagesBatch(updates: Array<{id: number, data: Partial<GalleryImage>}>): Promise<void> {
    await db.transaction(async (tx) => {
      for (const update of updates) {
        await tx.update(galleryImages)
          .set(update.data)
          .where(eq(galleryImages.id, update.id));
      }
    });
  }

  async updateGalleryImage(galleryImage: Partial<GalleryImage> & { id: number }): Promise<GalleryImage> {
    try {
      const { id, ...updates } = galleryImage;
      
      // Filter out undefined values to prevent Drizzle errors
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const [updatedImage] = await db
        .update(galleryImages)
        .set(cleanUpdates)
        .where(eq(galleryImages.id, id))
        .returning();

      if (!updatedImage) {
        throw new Error('Image not found');
      }

      return updatedImage;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      throw error;
    }
  }

  async getGalleryImageById(id: number): Promise<GalleryImage | null> {
    try {
      const [image] = await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.id, id))
        .limit(1);

      return image || null;
    } catch (error) {
      console.error('Error fetching gallery image by ID:', error);
      throw error;
    }
  }

  async createGalleryImage(insertGalleryImage: InsertGalleryImage): Promise<GalleryImage> {
    const [galleryImage] = await db.insert(galleryImages).values(insertGalleryImage).returning();
    return galleryImage;
  }

  async updateGalleryImageCategory(id: number, category: string): Promise<GalleryImage> {
    const [updated] = await db.update(galleryImages).set({ category }).where(eq(galleryImages.id, id)).returning();
    return updated;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return result.rowCount > 0;
  }

  async deleteAllGalleryImages(): Promise<number> {
    const result = await db.delete(galleryImages);
    return result.rowCount;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).onConflictDoUpdate({
      target: users.email,
      set: user
    }).returning();
    return result;
  }

  // Room operations
  async getRooms(): Promise<Room[]> {
    return await db.select().from(rooms);
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    const results = await db.select().from(rooms).where(eq(rooms.id, id));
    return results[0];
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const [result] = await db.insert(rooms).values(room).returning();
    return result;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [result] = await db.insert(testimonials).values(testimonial).returning();
    return result;
  }

  // Activity operations
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivityById(id: number): Promise<Activity | undefined> {
    const results = await db.select().from(activities).where(eq(activities.id, id));
    return results[0];
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [result] = await db.insert(activities).values(activity).returning();
    return result;
  }

  // Dining operations
  async getDiningOptions(): Promise<DiningOption[]> {
    return await db.select().from(diningOptions);
  }

  async getDiningOptionById(id: number): Promise<DiningOption | undefined> {
    const results = await db.select().from(diningOptions).where(eq(diningOptions.id, id));
    return results[0];
  }

  async createDiningOption(diningOption: InsertDiningOption): Promise<DiningOption> {
    const [result] = await db.insert(diningOptions).values(diningOption).returning();
    return result;
  }

  // Booking operations
  async createBookingInquiry(bookingInquiry: InsertBookingInquiry): Promise<BookingInquiry> {
    const [result] = await db.insert(bookingInquiries).values(bookingInquiry).returning();
    return result;
  }

  async getBookingInquiries(): Promise<BookingInquiry[]> {
    return await db.select().from(bookingInquiries);
  }

  async markBookingInquiryAsProcessed(id: number): Promise<BookingInquiry | undefined> {
    const [result] = await db.update(bookingInquiries)
      .set({ processed: true })
      .where(eq(bookingInquiries.id, id))
      .returning();
    return result;
  }

  // Contact operations
  async createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage> {
    const [result] = await db.insert(contactMessages).values(contactMessage).returning();
    return result;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  // Newsletter subscription management
  async subscribeToNewsletter(data: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [subscriber] = await db.insert(newsletterSubscribers).values(data).returning();
    return subscriber;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));
    return subscriber;
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const result = await db.update(newsletterSubscribers)
      .set({ active: false })
      .where(eq(newsletterSubscribers.email, email));
    return result.rowCount! > 0;
  }

  // Visitor uploads management
  async createVisitorUpload(data: InsertVisitorUpload): Promise<VisitorUpload> {
    const [upload] = await db.insert(visitorUploads).values(data).returning();
    return upload;
  }

  async getVisitorUploads(status?: string): Promise<VisitorUpload[]> {
    const query = db.select().from(visitorUploads);
    if (status) {
      return await query.where(eq(visitorUploads.status, status)).orderBy(desc(visitorUploads.createdAt));
    }
    return await query.orderBy(desc(visitorUploads.createdAt));
  }

  async getVisitorUploadById(id: number): Promise<VisitorUpload | undefined> {
    const [upload] = await db.select().from(visitorUploads)
      .where(eq(visitorUploads.id, id));
    return upload;
  }

  async approveVisitorUpload(id: number, approvedBy: string, notes?: string): Promise<boolean> {
    const result = await db.update(visitorUploads)
      .set({ 
        status: 'approved', 
        approvedAt: new Date(),
        approvedBy,
        moderatorNotes: notes 
      })
      .where(eq(visitorUploads.id, id));
    return result.rowCount! > 0;
  }

  async rejectVisitorUpload(id: number, approvedBy: string, notes?: string): Promise<boolean> {
    const result = await db.update(visitorUploads)
      .set({ 
        status: 'rejected', 
        approvedBy,
        moderatorNotes: notes 
      })
      .where(eq(visitorUploads.id, id));
    return result.rowCount! > 0;
  }

  async deleteVisitorUpload(id: number): Promise<boolean> {
    const result = await db.delete(visitorUploads).where(eq(visitorUploads.id, id));
    return result.rowCount! > 0;
  }

  async publishVisitorUpload(id: number): Promise<GalleryImage | null> {
    const upload = await this.getVisitorUploadById(id);
    if (!upload || upload.status !== 'approved') {
      return null;
    }

    // Create gallery image from approved visitor upload
    const galleryData = {
      imageUrl: upload.imageUrl,
      alt: upload.alt,
      description: upload.description,
      tags: upload.tags,
      category: upload.category,
      mediaType: upload.mediaType,
      fileSize: upload.fileSize,
      featured: false,
      sortOrder: 0,
      displaySize: 'medium' as const
    };

    const [galleryImage] = await db.insert(galleryImages).values(galleryData).returning();
    return galleryImage;
  }

  // Content operations - fallback to default content for now
  async getAllContent(): Promise<any[]> {
    // Return default content structure for now
    return [
      {
        id: 'home-hero-title',
        page: 'home',
        section: 'hero',
        title: 'Hero Title',
        content: 'Ko Lake Villa',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'home-hero-subtitle',
        page: 'home',
        section: 'hero',
        title: 'Hero Subtitle',
        content: 'Luxury lakeside retreat in Ahangama, Galle',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'accommodation-title',
        page: 'accommodation',
        section: 'hero',
        title: 'Page Title',
        content: 'Luxury Accommodations',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'dining-title',
        page: 'dining',
        section: 'hero',
        title: 'Page Title',
        content: 'Culinary Excellence',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'experiences-title',
        page: 'experiences',
        section: 'hero',
        title: 'Page Title',
        content: 'Unique Experiences',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'gallery-title',
        page: 'gallery',
        section: 'hero',
        title: 'Page Title',
        content: 'Photo Gallery',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'contact-title',
        page: 'contact',
        section: 'hero',
        title: 'Page Title',
        content: 'Get in Touch',
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  async saveContent(content: any[]): Promise<void> {
    // Content will be handled separately for now
    console.log('Content save requested for', content.length, 'items');
  }

  // Special request operations
  async createSpecialRequest(request: any): Promise<any> {
    // For now, store in memory as we don't have a database table
    // In production, this would insert into a special_requests table
    return { id: Date.now(), ...request, createdAt: new Date().toISOString() };
  }

  async getSpecialRequests(): Promise<any[]> {
    // For now, return empty array as we don't have a database table
    // In production, this would query the special_requests table
    return [];
  }
}

// Use database storage for persistence
export const storage = new DbStorage();