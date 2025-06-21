import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';

interface DealPricing {
  room: string;
  roomName: string;
  airbnbPrice: number;
  earlyBirdPrice: number;
  lateDealPrice: number;
  standardPrice: number;
  earlyBirdSavings: number;
  lateDealSavings: number;
}

export default function Deals() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [dealPricing, setDealPricing] = useState<DealPricing[]>([]);
  const [currentDealType, setCurrentDealType] = useState<'early-bird' | 'late-deal' | 'standard'>('standard');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const roomTypes = [
    { id: 'KNP', name: 'Entire Villa Exclusive', airbnbPrice: 431, maxGuests: 12 },
    { id: 'KNP1', name: 'Master Family Suite', airbnbPrice: 119, maxGuests: 4 },
    { id: 'KNP3', name: 'Triple/Twin Rooms', airbnbPrice: 70, maxGuests: 3 },
    { id: 'KNP6', name: 'Group Room', airbnbPrice: 250, maxGuests: 6 }
  ];

  // Calculate deal type based on selected date
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      const daysUntilCheckIn = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilCheckIn >= 30) {
        setCurrentDealType('early-bird');
      } else if (daysUntilCheckIn <= 3) {
        setCurrentDealType('late-deal');
      } else {
        setCurrentDealType('standard');
      }
    }
  }, [selectedDate]);

  // Calculate pricing for all rooms
  useEffect(() => {
    const pricing = roomTypes.map(room => {
      const standardPrice = Math.round(room.airbnbPrice * 0.9); // 10% off Airbnb
      const earlyBirdPrice = Math.round(room.airbnbPrice * 0.85); // 15% off Airbnb
      const lateDealPrice = Math.round(room.airbnbPrice * 0.8); // 20% off Airbnb

      return {
        room: room.id,
        roomName: room.name,
        airbnbPrice: room.airbnbPrice,
        standardPrice,
        earlyBirdPrice,
        lateDealPrice,
        earlyBirdSavings: room.airbnbPrice - earlyBirdPrice,
        lateDealSavings: room.airbnbPrice - lateDealPrice
      };
    });

    setDealPricing(pricing);
  }, []);

  const getCurrentPrice = (pricing: DealPricing) => {
    switch (currentDealType) {
      case 'early-bird': return pricing.earlyBirdPrice;
      case 'late-deal': return pricing.lateDealPrice;
      default: return pricing.standardPrice;
    }
  };

  const getCurrentSavings = (pricing: DealPricing) => {
    return pricing.airbnbPrice - getCurrentPrice(pricing);
  };

  const getDealBadge = () => {
    switch (currentDealType) {
      case 'early-bird': return { text: '15% OFF', color: 'bg-green-600' };
      case 'late-deal': return { text: '20% OFF', color: 'bg-orange-600' };
      default: return { text: '10% OFF', color: 'bg-blue-600' };
    }
  };

  const handleBookNow = (roomId: string) => {
    setSelectedRoom(roomId);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#8B5E3C] mb-4">
            Exclusive Deals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book direct and save with our special offers at Ko Lake Villa
          </p>
        </div>

        {/* Deal Calculator */}
        <Card className="max-w-4xl mx-auto mb-12 border-2 border-[#FF914D]">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-[#8B5E3C]">
              Check Your Deal Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Check-in Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Number of Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  />
                </div>

                <Alert className={`${currentDealType === 'early-bird' ? 'border-green-500 bg-green-50' : 
                  currentDealType === 'late-deal' ? 'border-orange-500 bg-orange-50' : 
                  'border-blue-500 bg-blue-50'}`}>
                  <AlertDescription className="text-center">
                    <Badge className={`${getDealBadge().color} text-white mb-2`}>
                      {getDealBadge().text}
                    </Badge>
                    <br/>
                    <strong>
                      {currentDealType === 'early-bird' && 'Early Bird Deal Active!'}
                      {currentDealType === 'late-deal' && 'Late Deal Special!'}
                      {currentDealType === 'standard' && 'Direct Booking Discount!'}
                    </strong>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#8B5E3C]">Available Rates</h3>
                {dealPricing.map(pricing => (
                  <div key={pricing.room} className="p-3 border rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{pricing.roomName}</span>
                      <Badge className={getDealBadge().color}>
                        ${getCurrentPrice(pricing)}/night
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="line-through">${pricing.airbnbPrice}</span>
                      <span className="text-green-600 ml-2">
                        Save ${getCurrentSavings(pricing)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Deals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {dealPricing.map(pricing => (
            <Card key={pricing.room} className="border-2 border-gray-200 hover:border-[#FF914D] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#8B5E3C]">{pricing.roomName}</CardTitle>
                  <Badge className={getDealBadge().color}>
                    {getDealBadge().text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF914D]">
                    ${getCurrentPrice(pricing)}
                  </div>
                  <div className="text-sm text-gray-500">per night</div>
                  <div className="text-sm">
                    <span className="line-through text-gray-400">${pricing.airbnbPrice}</span>
                    <span className="text-green-600 ml-2 font-semibold">
                      Save ${getCurrentSavings(pricing)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div>✓ Direct booking discount</div>
                  <div>✓ Free cancellation</div>
                  <div>✓ Best rate guarantee</div>
                  <div>✓ Instant confirmation</div>
                </div>

                <Button 
                  className="w-full bg-[#FF914D] hover:bg-[#FF914D]/90"
                  onClick={() => handleBookNow(pricing.room)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deal Information */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl text-green-800 text-center">Early Bird Deals</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Badge className="bg-green-600 text-white text-lg">15% OFF</Badge>
              <p className="text-green-700">
                Book 30+ days in advance for maximum savings
              </p>
              <div className="text-sm text-green-600">
                ✓ Biggest advance savings<br/>
                ✓ Guaranteed best rates<br/>
                ✓ Priority room selection
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-xl text-orange-800 text-center">Late Deals</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Badge className="bg-orange-600 text-white text-lg">20% OFF</Badge>
              <p className="text-orange-700">
                Last-minute bookings (≤3 days) get our biggest discount
              </p>
              <div className="text-sm text-orange-600">
                ✓ Maximum last-minute savings<br/>
                ✓ Subject to availability<br/>
                ✓ Instant booking
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800 text-center">Standard Direct</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Badge className="bg-blue-600 text-white text-lg">10% OFF</Badge>
              <p className="text-blue-700">
                Always save 10% off Airbnb prices when booking direct
              </p>
              <div className="text-sm text-blue-600">
                ✓ Consistent savings<br/>
                ✓ No booking fees<br/>
                ✓ Direct communication
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {showBookingModal && (
        <BookingModal
          roomName={dealPricing.find(p => p.room === selectedRoom)?.roomName || 'Room'}
          basePrice={dealPricing.find(p => p.room === selectedRoom) ? getCurrentPrice(dealPricing.find(p => p.room === selectedRoom)!) : 0}
          onClose={() => setShowBookingModal(false)}
          onBook={(bookingData) => {
            console.log('Booking data:', bookingData);
            // Handle booking logic here
            alert(`Booking confirmed for ${bookingData.roomName}! Total: $${bookingData.amount}`);
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
}