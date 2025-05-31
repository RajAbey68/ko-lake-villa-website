import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords = "Ko Lake Villa, Ahangama accommodation, Galle villa, Sri Lanka lakefront, Koggala Lake, boutique villa, family suite, group accommodation, infinity pool, direct booking",
  image = "https://skill-bridge-rajabey68-replit.app/images/hero-villa.jpg",
  url = "https://skill-bridge-rajabey68-replit.app",
  type = "website"
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'Ko Lake Villa');
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');
    
    // Geographic meta tags
    updateMeta('geo.region', 'LK-32');
    updateMeta('geo.placename', 'Ahangama, Galle, Sri Lanka');
    updateMeta('geo.position', '5.9759;80.3648');
    updateMeta('ICBM', '5.9759, 80.3648');
    
    // Open Graph tags for social media
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:image', image);
    updateProperty('og:url', url);
    updateProperty('og:type', type);
    updateProperty('og:site_name', 'Ko Lake Villa');
    updateProperty('og:locale', 'en_US');
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    
    // Structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Ko Lake Villa",
      "description": description,
      "image": image,
      "url": url,
      "telephone": "+94-91-5640636",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ko Lake House, Mirissane Ovita, Madolduwa Road, Kathaluwa West",
        "addressLocality": "Ahangama",
        "addressRegion": "Galle",
        "postalCode": "80650",
        "addressCountry": "LK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 5.9759,
        "longitude": 80.3648
      },
      "amenityFeature": [
        { "@type": "LocationFeatureSpecification", "name": "Infinity Pool" },
        { "@type": "LocationFeatureSpecification", "name": "Lake View" },
        { "@type": "LocationFeatureSpecification", "name": "Free WiFi" },
        { "@type": "LocationFeatureSpecification", "name": "Air Conditioning" },
        { "@type": "LocationFeatureSpecification", "name": "Private Garden" }
      ],
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "priceRange": "$70-$431",
      "checkinTime": "14:00",
      "checkoutTime": "11:00"
    };
    
    // Add or update structured data
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
    
  }, [title, description, keywords, image, url, type]);
  
  return null;
}
