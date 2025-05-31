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
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title = "Ko Lake Villa - Luxury Lakeside Accommodation in Koggala",
  description = "Experience luxury at Ko Lake Villa, a stunning lakeside retreat in Koggala, Sri Lanka. Direct booking saves 15% compared to Airbnb. Pool, gardens, and lake views.",
  keywords = "Ko Lake Villa, Koggala accommodation, Sri Lanka villa, luxury lakeside retreat, direct booking discount, pool villa, lake view",
  image = "/uploads/gallery/entire-villa/hero-image.jpg",
  url = "https://skill-bridge-rajabey68.replit.app",
  type = "website"
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Ko Lake Villa" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Ko Lake Villa" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#8B5E3C" />
      <link rel="canonical" href={url} />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": "Ko Lake Villa",
          "description": description,
          "url": url,
          "telephone": "+94-77-123-4567",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Koggala Lake",
            "addressLocality": "Koggala",
            "addressRegion": "Southern Province",
            "addressCountry": "Sri Lanka"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "5.9932",
            "longitude": "80.3254"
          },
          "image": image,
          "priceRange": "$63-$388",
          "amenityFeature": [
            "Swimming Pool",
            "Lake View",
            "Garden",
            "Free WiFi",
            "Air Conditioning"
          ]
        })}
      </script>
    </Helmet>
  );
}
