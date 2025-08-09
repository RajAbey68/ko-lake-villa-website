"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { listingsService, AirbnbListing } from '@/lib/firebase-listings'

interface ListingsContextType {
  listings: AirbnbListing[]
  loading: boolean
  error: string | null
  getListingByType: (type: 'entire-villa' | 'master-family-suite' | 'triple-twin-rooms') => AirbnbListing | null
  getListingUrl: (type: 'entire-villa' | 'master-family-suite' | 'triple-twin-rooms') => string
  refreshListings: () => Promise<void>
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined)

export function useListings() {
  const context = useContext(ListingsContext)
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider')
  }
  return context
}

interface ListingsProviderProps {
  children: React.ReactNode
}

export function ListingsProvider({ children }: ListingsProviderProps) {
  const [listings, setListings] = useState<AirbnbListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Initialize if needed
      await listingsService.initializeListings()
      
      // Get all active listings
      const activeListings = await listingsService.getActiveListings()
      setListings(activeListings)
      
    } catch (err) {
      console.error('Error loading listings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load listings')
      
      // Fallback to default data if Firebase fails
      setListings([
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
          lastUpdated: new Date(),
          updatedBy: 'fallback'
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
          lastUpdated: new Date(),
          updatedBy: 'fallback'
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
          lastUpdated: new Date(),
          updatedBy: 'fallback'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  const getListingByType = (type: 'entire-villa' | 'master-family-suite' | 'triple-twin-rooms'): AirbnbListing | null => {
    return listings.find(listing => listing.id === type) || null
  }

  const getListingUrl = (type: 'entire-villa' | 'master-family-suite' | 'triple-twin-rooms'): string => {
    const listing = getListingByType(type)
    return listing?.url || '#'
  }

  const refreshListings = async () => {
    await loadListings()
  }

  const value: ListingsContextType = {
    listings,
    loading,
    error,
    getListingByType,
    getListingUrl,
    refreshListings
  }

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  )
} 