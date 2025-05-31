import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface PricingData {
  updated: string;
  rates: {
    [roomId: string]: {
      sun: number;
      mon: number;
      tue: number;
    };
  };
  overrides?: {
    [roomId: string]: {
      customPrice: number;
      setDate: string;
      autoPrice: number;
    };
  };
}

export default function AdminCalendar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  // Fetch current pricing data
  const { data: pricing, isLoading } = useQuery<PricingData>({
    queryKey: ['/api/admin/pricing'],
  });

  // Handle saving custom price
  const handleSavePrice = (roomId: string, autoDirectRate: number) => {
    const customPrice = parseFloat(editPrice);
    if (!customPrice || customPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than $0.",
        variant: "destructive",
      });
      return;
    }

    // Store locally for now (in production this would go to your database)
    const currentOverrides = pricing?.overrides || {};
    const newOverrides = {
      ...currentOverrides,
      [roomId]: {
        customPrice: customPrice,
        setDate: new Date().toISOString(),
        autoPrice: autoDirectRate
      }
    };

    // Update the query cache with new override
    queryClient.setQueryData(['/api/admin/pricing'], (oldData: PricingData | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        overrides: newOverrides
      };
    });

    setEditingRoom(null);
    setEditPrice('');
    
    toast({
      title: "Price Updated",
      description: `Custom price set for ${roomId.toUpperCase()}: $${customPrice}. Will revert to pre-agreed rate ($${autoDirectRate}) next Sunday.`,
    });
  };

  // Refresh pricing mutation
  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/refresh-pricing'),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing'] });
      
      if (data?.autoReverted) {
        toast({
          title: "Sunday Auto-Revert",
          description: "All custom prices have been reset to pre-agreed rates as scheduled.",
        });
      } else {
        toast({
          title: "Pricing Refreshed",
          description: `Next auto-revert: ${data?.nextRevertDate || 'Next Sunday'}`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Could not update pricing. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    document.title = "Pricing Calendar - Ko Lake Villa Admin";
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#1E4E5F] text-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/admin">
                <button className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Dashboard
                </button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold mb-2">📅 Ko Lake Villa – Airbnb Price Calendar</h1>
            <p className="text-blue-100">Monitor and update your baseline pricing strategy</p>
          </div>

          <div className="p-6">
            {/* Refresh Button */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Last updated: {pricing ? new Date(pricing.updated).toLocaleString() : 'Never'}
                </p>
              </div>
              <button
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
                className="bg-[#E8B87D] text-white px-6 py-2 rounded hover:bg-[#1E4E5F] transition-colors font-medium disabled:opacity-50"
              >
                {refreshMutation.isPending ? '⏳ Refreshing...' : '🔁 Refresh Airbnb Pricing'}
              </button>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Room</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Sunday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Monday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Tuesday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Your Direct Rate</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing && Object.entries(pricing.rates).map(([roomId, days]) => {
                    const avgRate = Math.round((days.sun + days.mon + days.tue) / 3);
                    const autoDirectRate = Math.round(avgRate * 0.9); // 10% discount
                    
                    // Check if there's a custom override
                    const override = pricing.overrides?.[roomId];
                    const displayRate = override ? override.customPrice : autoDirectRate;
                    const isCustom = !!override;
                    
                    return (
                      <tr key={roomId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {roomId.toUpperCase()}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${days.sun}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${days.mon}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${days.tue}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {editingRoom === roomId ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-20 px-2 py-1 border rounded text-center"
                                placeholder={displayRate.toString()}
                                min="1"
                                max={Math.round(avgRate * 0.95)}
                              />
                              <button
                                onClick={() => handleSavePrice(roomId, autoDirectRate)}
                                className="bg-green-600 text-white hover:bg-green-800 px-3 py-1 rounded text-sm font-bold"
                                title="Save"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRoom(null);
                                  setEditPrice('');
                                }}
                                className="bg-red-600 text-white hover:bg-red-800 px-3 py-1 rounded text-sm font-bold"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <span className={`font-bold ${isCustom ? 'text-blue-600' : 'text-green-600'}`}>
                                ${displayRate}
                              </span>
                              {isCustom && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                  Custom
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {editingRoom === roomId ? null : (
                            <button
                              onClick={() => {
                                setEditingRoom(roomId);
                                setEditPrice(displayRate.toString());
                              }}
                              className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                              title="Edit price"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Strategy Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Pricing Strategy</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Uses Sunday-Tuesday rates as baseline (most stable pricing)</li>
                <li>• Direct booking rate = 10% below Airbnb average</li>
                <li>• Last-minute bookings (≤3 days) get 15% discount</li>
                <li>• Updates can be refreshed manually or scheduled weekly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';

interface Booking {
  id: string;
  room: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  originalPrice: number;
  discountedPrice?: number;
  dealType?: 'early-bird' | 'late-deal';
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface DealConfig {
  earlyBirdDays: number;
  earlyBirdDiscount: number;
  lateDealDays: number;
  lateDealDiscount: number;
  baseDiscountPercent: number;
}

export default function AdminCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dealConfig, setDealConfig] = useState<DealConfig>({
    earlyBirdDays: 30,
    earlyBirdDiscount: 15,
    lateDealDays: 3,
    lateDealDiscount: 20,
    baseDiscountPercent: 10
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchDealConfig();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/admin/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDealConfig = async () => {
    try {
      const response = await fetch('/admin/deal-config');
      const config = await response.json();
      setDealConfig(config);
    } catch (error) {
      console.error('Failed to fetch deal config:', error);
    }
  };

  const updateDealConfig = async () => {
    try {
      await fetch('/admin/deal-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealConfig)
      });
      alert('Deal configuration updated successfully!');
    } catch (error) {
      console.error('Failed to update deal config:', error);
      alert('Failed to update configuration');
    }
  };

  const calculateDealPrice = (originalPrice: number, checkInDate: string): { price: number; dealType?: string } => {
    const today = new Date();
    const checkin = new Date(checkInDate);
    const daysToCheckin = Math.ceil((checkin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let discount = dealConfig.baseDiscountPercent;
    let dealType = '';

    if (daysToCheckin >= dealConfig.earlyBirdDays) {
      discount = dealConfig.earlyBirdDiscount;
      dealType = 'early-bird';
    } else if (daysToCheckin <= dealConfig.lateDealDays) {
      discount = dealConfig.lateDealDiscount;
      dealType = 'late-deal';
    }

    const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
    return { price: discountedPrice, dealType };
  };

  const getDealBadge = (booking: Booking) => {
    const deal = calculateDealPrice(booking.originalPrice, booking.checkIn);
    
    if (deal.dealType === 'early-bird') {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Early Bird {dealConfig.earlyBirdDiscount}% Off</Badge>;
    } else if (deal.dealType === 'late-deal') {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Last Minute {dealConfig.lateDealDiscount}% Off</Badge>;
    } else {
      return <Badge variant="outline">Direct Booking {dealConfig.baseDiscountPercent}% Off</Badge>;
    }
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking Calendar & Deals</h1>
      </div>

      {/* Deal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Deal Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="earlyBirdDays">Early Bird (Days)</Label>
            <Input
              id="earlyBirdDays"
              type="number"
              value={dealConfig.earlyBirdDays}
              onChange={(e) => setDealConfig({...dealConfig, earlyBirdDays: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="earlyBirdDiscount">Early Bird Discount (%)</Label>
            <Input
              id="earlyBirdDiscount"
              type="number"
              value={dealConfig.earlyBirdDiscount}
              onChange={(e) => setDealConfig({...dealConfig, earlyBirdDiscount: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="lateDealDays">Late Deal (Days)</Label>
            <Input
              id="lateDealDays"
              type="number"
              value={dealConfig.lateDealDays}
              onChange={(e) => setDealConfig({...dealConfig, lateDealDays: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="lateDealDiscount">Late Deal Discount (%)</Label>
            <Input
              id="lateDealDiscount"
              type="number"
              value={dealConfig.lateDealDiscount}
              onChange={(e) => setDealConfig({...dealConfig, lateDealDiscount: parseInt(e.target.value)})}
            />
          </div>
          <div className="col-span-2 md:col-span-4">
            <Button onClick={updateDealConfig} className="w-full">
              Update Deal Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Current Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => {
              const deal = calculateDealPrice(booking.originalPrice, booking.checkIn);
              const savings = booking.originalPrice - deal.price;
              
              return (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{booking.guestName}</h3>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        {getDealBadge(booking)}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {booking.guests} guests
                        </span>
                        <span className="font-medium">{booking.room}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${deal.price}
                      </div>
                      {savings > 0 && (
                        <div className="text-sm text-gray-500">
                          <span className="line-through">${booking.originalPrice}</span>
                          <span className="text-green-600 ml-1">Save ${savings}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
