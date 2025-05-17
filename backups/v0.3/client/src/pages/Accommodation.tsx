import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Room } from '@shared/schema';
import { Separator } from '@/components/ui/separator';

const Accommodation = () => {
  // Fetch all rooms
  const { data: rooms, isLoading, error } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

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
                    <div className="md:w-2/5">
                      <img 
                        src={room.imageUrl} 
                        alt={room.name} 
                        className="w-full h-64 md:h-full object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
                          console.log(`Image failed to load: ${room.imageUrl}`);
                        }}
                      />
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
                      <div className="flex justify-between items-center mt-6">
                        <p className="text-[#1E4E5F] font-bold text-xl">${room.price} / night</p>
                        <Link href="/booking" className="bg-[#E8B87D] text-white px-4 py-2 rounded hover:bg-[#1E4E5F] transition-colors font-medium">Book Now</Link>
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
    </>
  );
};

export default Accommodation;
