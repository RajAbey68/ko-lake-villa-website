import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Phone, Mail, MessageCircle } from 'lucide-react';

interface BookingModalProps {
  roomName: string;
  basePrice: number;
  onClose: () => void;
  onBook: (bookingData: any) => void;
}

export default function BookingModal({ roomName, basePrice, onClose, onBook }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  
  const [checkOut, setCheckOut] = useState(() => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    return dayAfter.toISOString().split('T')[0];
  });
  
  const [guests, setGuests] = useState(2);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const calculateNights = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const safeBasePrice = basePrice || 0;
  const totalAmount = safeBasePrice * nights;

  // Generate suggested available dates (sample dates)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Sample availability pattern - skip some dates to simulate real availability
      if (i % 5 !== 0) { // Skip every 5th day as "unavailable"
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }
    return dates.slice(0, 10); // Show next 10 available dates
  };

  const handleBookNow = () => {
    // Simulate availability check
    const isAvailable = Math.random() > 0.3; // 70% chance of availability for demo
    
    if (!isAvailable) {
      setShowAlternatives(true);
      return;
    }

    const bookingData = {
      roomName,
      checkIn,
      checkOut,
      guests,
      amount: totalAmount,
      nights
    };
    
    onBook(bookingData);
  };

  const handleValidateCard = () => {
    // Simulate availability check
    const isAvailable = Math.random() > 0.3; // 70% chance of availability for demo
    
    if (!isAvailable) {
      setShowAlternatives(true);
      return;
    }

    const bookingData = {
      roomName,
      checkIn,
      checkOut,
      guests,
      amount: totalAmount,
      nights
    };
    
    // Store booking data and navigate to card validation
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = '/card-validation';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#E8B87D]" />
              Book
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </CardTitle>
          <CardDescription className="text-lg font-medium text-[#8B5E3C]">
            {roomName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Check-in</Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="guests">Guests</Label>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="25"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="bg-[#E8B87D]/10 border border-[#E8B87D]/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Rate per night:</span>
              <span className="font-semibold text-[#8B5E3C]">${safeBasePrice}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Nights:</span>
              <span className="font-semibold text-[#8B5E3C]">{nights}</span>
            </div>
            <hr className="my-3 border-[#E8B87D]/30" />
            <div className="flex items-center justify-between text-xl font-bold text-[#8B5E3C]">
              <span>Total:</span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-5 h-5" />
                {totalAmount}
              </span>
            </div>
          </div>

          {!showAlternatives ? (
            <div className="space-y-4 pt-2">
              {/* Payment Options */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3">Choose Your Booking Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Card Validation Option */}
                  <div className="border-2 border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Recommended</span>
                    </div>
                    <h5 className="font-semibold text-green-800 mb-1">Validate Card (No Charge)</h5>
                    <p className="text-sm text-green-700 mb-3">
                      Secure your booking by validating your payment method. No charge today - payment collected per our terms.
                    </p>
                    <Button 
                      onClick={() => handleValidateCard()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                      size="sm"
                    >
                      Validate Card & Book
                    </Button>
                  </div>

                  {/* Immediate Payment Option */}
                  <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium text-orange-800">Pay Now</span>
                    </div>
                    <h5 className="font-semibold text-orange-800 mb-1">Immediate Payment</h5>
                    <p className="text-sm text-orange-700 mb-3">
                      Pay the full amount now to complete your booking immediately.
                    </p>
                    <Button 
                      onClick={handleBookNow}
                      className="w-full bg-[#FF914D] hover:bg-[#FF914D]/90 text-white text-sm"
                      size="sm"
                    >
                      Pay ${totalAmount} Now
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Dates Not Available</h4>
                <p className="text-sm text-red-700">
                  Sorry, {roomName} is not available for your selected dates. Please try one of these alternatives:
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Available Dates This Month:</h4>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {getAvailableDates().map((dateOption, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCheckIn(dateOption.date);
                        const checkOutDate = new Date(dateOption.date);
                        checkOutDate.setDate(checkOutDate.getDate() + 2);
                        setCheckOut(checkOutDate.toISOString().split('T')[0]);
                        setShowAlternatives(false);
                      }}
                      className="text-left p-2 text-sm border border-gray-200 rounded hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                      {dateOption.display}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Need Help Finding Dates?
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Phone className="w-4 h-4" />
                    <span>Call us: +94 071 173 0345</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: +94 071 173 0345</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span>Email: info@kolakevilla.lk</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAlternatives(false)}
                  className="flex-1"
                >
                  Try Different Dates
                </Button>
                <Button onClick={onClose} className="flex-1 bg-[#1E4E5F] hover:bg-[#E8B87D]">
                  Contact Us
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}