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
  Check, ExternalLink, Edit, Clock, Users, Bed, Bath
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
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<number>(0)
  const [saveMessage, setSaveMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

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

  const getTotalRevenuePotential = () => {
    return pricing.reduce((sum, room) => sum + (room.airbnbPrice * 30), 0) // 30 days
  }

  const getDiscountRevenuePotential = () => {
    return pricing.reduce((sum, room) => sum + (room.specialPrice * 30), 0) // 30 days
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