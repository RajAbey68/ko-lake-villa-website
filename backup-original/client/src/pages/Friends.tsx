import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GalleryImage } from '@/lib/galleryUtils';

export default function Friends() {
  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Filter images for friends and crew category
  const friendsImages = images.filter(image => image.category === 'friends-and-crew');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF914D] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#8B5E3C] mb-6">
            Friends & Crew
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Meet the amazing team, family, and local partners behind Ko Lake Villa. 
            From our dedicated staff to the wonderful guests who have become part of our extended family.
          </p>
        </div>
      </section>

      {/* Friends Gallery */}
      <div className="container mx-auto px-4 pb-20">
        {friendsImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friendsImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src={image.imageUrl}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                  {image.featured && (
                    <Badge className="absolute top-2 left-2 bg-[#FF914D]">
                      Featured
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-medium text-[#8B5E3C] mb-2">{image.alt}</h3>
                  
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3">{image.description}</p>
                  )}

                  {image.tags && (
                    <div className="flex flex-wrap gap-1">
                      {image.tags.split(',').slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 shadow-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[#8B5E3C] mb-4">
                Our Friends Gallery Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're currently building our friends and crew photo collection. 
                Check back soon to meet the wonderful people who make Ko Lake Villa special.
              </p>
              <div className="bg-[#8B5E3C]/5 rounded-xl p-6">
                <h4 className="font-medium text-[#8B5E3C] mb-3">What You'll Find Here:</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                  <li>• Our dedicated villa staff and management team</li>
                  <li>• Local partners and service providers</li>
                  <li>• Guests who have become part of our family</li>
                  <li>• Community events and celebrations</li>
                  <li>• Behind-the-scenes moments at the villa</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Our Team Section */}
      <section className="bg-[#8B5E3C]/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#8B5E3C] mb-6">
              The Ko Lake Villa Family
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our villa is more than just a place to stay - it's a community built on genuine hospitality, 
              local connections, and memorable experiences. From our housekeeping team who ensure every 
              detail is perfect, to our local guides who share the hidden gems of Galle, every person 
              you meet is passionate about creating your perfect Sri Lankan getaway.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF914D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="font-semibold text-[#8B5E3C] mb-2">Villa Team</h3>
                <p className="text-sm text-gray-600">Dedicated staff ensuring your comfort and creating memorable experiences</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#A0B985] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold text-[#8B5E3C] mb-2">Local Partners</h3>
                <p className="text-sm text-gray-600">Trusted local businesses and guides who enhance your Sri Lankan adventure</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#8B5E3C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="font-semibold text-[#8B5E3C] mb-2">Extended Family</h3>
                <p className="text-sm text-gray-600">Guests who have become lifelong friends and part of our villa story</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}