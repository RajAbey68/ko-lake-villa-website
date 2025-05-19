import { 
  users, type User, type InsertUser, type UpsertUser,
  rooms, type Room, type InsertRoom,
  testimonials, type Testimonial, type InsertTestimonial,
  activities, type Activity, type InsertActivity,
  diningOptions, type DiningOption, type InsertDiningOption,
  galleryImages, type GalleryImage, type InsertGalleryImage,
  bookingInquiries, type BookingInquiry, type InsertBookingInquiry,
  contactMessages, type ContactMessage, type InsertContactMessage,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  
  private nextUserId: number;
  private nextRoomId: number;
  private nextTestimonialId: number;
  private nextActivityId: number;
  private nextDiningOptionId: number;
  private nextGalleryImageId: number;
  private nextBookingInquiryId: number;
  private nextContactMessageId: number;
  private nextNewsletterSubscriberId: number;

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
    
    this.nextUserId = 1;
    this.nextRoomId = 1;
    this.nextTestimonialId = 1;
    this.nextActivityId = 1;
    this.nextDiningOptionId = 1;
    this.nextGalleryImageId = 1;
    this.nextBookingInquiryId = 1;
    this.nextContactMessageId = 1;
    this.nextNewsletterSubscriberId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // Initialize some sample data
  private initializeData() {
    // Sample rooms
    const sampleRooms: InsertRoom[] = [
      {
        name: "Lakeside Suite",
        description: "Our premium suite with panoramic lake views, a king-sized bed, and a private balcony.",
        price: 250,
        capacity: 2,
        size: 45,
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1224,h=816,fit=crop/AGB2Mlr1kBCLQG4w/first-room-YBgXv53jwGFkD4xD.jpg",
        features: ["King Bed", "Lake View", "Private Balcony", "En-suite Bathroom"]
      },
      {
        name: "Garden Twin Room",
        description: "Comfortable room with twin beds, garden views, and modern amenities.",
        price: 180,
        capacity: 2,
        size: 32,
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1281,fit=crop/AGB2Mlr1kBCLQG4w/unnamed-1-YPqJJq3ZWphx96JN.jpg",
        features: ["Twin Beds", "Garden View", "En-suite", "Air Conditioning"]
      },
      {
        name: "Family Suite",
        description: "Spacious suite with a master bedroom, additional sleeping area, and lake views.",
        price: 320,
        capacity: 4,
        size: 60,
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-family-room-dai011-m8x6xQjkgDfEn2W3.jpg",
        features: ["Queen Bed", "Sofa Bed", "Lake View", "Dining Area"]
      }
    ];

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
        alt: "Family Suite Master Bedroom",
        category: "family-suite",
        mediaType: "image",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747315800201-804896726-20250418_070740.jpg",
        alt: "Family Suite Living Area",
        category: "family-suite",
        mediaType: "image",
        sortOrder: 2
      },
      {
        imageUrl: "/uploads/gallery/default/1747318402896-391223206-20250420_170226.jpg",
        alt: "Family Suite Bathroom",
        category: "family-suite",
        mediaType: "image",
        sortOrder: 3
      },
      
      // Group Room - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747332069008-457831002-20250413_131721.jpg",
        alt: "Group Room with Multiple Beds",
        category: "group-room",
        mediaType: "image",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4",
        alt: "Group Room Tour",
        category: "group-room",
        mediaType: "video",
        sortOrder: 2
      },
      
      // Triple Room - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747346948159-145995621-20250420_170258.mp4",
        alt: "Triple Room Tour",
        category: "triple-room",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747347253299-598773798-20250420_170648.mp4",
        alt: "Triple Room Overview",
        category: "triple-room",
        mediaType: "video",
        sortOrder: 2
      },
      
      // Dining Area - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747348711121-217846602-20250420_170654.mp4",
        alt: "Dining Experience",
        category: "dining-area",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747359245374-177273305-20250420_170815.mp4",
        alt: "Dining Area Tour",
        category: "dining-area",
        mediaType: "video",
        sortOrder: 2
      },
      
      // Pool Deck - Using actual uploaded images
      {
        imageUrl: "/uploads/gallery/default/1747367220545-41420806-20250420_170745.mp4",
        alt: "Pool Deck Tour",
        category: "pool-deck",
        mediaType: "video",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg",
        alt: "Pool Deck View",
        category: "pool-deck",
        mediaType: "image",
        sortOrder: 2
      },
      
      // Lake Garden
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-front-garden-dai034-AalZ87Xe9Pfr3xOl.jpg",
        alt: "Lake Garden Pathway",
        category: "lake-garden",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-lake-garden-dai028-mp10JLzNZRC7KWED.jpg",
        alt: "Lake Garden Seating Area",
        category: "lake-garden",
        sortOrder: 2
      },
      
      // Roof Garden
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-roof-garden-dai039-dOVD8wLlv9sO90XG.jpg",
        alt: "Roof Garden Panoramic View",
        category: "roof-garden",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-roof-garden-dai037-dOVD8w7z1VuLKeW8.jpg",
        alt: "Roof Garden Lounge Area",
        category: "roof-garden",
        sortOrder: 2
      },
      
      // Front Garden and Entrance
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1280,fit=crop/AGB2Mlr1kBCLQG4w/1-min-AoPWZwpbLZTW8Rr7.jpg",
        alt: "Villa Main Entrance",
        category: "front-garden",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-front-garden-dai027-dOVD8w6n9yt7GNB8.jpg",
        alt: "Front Garden Path",
        category: "front-garden",
        sortOrder: 2
      },
      
      // Koggala Lake Ahangama and Surrounding
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/koggala-lake-boat-ride-AvQ70njKxkUjwyPL.jpg",
        alt: "Koggala Lake Aerial View",
        category: "koggala-lake",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/1-dsc00005-1-min-AoPWZwXByQhnVvBG.jpg",
        alt: "Koggala Lake Traditional Fishing Boats",
        category: "koggala-lake",
        sortOrder: 2
      },
      
      // Excursions
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=945,h=630,fit=crop/AGB2Mlr1kBCLQG4w/dsc01272-mVL9DDb1e2SaGRbV.jpg",
        alt: "Local Temple Visit",
        category: "excursions",
        featured: true,
        sortOrder: 1
      },
      {
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1000,h=667,fit=crop/AGB2Mlr1kBCLQG4w/tea-plantations-1-m2EKDDE4lRc4J17Z.jpg",
        alt: "Beach Excursion",
        category: "excursions",
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
    const existingImage = this.galleryImages.get(id);
    
    if (!existingImage) {
      throw new Error(`Gallery image with ID ${id} not found`);
    }
    
    // Update the existing image with the new properties
    const updatedImage: GalleryImage = {
      ...existingImage,
      ...partialGalleryImage,
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
}

// Use memory storage for now since we're focused on the auth issue
export const storage = new MemStorage();
