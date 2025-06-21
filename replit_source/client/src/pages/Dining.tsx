import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { DiningOption } from '@shared/schema';

const Dining = () => {
  // Fetch dining options
  const { data: diningOptions, isLoading, error } = useQuery<DiningOption[]>({
    queryKey: ['/api/dining-options'],
  });

  useEffect(() => {
    document.title = "Dining & Services - Ko Lake Villa";
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Dining & Services</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Experience exceptional cuisine and personalized dining services during your stay at Ko Lake Villa.
          </p>
        </div>
      </section>

      {/* Main Dining Options Section */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Culinary Experiences</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              We believe that exceptional food is an essential part of any memorable stay. At Ko Lake Villa, we offer a variety of dining options and services to satisfy your culinary desires.
            </p>
          </div>

          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg p-6 animate-pulse">
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
                  <div className="space-y-2">
                    {Array(4).fill(0).map((_, j) => (
                      <div key={j} className="flex items-start">
                        <div className="w-4 h-4 mt-1 mr-2 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">Sorry, we couldn't load the dining information.</p>
              <p>Please try again later or contact us directly.</p>
            </div>
          ) : (
            // Successful data loading
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {diningOptions?.map((option) => (
                <div key={option.id} className="bg-white rounded-lg overflow-hidden shadow-lg p-6">
                  <h3 className="text-2xl font-display font-bold text-[#1E4E5F] mb-4">{option.name}</h3>
                  <img 
                    src={option.imageUrl} 
                    alt={option.name} 
                    className="w-full h-64 object-cover rounded-lg mb-6"
                    onError={(e) => {
                      console.log(`Image failed to load: ${option.imageUrl}`);
                      // Only fade the image rather than using a placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.opacity = '0.2';
                      target.style.filter = 'grayscale(100%)';
                    }}
                  />
                  <p className="text-[#333333] mb-6">{option.description}</p>
                  <ul className="text-[#333333] mb-6">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-start mb-2">
                        <i className="fas fa-check text-[#E8B87D] mt-1 mr-2"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="inline-block bg-[#E8B87D] text-white px-4 py-2 rounded hover:bg-[#1E4E5F] transition-colors text-sm font-medium">
                    Inquire About {option.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-4">Additional Services</h2>
            <p className="text-[#333333] max-w-3xl mx-auto">
              We offer a range of additional services to enhance your stay and create unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Service 1 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6 text-center">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-birthday-cake"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">Special Occasions</h3>
              <p className="text-[#333333]">
                Let us help you celebrate birthdays, anniversaries, or other special occasions with customized setups and surprises.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6 text-center">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-spa"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">In-room Spa Services</h3>
              <p className="text-[#333333]">
                Enjoy relaxing massages and spa treatments in the comfort of your room or in our dedicated wellness space.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-[#F8F6F2] rounded-lg p-6 text-center">
              <div className="text-[#E8B87D] text-4xl mb-4">
                <i className="fas fa-cocktail"></i>
              </div>
              <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-3">Beverage Packages</h3>
              <p className="text-[#333333]">
                Select from our curated wine and beverage packages to complement your dining experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dietary Accommodations Section */}
      <section className="py-20 bg-[#E6D9C7]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-6">Dietary Accommodations</h2>
            <p className="text-[#333333] mb-8">
              We understand the importance of catering to various dietary needs and preferences. Our chefs are experienced in preparing meals for guests with specific requirements, including:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Vegetarian</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Vegan</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Gluten-Free</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Dairy-Free</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Nut Allergies</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Low-Carb</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Halal</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-[#1E4E5F] font-medium">Kosher</p>
              </div>
            </div>
            
            <p className="text-[#333333] mb-8">
              Please let us know about any dietary requirements when making your booking or inquiring about our dining services, and we'll be happy to accommodate your needs.
            </p>
            
            {/* Dietary Safety & Allergen Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-display font-semibold text-[#1E4E5F] mb-3">Dietary Safety & Allergen Notice</h3>
              <div className="text-sm text-[#333333] space-y-3 text-left">
                <p>
                  We do our best to accommodate dietary needs and religious preferences, and our team follows careful food-handling protocols. However, in a small kitchen environment, we cannot guarantee full segregation or zero cross-contamination.
                </p>
                <p className="font-medium text-amber-800">
                  If you have a severe allergy or extreme dietary restriction, please speak with us in advance — we'll always be honest about what we can and cannot safely offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1E4E5F] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Ready to Indulge in Culinary Delights?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Experience our exceptional dining services and savor the flavors during your stay at Ko Lake Villa.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/booking" className="inline-block bg-[#E8B87D] text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#1E4E5F] transition-colors">
              Book Your Stay
            </Link>
            <Link href="/contact" className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#1E4E5F] transition-colors">
              Contact Us for Details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dining;
