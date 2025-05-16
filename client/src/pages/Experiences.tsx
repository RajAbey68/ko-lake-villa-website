import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Activity } from '@shared/schema';

const Experiences = () => {
  // Fetch activities
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  useEffect(() => {
    document.title = "Experiences & Activities - Ko Lake Villa";
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Activities & Experiences</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Discover the natural beauty and cultural richness of the surrounding area with our curated activities and experiences.
          </p>
        </div>
      </section>

      {/* Main Activities Section */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Explore & Discover</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              We offer a variety of activities and experiences to make your stay at Ko Lake Villa memorable and enriching. From relaxing by the lake to immersing yourself in local culture, there's something for everyone.
            </p>
          </div>

          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="w-full h-56 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">Sorry, we couldn't load the activities information.</p>
              <p>Please try again later or contact us directly.</p>
            </div>
          ) : (
            // Successful data loading - render activity cards based on the fetched data
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities?.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.name} 
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';
                      console.log(`Experience image failed to load: ${activity.imageUrl}`);
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2">{activity.name}</h3>
                    <p className="text-[#333333] mb-4">{activity.description}</p>
                    <Link href="/contact" className="text-[#E8B87D] hover:text-[#1E4E5F] transition-colors font-medium">
                      Inquire About This Activity <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seasonal Experiences Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Seasonal Experiences</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Throughout the year, we offer special seasonal activities and experiences that allow you to connect with nature and local traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Seasonal Experience 1 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">Monsoon Season (May-September)</h3>
              <ul className="space-y-2 text-[#333333]">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Rainforest treks with stunning waterfall views</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Bird watching during migratory season</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Indoor cooking classes featuring monsoon specialties</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Relaxing lake views from covered verandas</span>
                </li>
              </ul>
            </div>

            {/* Seasonal Experience 2 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">Dry Season (October-April)</h3>
              <ul className="space-y-2 text-[#333333]">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Sunset boat cruises on the calm lake</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Lakeside yoga and meditation sessions</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Beach excursions to nearby coastal areas</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Stargazing nights with refreshments</span>
                </li>
              </ul>
            </div>

            {/* Seasonal Experience 3 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">Festival Season (Various Times)</h3>
              <ul className="space-y-2 text-[#333333]">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Local temple festival visits and cultural experiences</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Traditional dance and music performances</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Holiday-themed dinners and celebrations</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Craft workshops with local artisans</span>
                </li>
              </ul>
            </div>

            {/* Seasonal Experience 4 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6">
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">Year-Round Activities</h3>
              <ul className="space-y-2 text-[#333333]">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Wildlife spotting around the lake</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Photography sessions with stunning backdrops</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Private picnics at scenic locations</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#E8B87D] mt-1 mr-2"></i>
                  <span>Book selection from our curated library</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Attractions Section */}
      <section className="py-20 bg-[#E6D9C7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Nearby Attractions</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              Ko Lake Villa is ideally situated to explore the surrounding area. Here are some popular attractions within easy reach of our property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Attraction 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-display font-bold text-[#1E4E5F] mb-2">Koggala Beach</h3>
              <p className="text-[#333333] mb-2">A beautiful stretch of golden sand just a 15-minute drive away.</p>
              <p className="text-[#333333] text-sm"><i className="fas fa-map-marker-alt text-[#E8B87D] mr-2"></i>5 km distance</p>
            </div>

            {/* Attraction 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-display font-bold text-[#1E4E5F] mb-2">Galle Fort</h3>
              <p className="text-[#333333] mb-2">UNESCO World Heritage Site with colonial architecture and history.</p>
              <p className="text-[#333333] text-sm"><i className="fas fa-map-marker-alt text-[#E8B87D] mr-2"></i>20 km distance</p>
            </div>

            {/* Attraction 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-display font-bold text-[#1E4E5F] mb-2">Martin Wickramasinghe Museum</h3>
              <p className="text-[#333333] mb-2">Folk culture museum celebrating Sri Lankan heritage.</p>
              <p className="text-[#333333] text-sm"><i className="fas fa-map-marker-alt text-[#E8B87D] mr-2"></i>3 km distance</p>
            </div>

            {/* Attraction 4 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-display font-bold text-[#1E4E5F] mb-2">Stilt Fishermen</h3>
              <p className="text-[#333333] mb-2">Witness the traditional fishing method unique to this coastal area.</p>
              <p className="text-[#333333] text-sm"><i className="fas fa-map-marker-alt text-[#E8B87D] mr-2"></i>8 km distance</p>
            </div>

            {/* Attraction 5 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-display font-bold text-[#1E4E5F] mb-2">Tea Plantations</h3>
              <p className="text-[#333333] mb-2">Visit working tea estates and learn about Ceylon tea production.</p>
              <p className="text-[#333333] text-sm"><i className="fas fa-map-marker-alt text-[#E8B87D] mr-2"></i>25 km distance</p>
            </div>

            {/* Attraction 6 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-display font-bold text-[#1E4E5F] mb-2">Whale Watching</h3>
              <p className="text-[#333333] mb-2">Seasonal excursions to spot blue whales and dolphins.</p>
              <p className="text-[#333333] text-sm"><i className="fas fa-map-marker-alt text-[#E8B87D] mr-2"></i>30 km distance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1E4E5F] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Ready for an Adventure?</h2>
          <p className="max-w-2xl mx-auto mb-8">Contact us to customize your stay with experiences and activities tailored to your interests.</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/booking" className="inline-block bg-[#E8B87D] text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#1E4E5F] transition-colors">
              Book Your Stay
            </Link>
            <Link href="/contact" className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#1E4E5F] transition-colors">
              Ask About Activities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Experiences;
