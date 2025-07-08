import { useEffect, useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Activity } from '@shared/schema';
import { MapPin, Clock, Users, Star, Filter, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Experiences = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch activities
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  // Categorize activities
  const categorizedActivities = useMemo(() => {
    if (!activities) return { all: [] };
    
    const categories = {
      all: activities,
      'Water Activities': activities.filter(a => a.category === 'Water Activities'),
      'Cultural Activities': activities.filter(a => a.category === 'Cultural Activities'),
      'Nature Activities': activities.filter(a => a.category === 'Nature Activities'),
      'Adventure Activities': activities.filter(a => a.category === 'Adventure Activities'),
      'Wellness Activities': activities.filter(a => a.category === 'Wellness Activities'),
      'Beach Activities': activities.filter(a => a.category === 'Beach Activities'),
      'Spiritual Activities': activities.filter(a => a.category === 'Spiritual Activities')
    };
    
    return categories;
  }, [activities]);

  const displayedActivities = categorizedActivities[selectedCategory] || [];

  useEffect(() => {
    document.title = "Experiences & Activities - Ko Lake Villa";
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Ko Lake Area Experiences</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Discover authentic Sri Lankan experiences around Ko Lake - from traditional boat safaris and village cultural tours to nature adventures and wellness activities in the heart of Ahangama.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-[#E8B87D] text-[#1E4E5F] rounded-full text-sm font-medium">15 Unique Experiences</span>
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">Cultural Immersion</span>
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">Nature Adventures</span>
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">Water Activities</span>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.keys(categorizedActivities).map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`${
                  selectedCategory === category 
                    ? 'bg-[#E8B87D] hover:bg-[#1E4E5F] text-white' 
                    : 'border-[#E8B87D] text-[#1E4E5F] hover:bg-[#E8B87D] hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category === 'all' ? 'All Experiences' : category}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {categorizedActivities[category]?.length || 0}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Activities Section */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">
              {selectedCategory === 'all' ? 'All Ko Lake Experiences' : selectedCategory}
            </h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              {selectedCategory === 'all' 
                ? 'Authentic Sri Lankan experiences curated for guests of Ko Lake Villa. Each activity is designed to showcase the natural beauty and rich culture of the Ahangama area.'
                : `Discover ${selectedCategory.toLowerCase()} around Ko Lake and the beautiful Ahangama region.`
              }
            </p>
          </div>

          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
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
              <p className="text-red-600 mb-4">Sorry, we couldn't load the Ko Lake experiences.</p>
              <p>Please try again later or contact us directly for activity information.</p>
            </div>
          ) : displayedActivities.length === 0 ? (
            // No activities in selected category
            <div className="text-center py-10">
              <p className="text-[#333333] mb-4">No experiences found in this category.</p>
              <Button 
                onClick={() => setSelectedCategory('all')}
                className="bg-[#E8B87D] hover:bg-[#1E4E5F] text-white"
              >
                View All Experiences
              </Button>
            </div>
          ) : (
            // Enhanced activity cards with detailed information
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={activity.imageUrl} 
                      alt={activity.name} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#E8B87D] text-white px-2 py-1 rounded-full text-sm font-medium">
                        {activity.category?.replace(' Activities', '') || 'Experience'}
                      </span>
                    </div>
                    {activity.price && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${activity.price}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-2 group-hover:text-[#E8B87D] transition-colors">
                      {activity.name}
                    </h3>
                    
                    <p className="text-[#333333] mb-4 text-sm leading-relaxed line-clamp-3">
                      {activity.description}
                    </p>

                    {/* Activity Details */}
                    <div className="flex items-center justify-between mb-4 text-sm text-[#666]">
                      {activity.duration && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-[#E8B87D]" />
                          <span>{activity.duration}</span>
                        </div>
                      )}
                      {activity.difficulty && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-[#E8B87D]" />
                          <span>{activity.difficulty}</span>
                        </div>
                      )}
                    </div>

                    {/* Highlights Preview */}
                    {activity.highlights && activity.highlights.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-[#666] mb-2">Highlights:</p>
                        <ul className="text-xs text-[#333] space-y-1">
                          {activity.highlights.slice(0, 2).map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-[#E8B87D] rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                          {activity.highlights.length > 2 && (
                            <li className="text-[#E8B87D] text-xs">
                              +{activity.highlights.length - 2} more highlights
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Link 
                        href="/contact" 
                        className="text-[#E8B87D] hover:text-[#1E4E5F] transition-colors font-medium text-sm flex items-center group"
                      >
                        Book Experience
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      
                      {activity.bestTime && (
                        <span className="text-xs text-[#666] italic">
                          Best: {activity.bestTime.split(' ')[0]}
                        </span>
                      )}
                    </div>
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
