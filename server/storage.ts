import { 
  users, type User, type InsertUser,
  rooms, type Room, type InsertRoom,
  testimonials, type Testimonial, type InsertTestimonial,
  activities, type Activity, type InsertActivity,
  diningOptions, type DiningOption, type InsertDiningOption,
  galleryImages, type GalleryImage, type InsertGalleryImage,
  bookingInquiries, type BookingInquiry, type InsertBookingInquiry,
  contactMessages, type ContactMessage, type InsertContactMessage,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";

// Define storage interface with all required CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
  createGalleryImage(galleryImage: InsertGalleryImage): Promise<GalleryImage>;

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
        imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        features: ["King Bed", "Lake View", "Private Balcony", "En-suite Bathroom"]
      },
      {
        name: "Garden Twin Room",
        description: "Comfortable room with twin beds, garden views, and modern amenities.",
        price: 180,
        capacity: 2,
        size: 32,
        imageUrl: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        features: ["Twin Beds", "Garden View", "En-suite", "Air Conditioning"]
      },
      {
        name: "Family Suite",
        description: "Spacious suite with a master bedroom, additional sleeping area, and lake views.",
        price: 320,
        capacity: 4,
        size: 60,
        imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
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
        imageUrl: "https://images.unsplash.com/photo-1472745433479-4556f22e32c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
      },
      {
        name: "Nature Trails",
        description: "Explore the surrounding natural beauty with guided or self-guided hikes on nearby trails suitable for all fitness levels.",
        imageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
      },
      {
        name: "Cultural Experiences",
        description: "Immerse yourself in local culture with village visits, traditional cooking classes, and artisan craft workshops.",
        imageUrl: "https://images.pixabay.com/photo/2016/11/08/05/11/children-1807511_1280.jpg"
      }
    ];

    sampleActivities.forEach(activity => this.createActivity(activity));

    // Sample dining options
    const sampleDiningOptions: InsertDiningOption[] = [
      {
        name: "Private Chef Services",
        description: "Our private chef service brings the restaurant experience to your accommodation. Enjoy personalized menus featuring fresh local ingredients and international cuisine, tailored to your preferences and dietary requirements.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        features: ["Customized menu planning", "Local and international cuisine options", "Dietary accommodations available", "Breakfast, lunch, dinner, and special occasion services"]
      },
      {
        name: "Dining Experiences",
        description: "Create unforgettable dining memories with our specialized dining experiences. From romantic lakeside dinners to family barbecues, we can arrange a variety of dining options to enhance your stay.",
        imageUrl: "https://images.pixabay.com/photo/2020/02/02/17/00/travel-4813658_1280.jpg",
        features: ["Lakeside romantic dinners", "Family barbecue setups", "Picnic baskets for outings", "Special celebration catering"]
      }
    ];

    sampleDiningOptions.forEach(diningOption => this.createDiningOption(diningOption));

    // Sample gallery images
    const sampleGalleryImages: InsertGalleryImage[] = [
      {
        imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Villa Exterior",
        category: "exterior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Living Room",
        category: "interior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Master Bedroom",
        category: "interior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Lakeside Deck",
        category: "exterior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Dining Area",
        category: "interior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Luxury Bathroom",
        category: "interior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1558521558-037f1cb027c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Garden Area",
        category: "exterior"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        alt: "Aerial View",
        category: "exterior"
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

  async createGalleryImage(insertGalleryImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.nextGalleryImageId++;
    const galleryImage: GalleryImage = { ...insertGalleryImage, id };
    this.galleryImages.set(id, galleryImage);
    return galleryImage;
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

export const storage = new MemStorage();
