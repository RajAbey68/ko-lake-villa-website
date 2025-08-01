import { NextRequest, NextResponse } from 'next/server'

interface AirbnbLookupRequest {
  accommodations: Array<{
    id: string
    url: string
  }>
}

interface AirbnbLookupResult {
  id: string
  accommodation: string
  airbnbUrl: string
  timestamp: string
  status: 'success' | 'failed' | 'pending'
  originalPrice?: number
  fetchedPrice?: number
  discountedPrice?: number
  errorMessage?: string
  responseTime?: number
}

// Simulate Airbnb price lookup (replace with real scraping/API)
async function lookupAirbnbPrice(url: string): Promise<{ price?: number, error?: string, responseTime: number }> {
  const startTime = Date.now()
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000))
    
    // Extract accommodation type from URL for realistic pricing
    if (url.includes('/h/eklv')) {
      // Entire villa - simulate real market pricing with some variation
      const basePrice = 431
      const variation = (Math.random() - 0.5) * 40 // +/- £20 variation
      return { 
        price: Math.round(basePrice + variation), 
        responseTime: (Date.now() - startTime) / 1000 
      }
    } else if (url.includes('/h/klv6')) {
      // Family suite
      const basePrice = 119
      const variation = (Math.random() - 0.5) * 20 // +/- £10 variation
      return { 
        price: Math.round(basePrice + variation), 
        responseTime: (Date.now() - startTime) / 1000 
      }
    } else if (url.includes('/h/klv2or3')) {
      // Triple/twin rooms
      const basePrice = 70
      const variation = (Math.random() - 0.5) * 12 // +/- £6 variation
      return { 
        price: Math.round(basePrice + variation), 
        responseTime: (Date.now() - startTime) / 1000 
      }
    }
    
    // Default fallback
    return { 
      price: Math.round(100 + Math.random() * 300), 
      responseTime: (Date.now() - startTime) / 1000 
    }
    
  } catch (error) {
    return { 
      error: 'Network timeout or Airbnb blocking', 
      responseTime: (Date.now() - startTime) / 1000 
    }
  }
}

function getAccommodationName(url: string): string {
  if (url.includes('/h/eklv')) return "Entire Villa Exclusive"
  if (url.includes('/h/klv6')) return "Master Family Suite"
  if (url.includes('/h/klv2or3')) return "Triple/Twin Rooms"
  return "Unknown Accommodation"
}

function calculateDiscount(price: number): number {
  return Math.round(price * 0.85) // 15% discount
}

export async function POST(request: NextRequest) {
  try {
    const body: AirbnbLookupRequest = await request.json()
    const results: AirbnbLookupResult[] = []
    
    console.log(`🔍 Starting Airbnb price lookup for ${body.accommodations.length} accommodations`)
    
    // Process each accommodation
    for (const accommodation of body.accommodations) {
      console.log(`📋 Looking up prices for: ${accommodation.url}`)
      
      const lookupResult = await lookupAirbnbPrice(accommodation.url)
      
      const result: AirbnbLookupResult = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        accommodation: getAccommodationName(accommodation.url),
        airbnbUrl: accommodation.url,
        timestamp: new Date().toISOString(),
        status: lookupResult.error ? 'failed' : 'success',
        responseTime: lookupResult.responseTime
      }
      
      if (lookupResult.error) {
        result.errorMessage = lookupResult.error
        console.log(`❌ Lookup failed for ${accommodation.url}: ${lookupResult.error}`)
      } else if (lookupResult.price) {
        result.fetchedPrice = lookupResult.price
        result.discountedPrice = calculateDiscount(lookupResult.price)
        console.log(`✅ Found price for ${accommodation.url}: £${lookupResult.price} → £${result.discountedPrice} (15% off)`)
      }
      
      results.push(result)
    }
    
    // Log summary
    const successful = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'failed').length
    console.log(`📊 Lookup Summary: ${successful} successful, ${failed} failed out of ${results.length} total`)
    
    // Store results in your database/logging system here
    // await storeAirbnbLookupResults(results)
    
    return NextResponse.json({
      success: true,
      lookups: results,
      summary: {
        total: results.length,
        successful,
        failed,
        averageResponseTime: results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length
      }
    })
    
  } catch (error) {
    console.error('❌ Airbnb lookup API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process Airbnb lookup request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return recent lookup history
  return NextResponse.json({
    message: "Use POST to trigger new lookups. Historical data would come from your database.",
    example: {
      method: "POST",
      body: {
        accommodations: [
          { id: "entire-villa", url: "https://airbnb.co.uk/h/eklv" },
          { id: "family-suite", url: "https://airbnb.co.uk/h/klv6" },
          { id: "triple-rooms", url: "https://airbnb.co.uk/h/klv2or3" }
        ]
      }
    }
  })
} 