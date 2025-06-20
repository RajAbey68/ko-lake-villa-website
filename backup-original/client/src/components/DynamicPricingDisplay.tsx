import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Percent, Star, Info } from 'lucide-react';
import { pricingEngine, calculateBookingPrice, PRICING_LOGIC } from '@/lib/dynamicPricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DynamicPricingDisplayProps {
  checkIn: Date | null;
  checkOut: Date | null;
  roomType: 'villa' | 'suite' | 'room';
  basePrice: number;
  roomName: string;
  onBookingClick?: () => void;
}

export function DynamicPricingDisplay({
  checkIn,
  checkOut,
  roomType,
  basePrice,
  roomName,
  onBookingClick
}: DynamicPricingDisplayProps) {
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkIn && checkOut) {
      calculatePricing();
    } else {
      setPricingResult(null);
      setEligibility(null);
    }
  }, [checkIn, checkOut, roomType, basePrice]);

  const calculatePricing = async () => {
    if (!checkIn || !checkOut) return;
    
    setLoading(true);
    try {
      const [pricing, eligibilityCheck] = await Promise.all([
        calculateBookingPrice(checkIn, checkOut, roomType, basePrice),
        pricingEngine.checkOfferEligibility(checkIn, checkOut, roomType)
      ]);
      
      setPricingResult(pricing);
      setEligibility(eligibilityCheck);
    } catch (error) {
      console.error('Pricing calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!checkIn || !checkOut) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Dates for Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Choose your check-in and check-out dates to see available offers and final pricing.</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Percent className="h-4 w-4" />
              <span>Next 3 Weekdays Special: 15% off (min 2 nights)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Star className="h-4 w-4" />
              <span>3+ Night Midweek Bonus: Additional 5% off</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pricingResult) return null;

  const hasDiscount = pricingResult.offerApplied.length > 0;
  const savingsAmount = pricingResult.totalDiscount;
  const savingsPercentage = pricingResult.discountPercentage;

  return (
    <div className="space-y-4">
      {/* Special Offers Banner */}
      {hasDiscount && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-green-600" />
              <span className="font-bold text-green-800">Special Offers Applied!</span>
            </div>
            {pricingResult.offerApplied.map((offer: string, index: number) => (
              <Badge key={index} variant="secondary" className="mr-2 mb-2 bg-green-100 text-green-800">
                {offer}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {eligibility?.recommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Maximize Your Savings</span>
            </div>
            {eligibility.recommendations.map((rec: string, index: number) => (
              <p key={index} className="text-sm text-blue-700 mb-1">{rec}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{roomName} - {pricingResult.nights} Night{pricingResult.nights > 1 ? 's' : ''}</span>
            {hasDiscount && (
              <Badge className="bg-red-100 text-red-800">
                Save ${savingsAmount.toFixed(2)} ({savingsPercentage.toFixed(0)}% off)
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Price Summary */}
          <div className="space-y-3 mb-6">
            {hasDiscount && (
              <div className="flex justify-between items-center text-gray-500">
                <span>Original Total:</span>
                <span className="line-through">${pricingResult.originalPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-2xl font-bold text-green-600">
              <span>Total Price:</span>
              <span>${pricingResult.discountedPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Average per night:</span>
              <span>${(pricingResult.discountedPrice / pricingResult.nights).toFixed(2)}</span>
            </div>
          </div>

          {/* Night-by-Night Breakdown */}
          <div className="space-y-2 mb-6">
            <h4 className="font-medium text-gray-700">Nightly Breakdown:</h4>
            {pricingResult.breakdown.map((night: any, index: number) => (
              <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-100">
                <div>
                  <span className="font-medium">Night {night.night}</span>
                  <span className="text-gray-500 ml-2">
                    ({night.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
                  </span>
                </div>
                <div className="text-right">
                  {night.discounts.length > 0 && (
                    <div className="text-xs text-green-600 mb-1">
                      {night.discounts.join(', ')}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {night.basePrice !== night.discountedPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        ${night.basePrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-medium">
                      ${night.discountedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book Now Button */}
          {onBookingClick && (
            <Button 
              onClick={onBookingClick}
              className="w-full bg-[#8B5E3C] hover:bg-[#7A5232] text-white"
              size="lg"
            >
              Book Now - Direct Booking Saves More
            </Button>
          )}

          {/* Pricing Logic Explanation */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">How Our Pricing Works:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Next 3 Weekdays Offer:</strong> {PRICING_LOGIC.availabilityOffer.discount} when available for next 3 weekdays (minimum 2 nights, weekdays only)
              </div>
              <div>
                <strong>3+ Night Midweek Bonus:</strong> {PRICING_LOGIC.midweekBonus.discount} for stays of 3+ nights without weekend overlap
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Weekdays = Monday through Thursday. Weekend rates apply for Friday-Saturday stays.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DynamicPricingDisplay;