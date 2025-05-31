import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, TagIcon } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validTo: string;
  conditions: string[];
  category: 'late' | 'early-bird';
  roomTypes: string[];
}

export default function Deals() {
  const [deals] = useState<Deal[]>([
    {
      id: '1',
      title: 'Last Minute Lake Escape',
      description: 'Book within 48 hours for stays in the next 2 weeks and save 15%',
      discount: 15,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      conditions: ['Valid for stays within 14 days', 'Subject to availability', 'Non-refundable'],
      category: 'late',
      roomTypes: ['Triple Room', 'Family Suite']
    },
    {
      id: '2',
      title: 'Early Bird Villa Booking',
      description: 'Reserve your villa stay 12+ weeks in advance and enjoy 20% off',
      discount: 20,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      conditions: ['Book 84+ days in advance', 'Minimum 3-night stay', 'Flexible cancellation'],
      category: 'early-bird',
      roomTypes: ['Entire Villa', 'Family Suite']
    },
    {
      id: '3',
      title: 'Extended Stay Discount',
      description: 'Stay 7+ nights and receive progressive discounts up to 25%',
      discount: 25,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      conditions: ['7+ nights: 15% off', '14+ nights: 20% off', '21+ nights: 25% off'],
      category: 'late',
      roomTypes: ['Entire Villa', 'Family Suite', 'Group Room']
    }
  ]);

  const lateDeals = deals.filter(deal => deal.category === 'late');
  const earlyBirdDeals = deals.filter(deal => deal.category === 'early-bird');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#8B5E3C] mb-6">
            Exclusive Deals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover special offers for your Ko Lake Villa experience. 
            From last-minute escapes to early bird savings.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Late Deals Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ClockIcon className="h-8 w-8 text-[#FF914D]" />
            <h2 className="text-3xl font-bold text-[#8B5E3C]">🔥 Late Deals</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Book now for a stay within the next 2 weeks and enjoy immediate savings.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lateDeals.map(deal => (
              <Card key={deal.id} className="border-2 border-[#FF914D]/20 hover:border-[#FF914D] transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[#8B5E3C]">{deal.title}</CardTitle>
                    <Badge className="bg-[#FF914D] text-white text-lg px-3 py-1">
                      {deal.discount}% OFF
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{deal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Valid until {formatDate(deal.validTo)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <TagIcon className="h-4 w-4" />
                      <span>{deal.roomTypes.join(', ')}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-medium text-[#8B5E3C] mb-2">Conditions:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {deal.conditions.map((condition, index) => (
                        <li key={index}>• {condition}</li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-[#FF914D] hover:bg-[#8B5E3C]">
                    Book This Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Early Bird Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <CalendarIcon className="h-8 w-8 text-[#A0B985]" />
            <h2 className="text-3xl font-bold text-[#8B5E3C]">🕊️ Early Bird Offers</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Reserve now for stays 12+ weeks ahead and save with our advance booking discounts.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earlyBirdDeals.map(deal => (
              <Card key={deal.id} className="border-2 border-[#A0B985]/20 hover:border-[#A0B985] transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[#8B5E3C]">{deal.title}</CardTitle>
                    <Badge className="bg-[#A0B985] text-white text-lg px-3 py-1">
                      {deal.discount}% OFF
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{deal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Valid until {formatDate(deal.validTo)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <TagIcon className="h-4 w-4" />
                      <span>{deal.roomTypes.join(', ')}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-medium text-[#8B5E3C] mb-2">Conditions:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {deal.conditions.map((condition, index) => (
                        <li key={index}>• {condition}</li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-[#A0B985] hover:bg-[#8B5E3C]">
                    Reserve Early
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-16 text-center bg-[#8B5E3C]/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[#8B5E3C] mb-4">
            Need a Custom Deal?
          </h3>
          <p className="text-gray-600 mb-6">
            Planning a special celebration or extended stay? Contact us for personalized pricing.
          </p>
          <Button className="bg-[#8B5E3C] hover:bg-[#FF914D]">
            Contact Us
          </Button>
        </section>
      </div>
    </div>
  );
}