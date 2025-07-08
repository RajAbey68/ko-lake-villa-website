import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Room } from '@shared/schema';
import { Separator } from '@/components/ui/separator';
import BookingModal from '@/components/BookingModal';
import VirtualTourModal from '@/components/VirtualTourModal';
import RoomDetailsModal from '@/components/RoomDetailsModal';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GalleryImage from '@/components/GalleryImage';

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

const Accommodation = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ name: string; price: number } | null>(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedTourRoom, setSelectedTourRoom] = useState<string>('');
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);

  // Fetch all rooms
  const { data: rooms, isLoading, error } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  // Fetch current pricing data (including your custom overrides)
  const { data: pricing } = useQuery<PricingData>({
    queryKey: ['/api/admin/pricing'],
  });

  // Helper function to get authentic room images
  const getAuthenticRoomImage = (roomName: string) => {
    if (roomName.includes('KLV1') || roomName.includes('Family Suite')) {
      return '/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg';
    } else if (roomName.includes('KLV3') || roomName.includes('Triple')) {
      return '/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg';
    } else if (roomName.includes('KLV6') || roomName.includes('Group')) {
      return '/uploads/gallery/group-room/KoggalaNinePeaks_group-room_0.jpg';
    } else if (roomName.includes('Villa') || roomName.includes('KLV')) {
      return '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
    }
    return '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
  };

  // Handle image click for detailed exploration
  const handleImageClick = (room: Room) => {
    setSelectedRoomForDetails(room);
    setShowRoomDetails(true);
  };

  // Helper function to get current price for a room
  const getCurrentPrice = (roomName: string) => {
    let roomId = '';
    if (roomName.includes('KLV1')) roomId = 'klv1';
    else if (roomName.includes('KLV3')) roomId = 'klv3';
    else if (roomName.includes('KLV6')) roomId = 'klv6';
    else roomId = 'klv';

    // Check if there's a custom override
    const override = pricing?.overrides?.[roomId];
    if (override) {
      return override.customPrice;
    }

    // Otherwise use the pre-agreed rate (Airbnb avg × 0.9)
    if (pricing?.rates?.[roomId]) {
      const rate = pricing.rates[roomId];
      const avgRate = Math.round((rate.sun + rate.mon + rate.tue) / 3);
      return Math.round(avgRate * 0.9);
    }

    // Fallback to static pricing
    return roomName.includes('KLV1') ? 107 : 
           roomName.includes('KLV3') ? 63 :
           roomName.includes('KLV6') ? 225 : 388;
  };

  const getAirbnbRate = (roomName: string) => {
    return roomName.includes('KLV1') ? 119 : 
           roomName.includes('KLV3') ? 70 :
           roomName.includes('KLV6') ? 250 : 431;
  };

  const getAirbnbUrl = (roomName: string) => {
    // Use search URLs with location and property details for better reliability
    const baseUrl = 'https://www.airbnb.com/s/Koggala--Southern-Province--Sri-Lanka';
    const searchParams = new URLSearchParams({
      'refinement_paths[]': '/homes',
      'tab_id': 'home_tab',
      'flexible_trip_lengths[]': 'one_week',
      'place_id': 'ChIJy61EFjAd4joRgfhfvUaK3SY',
      'search_mode': 'regular_search'
    });
    
    if (roomName.includes('KLV1') || roomName.includes('Family Suite')) {
      searchParams.set('room_types[]', 'Private room');
      searchParams.set('min_bedrooms', '2');
      return `${baseUrl}?${searchParams.toString()}`;
    } else if (roomName.includes('KLV3') || roomName.includes('Triple')) {
      searchParams.set('room_types[]', 'Private room');
      searchParams.set('min_bedrooms', '1');
      return `${baseUrl}?${searchParams.toString()}`;
    } else if (roomName.includes('KLV6') || roomName.includes('Group')) {
      searchParams.set('room_types[]', 'Shared room');
      searchParams.set('min_bedrooms', '3');
      return `${baseUrl}?${searchParams.toString()}`;
    } else {
      // Entire villa - search for entire homes
      searchParams.set('room_types[]', 'Entire home/apt');
      searchParams.set('min_bedrooms', '4');
      return `${baseUrl}?${searchParams.toString()}`;
    }
  };

  // Validate that our prices are always cheaper than Airbnb
  const validatePricingAdvantage = (roomName: string) => {
    const directPrice = getCurrentPrice(roomName);
    const airbnbPrice = getAirbnbRate(roomName);
    const savings = airbnbPrice - directPrice;

    if (savings <= 0) {
      console.warn(`Pricing Alert: ${roomName} - Direct rate ($${directPrice}) should be lower than Airbnb ($${airbnbPrice})`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    document.title = "Accommodation - Ko Lake Villa";
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Our Accommodation</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Experience the perfect blend of comfort, luxury, and nature with our thoughtfully designed rooms and suites.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Experience Lakeside Luxury</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Each of our rooms and suites is carefully designed to provide comfort, privacy, and stunning views of the surroundings. 
              Choose from a variety of accommodation options to suit your needs and preferences.
            </p>
          </div>

          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 gap-10 max-w-4xl mx-auto">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="md:flex">
                    <div className="md:w-2/5 bg-gray-300 h-64 md:h-auto"></div>
                    <div className="md:w-3/5 p-6">
                      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="flex flex-wrap mb-4">
                        {Array(4).fill(0).map((_, j) => (
                          <div key={j} className="bg-gray-300 h-6 w-20 rounded-full mr-2 mb-2"></div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">Sorry, we couldn't load the accommodation information.</p>
              <p>Please try again later or contact us directly.</p>
            </div>
          ) : (
            // Successful data loading
            <div className="grid grid-cols-1 gap-10 max-w-4xl mx-auto">
              {rooms?.map((room, index) => (
                <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover-scale">
                  <div className="md:flex">
                    <div className="md:w-2/5 relative group cursor-pointer" onClick={() => handleImageClick(room)}>
                      <GalleryImage 
                        src={getAuthenticRoomImage(room.name)} 
                        alt={`${room.name} - ${room.capacity} guests, ${room.size}m² with ${room.features.join(', ')} at Ko Lake Villa Ahangama`}
                        className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105 accommodation"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                          <Eye className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Click to explore</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-2xl font-display font-bold text-[#1E4E5F] mb-3">{room.name}</h3>
                      <p className="text-[#333333] mb-4">{room.description}</p>
                      <div className="flex flex-wrap mb-4">
                        {room.features.map((feature, i) => (
                          <span key={i} className="bg-[#E6D9C7] text-[#333333] px-3 py-1 rounded-full text-sm mr-2 mb-2">{feature}</span>
                        ))}
                        <span className="bg-[#E6D9C7] text-[#333333] px-3 py-1 rounded-full text-sm mr-2 mb-2">{room.size}m²</span>
                      </div>
                      <div className="mt-6">
                        {/* Dynamic Pricing Comparison with Airbnb Links */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 line-through">
                                Airbnb Rate: ${getAirbnbRate(room.name)}
                              </span>
                              <a 
                                href={getAirbnbUrl(room.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                              >
                                View on Airbnb
                              </a>
                            </div>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                              Book Direct & Save
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#1E4E5F] font-bold text-xl">
                              Direct Rate: ${getCurrentPrice(room.name)}
                            </span>
                            {validatePricingAdvantage(room.name) ? (
                              <span className="text-green-600 font-bold">
                                Save ${(getAirbnbRate(room.name) - getCurrentPrice(room.name)).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-red-600 font-bold text-sm">
                                Price Alert: Review needed
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Prices compared to actual Airbnb listings • Updated regularly
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <span>Better rates • Direct support • No booking fees</span>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedTourRoom(room.name);
                                setShowVirtualTour(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Virtual Tour
                            </Button>
                            <button 
                              onClick={() => {
                                setSelectedRoom({
                                  name: room.name,
                                  price: getCurrentPrice(room.name)
                                });
                                setShowBookingModal(true);
                              }}
                              className="bg-[#E8B87D] text-white px-6 py-3 rounded hover:bg-[#1E4E5F] transition-colors font-medium"
                            >
                              Book Direct
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < (rooms.length - 1) && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Villa Amenities</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Enjoy our range of amenities and services designed to make your stay comfortable and memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Amenity 1 */}
            <div className="text-center p-6">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-wifi"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Complimentary Wi-Fi</h3>
              <p className="text-[#333333]">Stay connected with high-speed internet access available throughout the property.</p>
            </div>

            {/* Amenity 2 */}
            <div className="text-center p-6">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-concierge-bell"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Personalized Service</h3>
              <p className="text-[#333333]">Our dedicated staff is available to assist with your needs and ensure a comfortable stay.</p>
            </div>

            {/* Amenity 3 */}
            <div className="text-center p-6">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-swimming-pool"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Lake Access</h3>
              <p className="text-[#333333]">Direct access to the lake with a private deck for relaxation and water activities.</p>
            </div>

            {/* Amenity 4 */}
            <div className="text-center p-6">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-leaf"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Garden Spaces</h3>
              <p className="text-[#333333]">Beautifully maintained gardens with seating areas for outdoor relaxation.</p>
            </div>

            {/* Amenity 5 */}
            <div className="text-center p-6">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-utensils"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Dining Options</h3>
              <p className="text-[#333333]">Choose from private chef services or self-catering with our fully equipped kitchen.</p>
            </div>

            {/* Amenity 6 */}
            <div className="text-center p-6">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-car"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">Transport Services</h3>
              <p className="text-[#333333]">Airport transfers and local transportation arrangements available upon request.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#E6D9C7]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-6">Ready to Experience Ko Lake Villa?</h2>
          <p className="text-[#333333] max-w-2xl mx-auto mb-8">Book your stay now and enjoy our luxurious accommodations with breathtaking lake views.</p>
          <Link href="/booking" className="inline-block bg-[#1E4E5F] text-white px-8 py-4 rounded text-lg font-medium hover:bg-[#E8B87D] transition-colors">Book Your Stay</Link>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          roomName={selectedRoom.name}
          basePrice={selectedRoom.price}
          onClose={() => setShowBookingModal(false)}
          onBook={(bookingData) => {
            // Store booking data and navigate to checkout
            sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
            window.location.href = '/checkout';
          }}
        />
      )}

      {/* Virtual Tour Modal */}
      <VirtualTourModal
        isOpen={showVirtualTour}
        onClose={() => setShowVirtualTour(false)}
        roomName={selectedTourRoom}
      />

      {/* Room Details Modal */}
      <RoomDetailsModal
        room={selectedRoomForDetails}
        isOpen={showRoomDetails}
        onClose={() => setShowRoomDetails(false)}
        onBookNow={(room) => {
          setSelectedRoom(room);
          setShowRoomDetails(false);
          setShowBookingModal(true);
        }}
        onVirtualTour={(roomName) => {
          setSelectedTourRoom(roomName);
          setShowRoomDetails(false);
          setShowVirtualTour(true);
        }}
      />
      {/* Staff Protection Rules */}
      <section className="py-8 bg-red-50">
        <div className="container mx-auto px-4">
          <div id="staff-rules" data-staff-rules className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
            {/* Content will be populated by global-fixes.js */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Accommodation;