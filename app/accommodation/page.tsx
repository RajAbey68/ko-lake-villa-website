"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Eye, Video, ShoppingCart } from 'lucide-react';
import BookingModal from '@/components/BookingModal';

// Define the type for a single room
interface Room {
  id: string;
  name: string;
  description: string;
  capacity: string;
  size: string;
  features: string[];
  airbnbPrice: number;
  directPrice: number;
  imageUrl: string;
  slug: string;
}

// --- Main Accommodation Page Component ---
export default function AccommodationPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/rooms');
        if (!res.ok) throw new Error('Failed to fetch accommodation data.');
        const data = await res.json();
        setRooms(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
  };

  const handleBookingSubmit = (bookingData: any) => {
    // Handle the booking submission
    console.log('Booking submitted:', bookingData);
    // Here you would typically send the booking data to your backend
    alert('Booking submitted successfully! We will contact you shortly.');
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1E4E5F] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading Accommodations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Accommodations</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F2]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 bg-[#1E4E5F] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Accommodation</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Find your perfect sanctuary. Each space is designed to help you relax, revive, and reconnect with what matters most.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Experience Lakeside Luxury</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              From the expansive entire villa to our intimate suites, every accommodation option offers a unique way to experience the tranquility and beauty of Ko Lake Villa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                <div className="md:flex">
                  <div className="md:w-2/5 relative group">
                    <Image
                      src={room.imageUrl}
                      alt={`Image of ${room.name}`}
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-full object-cover"
                      onError={(e) => {
                        // Fallback to a placeholder image if the original fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-logo.png';
                      }}
                    />
                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center space-x-4">
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 text-white border-white bg-black/30 hover:bg-white hover:text-black">
                            <Eye className="w-4 h-4 mr-2"/> Explore
                        </Button>
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 text-white border-white bg-black/30 hover:bg-white hover:text-black">
                            <Video className="w-4 h-4 mr-2"/> 3D Tour
                        </Button>
                     </div>
                  </div>
                  <div className="md:w-3/5 p-8">
                    <h3 className="text-2xl font-display font-bold text-[#1E4E5F] mb-3">{room.name}</h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">{room.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">{room.capacity}</Badge>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">{room.size}m²</Badge>
                      {room.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="border-gray-300">{feature}</Badge>
                      ))}
                    </div>
                    
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">
                                    <span className="line-through">Airbnb Rate: ${room.airbnbPrice}</span>
                                    <Link href="#" className="text-blue-600 hover:underline ml-2 text-xs">(view)</Link>
                                </p>
                                <p className="text-xl font-bold text-green-700">Direct Price: ${room.directPrice}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-green-600">Save ${room.airbnbPrice - room.directPrice}!</p>
                                <p className="text-xs text-green-500">10% Off Direct Bookings</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-right">
                        <Button 
                          size="lg" 
                          className="bg-[#FF914D] hover:bg-[#E07B3A] text-white"
                          onClick={() => handleBookNow(room)}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Book Now
                        </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedRoom && (
        <BookingModal
          roomName={selectedRoom.name}
          basePrice={selectedRoom.directPrice}
          onClose={handleCloseModal}
          onBook={handleBookingSubmit}
        />
      )}
    </div>
  );
}
