
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    room: string;
    dealType?: 'early-bird' | 'late-deal' | 'standard';
    discount?: number;
    originalPrice: number;
    finalPrice: number;
    guestCount: number;
    status: 'confirmed' | 'pending' | 'cancelled';
  };
}

interface DealConfig {
  earlyBirdDays: number;
  earlyBirdDiscount: number;
  lateDealDays: number;
  lateDealDiscount: number;
  baseDiscountPercent: number;
}

export default function AdminBookingCalendar() {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [showDealConfig, setShowDealConfig] = useState(false);
  const [dealConfig, setDealConfig] = useState<DealConfig>({
    earlyBirdDays: 30,
    earlyBirdDiscount: 15,
    lateDealDays: 3,
    lateDealDiscount: 20,
    baseDiscountPercent: 10
  });

  const roomTypes = [
    { id: 'KNP', name: 'Entire Villa Exclusive', airbnbPrice: 431 },
    { id: 'KNP1', name: 'Master Family Suite', airbnbPrice: 119 },
    { id: 'KNP3', name: 'Triple/Twin Rooms', airbnbPrice: 70 },
    { id: 'KNP6', name: 'Group Room', airbnbPrice: 250 }
  ];

  // Calculate deal pricing
  const calculateDealPrice = (roomId: string, checkInDate: Date, originalPrice: number) => {
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let dealType: 'early-bird' | 'late-deal' | 'standard' = 'standard';
    let discount = dealConfig.baseDiscountPercent;

    if (daysUntilCheckIn >= dealConfig.earlyBirdDays) {
      dealType = 'early-bird';
      discount = dealConfig.earlyBirdDiscount;
    } else if (daysUntilCheckIn <= dealConfig.lateDealDays) {
      dealType = 'late-deal';
      discount = dealConfig.lateDealDiscount;
    }

    const finalPrice = Math.round(originalPrice * (1 - discount / 100));
    
    return {
      dealType,
      discount,
      finalPrice,
      savings: originalPrice - finalPrice
    };
  };

  // Load bookings
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      if (response.ok) {
        const bookings = await response.json();
        const calendarEvents = bookings.map((booking: any) => ({
          id: booking.id,
          title: `${booking.room} - ${booking.guestName}`,
          start: new Date(booking.checkIn),
          end: new Date(booking.checkOut),
          resource: {
            room: booking.room,
            ...calculateDealPrice(booking.room, new Date(booking.checkIn), booking.originalPrice),
            originalPrice: booking.originalPrice,
            guestCount: booking.guests,
            status: booking.status
          }
        }));
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const eventStyleGetter = (event: BookingEvent) => {
    const { dealType, status } = event.resource;
    
    let backgroundColor = '#3174ad';
    if (dealType === 'early-bird') backgroundColor = '#10b981';
    else if (dealType === 'late-deal') backgroundColor = '#f59e0b';
    else if (dealType === 'standard') backgroundColor = '#6366f1';
    
    if (status === 'cancelled') backgroundColor = '#ef4444';
    else if (status === 'pending') backgroundColor = '#8b5cf6';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: status === 'cancelled' ? 0.6 : 1,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const saveDealConfig = async () => {
    try {
      const response = await fetch('/api/admin/deal-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealConfig)
      });
      
      if (response.ok) {
        alert('Deal configuration saved successfully!');
        setShowDealConfig(false);
        loadBookings(); // Refresh to apply new pricing
      }
    } catch (error) {
      console.error('Failed to save deal config:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#8B5E3C]">Booking Calendar & Deals Management</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowDealConfig(!showDealConfig)} variant="outline">
            Configure Deals
          </Button>
          <Button onClick={loadBookings}>Refresh Bookings</Button>
        </div>
      </div>

      {showDealConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Deal Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Early Bird Days</Label>
                <Input
                  type="number"
                  value={dealConfig.earlyBirdDays}
                  onChange={(e) => setDealConfig(prev => ({
                    ...prev,
                    earlyBirdDays: parseInt(e.target.value) || 30
                  }))}
                />
              </div>
              <div>
                <Label>Early Bird Discount (%)</Label>
                <Input
                  type="number"
                  value={dealConfig.earlyBirdDiscount}
                  onChange={(e) => setDealConfig(prev => ({
                    ...prev,
                    earlyBirdDiscount: parseInt(e.target.value) || 15
                  }))}
                />
              </div>
              <div>
                <Label>Late Deal Days</Label>
                <Input
                  type="number"
                  value={dealConfig.lateDealDays}
                  onChange={(e) => setDealConfig(prev => ({
                    ...prev,
                    lateDealDays: parseInt(e.target.value) || 3
                  }))}
                />
              </div>
              <div>
                <Label>Late Deal Discount (%)</Label>
                <Input
                  type="number"
                  value={dealConfig.lateDealDiscount}
                  onChange={(e) => setDealConfig(prev => ({
                    ...prev,
                    lateDealDiscount: parseInt(e.target.value) || 20
                  }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDealConfig(false)}>
                Cancel
              </Button>
              <Button onClick={saveDealConfig} className="bg-[#FF914D] hover:bg-[#FF914D]/90">
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Booking Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={(event) => setSelectedEvent(event)}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                defaultView="month"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deal Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Early Bird (30+ days)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-sm">Late Deal (≤3 days)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                <span className="text-sm">Standard Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Cancelled</span>
              </div>
            </CardContent>
          </Card>

          {selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="font-semibold">Room:</Label>
                  <p>{selectedEvent.resource.room}</p>
                </div>
                <div>
                  <Label className="font-semibold">Deal Type:</Label>
                  <Badge className={`ml-2 ${
                    selectedEvent.resource.dealType === 'early-bird' ? 'bg-green-500' :
                    selectedEvent.resource.dealType === 'late-deal' ? 'bg-amber-500' :
                    'bg-indigo-500'
                  }`}>
                    {selectedEvent.resource.dealType?.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Pricing:</Label>
                  <p className="text-sm">
                    Original: ${selectedEvent.resource.originalPrice}<br/>
                    Final: ${selectedEvent.resource.finalPrice}<br/>
                    Discount: {selectedEvent.resource.discount}%<br/>
                    Savings: ${selectedEvent.resource.originalPrice - selectedEvent.resource.finalPrice}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Guests:</Label>
                  <p>{selectedEvent.resource.guestCount}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status:</Label>
                  <Badge className={`ml-2 ${
                    selectedEvent.resource.status === 'confirmed' ? 'bg-green-500' :
                    selectedEvent.resource.status === 'pending' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}>
                    {selectedEvent.resource.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Current Deals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertDescription>
                  <strong>Early Bird:</strong> {dealConfig.earlyBirdDiscount}% off bookings {dealConfig.earlyBirdDays}+ days ahead
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertDescription>
                  <strong>Late Deal:</strong> {dealConfig.lateDealDiscount}% off bookings ≤{dealConfig.lateDealDays} days ahead
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertDescription>
                  <strong>Standard:</strong> {dealConfig.baseDiscountPercent}% off Airbnb prices
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
