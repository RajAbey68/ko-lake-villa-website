"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DollarSign, Save, RefreshCw, TrendingUp, Calendar, AlertCircle, 
  Check, ExternalLink, Edit, Clock, Users, Bed, Bath, Search, 
  CheckCircle, XCircle, Activity, Database
} from "lucide-react"

interface AccommodationPricing {
  id: string
  name: string
  airbnbPrice: number
  specialPrice: number
  savings: number
  lastUpdated: string
  airbnbLink: string
  guests: number
  bedrooms: number
  bathrooms: number
}

interface AirbnbLookup {
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

export default function AdminPricing() {
  const [pricing, setPricing] = useState<AccommodationPricing[]>([
    {
      id: "entire-villa",
      name: "Entire Villa Exclusive",
      airbnbPrice: 431,
      specialPrice: 366,
      savings: 65,
      lastUpdated: new Date().toISOString(),
      airbnbLink: "https://airbnb.co.uk/h/eklv",
      guests: 23,
      bedrooms: 7,
      bathrooms: 7
    },
    {
      id: "master-family-suite", 
      name: "Master Family Suite",
      airbnbPrice: 119,
      specialPrice: 101,
      savings: 18,
      lastUpdated: new Date().toISOString(),
      airbnbLink: "https://airbnb.co.uk/h/klv6",
      guests: 6,
      bedrooms: 2,
      bathrooms: 2
    },
    {
      id: "triple-twin-rooms",
      name: "Triple/Twin Rooms", 
      airbnbPrice: 70,
      specialPrice: 60,
      savings: 10,
      lastUpdated: new Date().toISOString(),
      airbnbLink: "https://airbnb.co.uk/h/klv2or3",
      guests: 3,
      bedrooms: 1,
      bathrooms: 1
    }
  ])

  // Simulated Airbnb lookup history (this would come from your actual logging system)
  const [lookupHistory, setLookupHistory] = useState<AirbnbLookup[]>([
    {
      id: "1",
      accommodation: "Entire Villa Exclusive",
      airbnbUrl: "https://airbnb.co.uk/h/eklv",
      timestamp: "2025-01-25T16:55:00Z",
      status: "success",
      originalPrice: 431,
      fetchedPrice: 431,
      discountedPrice: 366,
      responseTime: 2.3
    },
    {
      id: "2", 
      accommodation: "Master Family Suite",
      airbnbUrl: "https://airbnb.co.uk/h/klv6",
      timestamp: "2025-01-25T16:55:00Z",
      status: "failed",
      originalPrice: 119,
      errorMessage: "Rate limiting - Airbnb blocked request",
      responseTime: 5.1
    },
    {
      id: "3",
      accommodation: "Triple/Twin Rooms",
      airbnbUrl: "https://airbnb.co.uk/h/klv2or3", 
      timestamp: "2025-01-25T16:55:00Z",
      status: "success",
      originalPrice: 70,
      fetchedPrice: 70,
      discountedPrice: 60,
      responseTime: 1.8
    }
  ])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<number>(0)
  const [saveMessage, setSaveMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)

  const calculateDiscount = (airbnbPrice: number) => {
    const specialPrice = Math.round(airbnbPrice * 0.85)
    const savings = airbnbPrice - specialPrice
    return { specialPrice, savings }
  }

  const handlePriceUpdate = (id: string, newPrice: number) => {
    setIsSaving(true)
    const { specialPrice, savings } = calculateDiscount(newPrice)
    
    setPricing(prev => prev.map(room => 
      room.id === id 
        ? { 
            ...room, 
            airbnbPrice: newPrice,
            specialPrice,
            savings,
            lastUpdated: new Date().toISOString()
          }
        : room
    ))
    
    setEditingId(null)
    setSaveMessage(`Pricing updated for ${pricing.find(p => p.id === id)?.name}`)
    setTimeout(() => setSaveMessage(""), 3000)
    setIsSaving(false)
  }

  const handleAirbnbLookup = async () => {
    setIsLookingUp(true)
    setSaveMessage("Running Airbnb price lookups...")
    
    // Simulate API call to your Airbnb lookup service
    try {
      // This would call your actual Airbnb price sync API
      const response = await fetch('/api/admin/airbnb-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accommodations: pricing.map(p => ({ id: p.id, url: p.airbnbLink })) })
      })
      
      if (response.ok) {
        const results = await response.json()
        setSaveMessage("✅ Airbnb lookups completed successfully")
        // Update lookup history with real results
        setLookupHistory(prev => [...results.lookups, ...prev.slice(0, 10)]) // Keep last 10
      } else {
        setSaveMessage("❌ Airbnb lookup failed - check logs")
      }
    } catch (error) {
      setSaveMessage("❌ Network error during Airbnb lookup")
    }
    
    setTimeout(() => setSaveMessage(""), 5000)
    setIsLookingUp(false)
  }

  const getTotalRevenuePotential = () => {
    return pricing.reduce((sum, room) => sum + (room.airbnbPrice * 30), 0) // 30 days
  }

  const getDiscountRevenuePotential = () => {
    return pricing.reduce((sum, room) => sum + (room.specialPrice * 30), 0) // 30 days
  }

  const getSuccessfulLookups = () => {
    return lookupHistory.filter(l => l.status === 'success').length
  }

  const getAverageResponseTime = () => {
    const successful = lookupHistory.filter(l => l.status === 'success' && l.responseTime)
    if (successful.length === 0) return 0
    return successful.reduce((sum, l) => sum + (l.responseTime || 0), 0) / successful.length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-800">Accommodation Pricing</h1>
        <p className="mt-2 text-gray-600">
          Manage Airbnb pricing and direct booking discounts
        </p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {saveMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Airbnb Revenue (30 days)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{getTotalRevenuePotential().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              If all rooms booked at Airbnb rates
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Booking Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{getDiscountRevenuePotential().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              With 15% direct booking discount
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings Offer</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              £{(getTotalRevenuePotential() - getDiscountRevenuePotential()).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total discount given to guests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AIRBNB LOOKUP MONITORING WINDOW */}
      <Card className="mb-8 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Search className="h-5 w-5 text-blue-600" />
                <span>Airbnb Lookup Monitoring</span>
              </CardTitle>
              <CardDescription>
                Real-time monitoring of Airbnb price fetching and discount calculations
              </CardDescription>
            </div>
            <Button 
              onClick={handleAirbnbLookup} 
              disabled={isLookingUp}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLookingUp ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Airbnb Lookup
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Lookup Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Successful Lookups</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{getSuccessfulLookups()}/{lookupHistory.length}</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Avg Response Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{getAverageResponseTime().toFixed(1)}s</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Last Lookup</span>
              </div>
              <div className="text-sm font-bold text-purple-600">
                {lookupHistory[0] ? new Date(lookupHistory[0].timestamp).toLocaleTimeString() : 'Never'}
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Total Discounts</span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                £{lookupHistory.filter(l => l.status === 'success').reduce((sum, l) => sum + ((l.fetchedPrice || 0) - (l.discountedPrice || 0)), 0)}
              </div>
            </div>
          </div>

          {/* Lookup History Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Accommodation</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Status</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Airbnb Price</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Our Price</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Discount</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Time</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Response</th>
                </tr>
              </thead>
              <tbody>
                {lookupHistory.slice(0, 10).map((lookup) => (
                  <tr key={lookup.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="font-medium">{lookup.accommodation}</div>
                      <div className="text-xs text-gray-500 truncate max-w-40">{lookup.airbnbUrl}</div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {lookup.status === 'success' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      ) : lookup.status === 'failed' ? (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">
                      {lookup.fetchedPrice ? `£${lookup.fetchedPrice}` : '-'}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-green-600">
                      {lookup.discountedPrice ? `£${lookup.discountedPrice}` : '-'}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {lookup.fetchedPrice && lookup.discountedPrice ? (
                        <span className="text-red-600 font-medium">
                          -£{lookup.fetchedPrice - lookup.discountedPrice}
                        </span>
                      ) : lookup.errorMessage ? (
                        <span className="text-xs text-red-600">{lookup.errorMessage}</span>
                      ) : '-'}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-xs">
                      {new Date(lookup.timestamp).toLocaleString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-xs">
                      {lookup.responseTime ? `${lookup.responseTime}s` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Manual Price Updates Required</h3>
              <p className="text-sm text-amber-700 mt-1">
                Airbnb prices change frequently. Check Airbnb listings regularly and update prices here. 
                The 15% direct booking discount is calculated automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accommodation Pricing Cards */}
      <div className="space-y-6">
        {pricing.map((room) => (
          <Card key={room.id} className="border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {room.guests} guests
                    </span>
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {room.bedrooms} bedrooms
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {room.bathrooms} bathrooms
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center space-x-1"
                >
                  <a href={room.airbnbLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Airbnb</span>
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Airbnb Price */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Airbnb Price</Label>
                  {editingId === room.id ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(Number(e.target.value))}
                        className="text-lg font-bold"
                        placeholder="Enter new price"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handlePriceUpdate(room.id, tempPrice)}
                          disabled={isSaving}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">£{room.airbnbPrice}/night</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(room.id)
                          setTempPrice(room.airbnbPrice)
                        }}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Update Price</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Direct Booking Price */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Direct Booking Price (15% off)</Label>
                  <div className="text-2xl font-bold text-green-600">£{room.specialPrice}/night</div>
                  <Badge className="bg-green-100 text-green-800">
                    Save £{room.savings}/night
                  </Badge>
                </div>

                {/* Last Updated */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(room.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(room.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card className="mt-8 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-800 mb-3">Next Steps for Live Pricing</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>Option 1:</strong> Apply for Airbnb Partner API access for automatic price syncing</p>
            <p>• <strong>Option 2:</strong> Set up a daily/weekly price check routine</p>
            <p>• <strong>Option 3:</strong> Implement price monitoring alerts when Airbnb rates change</p>
            <p>• <strong>Current:</strong> Manual updates via this admin panel</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 