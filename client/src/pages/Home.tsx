import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Room, Testimonial, Activity } from '@shared/schema';
import { ratingToStars } from '@/lib/utils';

const Home = () => {
  // Fetch rooms for the accommodation section
  const { data: rooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  // Fetch testimonials
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Fetch activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  useEffect(() => {
    document.title = "Ko Lake House - Boutique Stay by the Lake";
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#8B5E3C] to-[#A0B985]">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl text-white font-display font-bold mb-6 text-shadow whitespace-nowrap">Ko Lake House</h1>
          <p className="text-xl md:text-2xl text-white mb-8 text-shadow">A Boutique Stay by the Lake</p>
          <Link href="/booking" className="inline-block bg-[#FF914D] text-white px-8 py-4 rounded text-lg font-medium hover:bg-[#8B5E3C] transition-colors">
            Book Your Stay
          </Link>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-6">Welcome to Lakeside Luxury</h2>
              <p className="text-[#8B5E3C] mb-6 leading-relaxed">Ko Lake House is a boutique accommodation nestled on the shores of a serene lake, offering a perfect blend of luxury, comfort, and natural beauty. Our villa provides an exclusive retreat for travelers seeking tranquility and elegance.</p>
              <p className="text-[#8B5E3C] mb-6 leading-relaxed">With spectacular views, personalized service, and attention to detail, we create memorable experiences for our guests - whether you're planning a family vacation, a romantic getaway, or a wellness retreat.</p>
              <div className="flex space-x-6 mt-8">
                <div className="text-center">
                  <i className="fas fa-bed text-[#FF914D] text-3xl mb-2"></i>
                  <p className="text-[#8B5E3C] font-medium">Luxurious Rooms</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-utensils text-[#FF914D] text-3xl mb-2"></i>
                  <p className="text-[#8B5E3C] font-medium">Gourmet Dining</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-swimming-pool text-[#FF914D] text-3xl mb-2"></i>
                  <p className="text-[#8B5E3C] font-medium">Lake Access</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=503,h=464,fit=crop/AGB2Mlr1kBCLQG4w/4-3--min-AoPWZwGn9yH5QvLd.jpg" 
                alt="Ko Lake House interior" 
                className="rounded-lg shadow-lg w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Section Preview */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">Our Accommodation</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Choose from our selection of elegantly appointed rooms and suites, each offering stunning views and premium amenities for a comfortable and luxurious stay.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomsLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="flex flex-wrap mb-4">
                      {Array(4).fill(0).map((_, j) => (
                        <div key={j} className="bg-gray-300 h-6 w-16 rounded-full mr-2 mb-2"></div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              rooms?.slice(0, 3).map((room) => (
                <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
                  <img 
                    src={room.imageUrl} 
                    alt={room.name} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">{room.name}</h3>
                    <p className="text-[#8B5E3C] mb-4">{room.description}</p>
                    <div className="flex flex-wrap mb-4">
                      {room.features.map((feature, index) => (
                        <span key={index} className="bg-[#A0B985] text-[#8B5E3C] px-3 py-1 rounded-full text-sm mr-2 mb-2">{feature}</span>
                      ))}
                      <span className="bg-[#A0B985] text-[#8B5E3C] px-3 py-1 rounded-full text-sm mr-2 mb-2">{room.size}m²</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[#8B5E3C] font-bold text-lg">${room.price} / night</p>
                      <Link href="/booking" className="bg-[#FF914D] text-white px-4 py-2 rounded hover:bg-[#8B5E3C] transition-colors text-sm font-medium">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/accommodation" className="inline-block border-2 border-[#8B5E3C] text-[#8B5E3C] px-6 py-3 rounded font-medium hover:bg-[#8B5E3C] hover:text-white transition-colors">
              View All Accommodation Options
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Section Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">Activities & Experiences</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Discover the natural beauty and cultural richness of the surrounding area with our curated activities and experiences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activitiesLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="w-full h-56 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              activities?.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.name} 
                    className="w-full h-56 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">{activity.name}</h3>
                    <p className="text-[#8B5E3C] mb-4">{activity.description}</p>
                    <Link href="/experiences" className="text-[#FF914D] hover:text-[#8B5E3C] transition-colors font-medium">
                      Learn More <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/experiences" className="inline-block border-2 border-[#8B5E3C] text-[#8B5E3C] px-6 py-3 rounded font-medium hover:bg-[#8B5E3C] hover:text-white transition-colors">
              View All Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">Guest Experiences</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Hear what our guests have to say about their stay at Ko Lake House.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                  <div className="h-24 bg-gray-300 rounded w-full mb-6"></div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              testimonials?.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-[#FF914D]">
                      {ratingToStars(testimonial.rating)}
                    </div>
                  </div>
                  <p className="text-[#8B5E3C] italic mb-6">{testimonial.comment}</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-[#A0B985] rounded-full flex items-center justify-center text-[#8B5E3C] font-bold">
                        {testimonial.avatarInitials}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#8B5E3C]">{testimonial.guestName}</h4>
                      <p className="text-sm text-[#8B5E3C]">{testimonial.guestCountry}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#8B5E3C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Experience Ko Lake House?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">Book your stay now and discover the perfect blend of lakeside tranquility and luxury.</p>
          <Link href="/booking" className="inline-block bg-[#FF914D] text-white px-8 py-4 rounded text-lg font-medium hover:bg-white hover:text-[#8B5E3C] transition-colors">
            Book Your Getaway
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
