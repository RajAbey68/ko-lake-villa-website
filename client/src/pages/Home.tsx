import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Room, Testimonial, Activity } from '@shared/schema';
import { ratingToStars } from '@/lib/utils';
import SEOHead from '@/components/SEOHead';
// Use stunning sunset pool view for hero section
import heroPoolImage from "@assets/image_1749894978513.png";

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
    document.title = "Ko Lake Villa | Your Luxury Accommodation Catalyst";
  }, []);

  return (
    <>
      <SEOHead 
        title="Ko Lake Villa | Your Luxury Accommodation Catalyst"
        description="Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views. Your luxury accommodation catalyst for unforgettable memories."
        keywords="Ko Lake Villa, Ahangama accommodation, Galle villa, Sri Lanka lakefront, Koggala Lake, boutique villa, family suite, group accommodation, infinity pool, direct booking, luxury villa Sri Lanka"
        url="https://skill-bridge-rajabey68.replit.app"
        image="/preview-image.jpg"
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroPoolImage})`
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl text-white font-display font-light mb-3 tracking-wider">Ko Lake Villa</h1>
          <p className="text-base md:text-lg text-white mb-8 font-light opacity-90">Relax. Revive. Reconnect by the Lake in Ahangama, Sri Lanka.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/gallery" className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-5 py-2 rounded-full border border-white border-opacity-30 hover:bg-opacity-20 transition-all text-sm font-light">
              View Gallery
            </Link>
            <Link href="/contact" className="bg-transparent text-white px-5 py-2 rounded-full border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-all text-sm font-light">
              Request Info
            </Link>
            <Link href="/accommodation" className="bg-white bg-opacity-15 backdrop-blur-sm text-white px-5 py-2 rounded-full border border-white border-opacity-40 hover:bg-opacity-25 transition-all text-sm font-medium">
              Book Direct – Save 10%
            </Link>
          </div>
        </div>
      </section>

      {/* Ko Lake Theme Showcase */}
      <section className="kolake-theme py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="kolake-heading text-3xl md:text-4xl font-display font-bold mb-4">Discover Tranquility</h2>
            <p className="text-lg text-gray-700 mb-8">Experience the Ko Lake Villa lifestyle on your terms</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="kolake-btn primary">Book Direct – Save 10%</button>
              <button className="kolake-btn accent">Explore Experiences</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="kolake-card text-center">
              <i className="fas fa-leaf text-4xl mb-4" style={{color: 'var(--kolake-accent)'}}></i>
              <h3 className="kolake-heading text-xl font-bold mb-2">Tropical Paradise</h3>
              <p>Immerse yourself in the natural beauty of Ahangama's lakeside setting</p>
            </div>
            <div className="kolake-card text-center">
              <i className="fas fa-crown text-4xl mb-4" style={{color: 'var(--kolake-primary)'}}></i>
              <h3 className="kolake-heading text-xl font-bold mb-2">Luxury Experience</h3>
              <p>Indulge in premium amenities and personalized Sri Lankan hospitality</p>
            </div>
            <div className="kolake-card text-center">
              <i className="fas fa-heart text-4xl mb-4" style={{color: 'var(--kolake-secondary)'}}></i>
              <h3 className="kolake-heading text-xl font-bold mb-2">Authentic Connection</h3>
              <p>Connect with local culture and create lasting memories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-6">Welcome to Lakeside Luxury</h2>
              <p className="text-[#8B5E3C] mb-6 leading-relaxed">Ko Lake Villa is a boutique accommodation nestled on the shores of a serene lake in Ahangama, Galle, offering a perfect blend of luxury, comfort, and natural beauty. Our villa provides an exclusive retreat for travelers seeking tranquility and authentic Sri Lankan elegance.</p>
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

      {/* Our Property Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">Our Property</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Discover Ko Lake Villa - an exclusive lakefront retreat with stunning infinity pool, rooftop terraces, and panoramic views of Koggala Lake and Madol Duwa Island.</p>
          </div>
          
          {/* Property Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Photo Gallery Preview */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
              <img 
                src="/uploads/gallery/default/1747314605513.jpeg"
                alt="Ko Lake Villa Infinity Pool"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/uploads/gallery/default/1747314605525.jpeg';
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">60-ft Infinity Pool</h3>
                <p className="text-[#8B5E3C] mb-4">Stunning lakefront infinity pool with panoramic views of Koggala Lake</p>
                <Link href="/gallery" className="text-[#8B5E3C] font-medium hover:underline">
                  View Photo Gallery →
                </Link>
              </div>
            </div>

            {/* Property Highlights */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
              <img 
                src="/uploads/gallery/default/1747314605525.jpeg"
                alt="Ko Lake Villa Rooftop Terrace"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/uploads/gallery/default/1747314605513.jpeg';
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">Rooftop Terrace</h3>
                <p className="text-[#8B5E3C] mb-4">360° views of lake, paddy fields, and Madol Duwa Island</p>
                <div className="flex flex-wrap">
                  <span className="bg-[#E6D9C7] text-[#8B5E3C] px-2 py-1 rounded text-sm mr-2 mb-2">5 Triple Rooms + 2 Suites</span>
                  <span className="bg-[#E6D9C7] text-[#8B5E3C] px-2 py-1 rounded text-sm mr-2 mb-2">Lakefront</span>
                </div>
              </div>
            </div>

            {/* Late Booking Offers */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg overflow-hidden shadow-lg border-2 border-green-200">
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">SPECIAL OFFER</span>
                </div>
                <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2 text-center">Late Booking Deals</h3>
                <p className="text-[#8B5E3C] mb-4 text-center">Book within 3 days of check-in</p>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-green-600">15% OFF</span>
                  <p className="text-sm text-[#8B5E3C]">Instead of regular 10% discount</p>
                </div>
                <div className="space-y-2 text-sm text-[#8B5E3C]">
                  <div className="flex justify-between">
                    <span>Entire Villa:</span>
                    <span className="font-bold text-green-600">From $366</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family Suite:</span>
                    <span className="font-bold text-green-600">From $101</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Now CTA */}
          <div className="text-center">
            <Link href="/accommodation" className="inline-block bg-[#8B5E3C] text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#7A5232] transition-colors shadow-lg">
              Book Now - Direct Booking Saves 10%
            </Link>
            <p className="text-[#8B5E3C] mt-4">No booking fees • Best rate guarantee • Direct support</p>
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
