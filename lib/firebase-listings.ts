import React from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Firebase configuration (you'll need to add your config)
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface AirbnbListing {
  id: string;
  name: string;
  url: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  isActive: boolean;
  displayOrder: number;
  lastUpdated: Date;
  updatedBy: string;
}

// Default listings data - Ko Lake Villa official listings
const DEFAULT_LISTINGS: Omit<AirbnbListing, 'lastUpdated'>[] = [
  {
    id: 'entire-villa',
    name: 'Entire Villa',
    url: 'https://airbnb.co.uk/h/eklv',
    description: '7 air-conditioned ensuite bedrooms, sleeps max 23 on beds',
    maxGuests: 23,
    bedrooms: 7,
    bathrooms: 7,
    features: ['7 ensuite bedrooms', 'Air conditioning', 'Private pool', 'Lake views', 'Full kitchen'],
    isActive: true,
    displayOrder: 1,
    updatedBy: 'system'
  },
  {
    id: 'master-family-suite',
    name: 'Master Family Suite',
    url: 'https://airbnb.co.uk/h/klv6',
    description: 'Premium family suite with lake views and private access',
    maxGuests: 6,
    bedrooms: 1,
    bathrooms: 1,
    features: ['Lake views', 'Master bedroom', 'Private terrace', 'Pool access'],
    isActive: true,
    displayOrder: 2,
    updatedBy: 'system'
  },
  {
    id: 'triple-twin-rooms',
    name: 'Triple/Twin Rooms',
    url: 'https://airbnb.co.uk/h/klv2or3',
    description: 'Flexible room configurations for individuals or small groups',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    features: ['Flexible bedding', 'Air conditioning', 'Garden views', 'Shared facilities'],
    isActive: true,
    displayOrder: 3,
    updatedBy: 'system'
  }
];

class FirebaseListingsService {
  private readonly COLLECTION_NAME = 'airbnb_listings';

  /**
   * Initialize listings collection with default data if it doesn't exist
   */
  async initializeListings(): Promise<void> {
    try {
      const listingsSnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      
      if (listingsSnapshot.empty) {
        console.log('Initializing Ko Lake Villa listings...');
        for (const listing of DEFAULT_LISTINGS) {
          await this.createListing({
            ...listing,
            lastUpdated: new Date()
          });
        }
        console.log('✅ Ko Lake Villa listings initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing listings:', error);
      throw error;
    }
  }

  /**
   * Get all active listings
   */
  async getActiveListings(): Promise<AirbnbListing[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const listings: AirbnbListing[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive) {
          listings.push({
            id: doc.id,
            ...data,
            lastUpdated: data.lastUpdated.toDate()
          } as AirbnbListing);
        }
      });
      
      // Sort by display order
      return listings.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Return fallback data if Firebase fails
      return DEFAULT_LISTINGS.map(listing => ({
        ...listing,
        lastUpdated: new Date()
      }));
    }
  }

  /**
   * Get all listings (including inactive)
   */
  async getAllListings(): Promise<AirbnbListing[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const listings: AirbnbListing[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        listings.push({
          id: doc.id,
          ...data,
          lastUpdated: data.lastUpdated.toDate()
        } as AirbnbListing);
      });
      
      return listings.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
      console.error('Error fetching all listings:', error);
      throw error;
    }
  }

  /**
   * Get a specific listing by ID
   */
  async getListing(id: string): Promise<AirbnbListing | null> {
    try {
      const listings = await this.getAllListings();
      return listings.find(listing => listing.id === id) || null;
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  }

  /**
   * Create a new listing
   */
  async createListing(listing: AirbnbListing): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, listing.id);
      await setDoc(docRef, {
        ...listing,
        lastUpdated: new Date()
      });
      console.log(`✅ Listing ${listing.name} created successfully`);
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  /**
   * Update an existing listing
   */
  async updateListing(id: string, updates: Partial<AirbnbListing>, updatedBy: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: new Date(),
        updatedBy
      });
      console.log(`✅ Listing ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }

  /**
   * Delete a listing
   */
  async deleteListing(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log(`✅ Listing ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  /**
   * Listen to real-time updates
   */
  subscribeToListings(callback: (listings: AirbnbListing[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, this.COLLECTION_NAME),
      (snapshot) => {
        const listings: AirbnbListing[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          listings.push({
            id: doc.id,
            ...data,
            lastUpdated: data.lastUpdated.toDate()
          } as AirbnbListing);
        });
        callback(listings.sort((a, b) => a.displayOrder - b.displayOrder));
      },
      (error) => {
        console.error('Error in listings subscription:', error);
      }
    );
    
    return unsubscribe;
  }

  /**
   * Get listing URL by type (for backward compatibility)
   */
  async getListingUrl(type: 'entire-villa' | 'master-family-suite' | 'triple-twin-rooms'): Promise<string> {
    try {
      const listing = await this.getListing(type);
      return listing?.url || '#';
    } catch (error) {
      console.error('Error getting listing URL:', error);
      return '#';
    }
  }

  /**
   * Validate listing data
   */
  validateListing(listing: Partial<AirbnbListing>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!listing.name?.trim()) {
      errors.push('Listing name is required');
    }

    if (!listing.url?.trim()) {
      errors.push('Airbnb URL is required');
    } else if (!listing.url.includes('airbnb.co.uk')) {
      errors.push('URL must be a valid Airbnb UK link');
    }

    if (!listing.description?.trim()) {
      errors.push('Description is required');
    }

    if (!listing.maxGuests || listing.maxGuests < 1) {
      errors.push('Maximum guests must be at least 1');
    }

    if (!listing.bedrooms || listing.bedrooms < 1) {
      errors.push('Bedrooms must be at least 1');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const listingsService = new FirebaseListingsService();

// Utility hook for React components
export function useListings() {
  const [listings, setListings] = React.useState<AirbnbListing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let unsubscribe: () => void;

    const initializeAndSubscribe = async () => {
      try {
        await listingsService.initializeListings();
        
        unsubscribe = listingsService.subscribeToListings((updatedListings) => {
          setListings(updatedListings);
          setLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
        setLoading(false);
      }
    };

    initializeAndSubscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { listings, loading, error };
} 