// Script to download images from external sources and save them locally
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sample gallery images URLs from storage.ts
const galleryImages = [
  // Family Suite
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=984,h=656,fit=crop/AGB2Mlr1kBCLQG4w/g-family-suite-dai003-mv1p7x36jJUNEq38.jpg",
    alt: "Family Suite Master Bedroom",
    category: "family-suite",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=984,h=656,fit=crop/AGB2Mlr1kBCLQG4w/g-family-suite-dai001-YBgXvBKk0LFLlp26.jpg",
    alt: "Family Suite Living Area",
    category: "family-suite",
    sortOrder: 2
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=984,h=656,fit=crop/AGB2Mlr1kBCLQG4w/g-family-suite-dai004-m8x6xQlK3bT82gVx.jpg",
    alt: "Family Suite Bathroom",
    category: "family-suite",
    sortOrder: 3
  },
  
  // Group Room
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-group-room-dai012-mp10JL0DZ5S7zNaP.jpg",
    alt: "Group Room Overview",
    category: "group-room",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-group-room-dai013-YPqJJq36RZczxzRl.jpg",
    alt: "Group Room Beds",
    category: "group-room",
    sortOrder: 2
  },
  
  // Triple Room
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-triple-room-dai007-mv1p7xJpK6Spv90E.jpg",
    alt: "Triple Room Overview",
    category: "triple-room",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-triple-room-dai006-Y9Pe5xXQvkcOzBXO.jpg",
    alt: "Triple Room Writing Desk",
    category: "triple-room",
    sortOrder: 2
  },
  
  // Dining Area
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1600,h=1066,fit=crop/AGB2Mlr1kBCLQG4w/g-dining-area-dai058-m1a6OOOGJVI1xlW7.jpg",
    alt: "Main Dining Area",
    category: "dining-area",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/kl-f-b-dsc00296-mgQWz7X80bTR8xgZ.jpg",
    alt: "Private Dining Nook",
    category: "dining-area",
    sortOrder: 2
  },
  
  // Pool Deck
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/10-min-YBgXvBnVyGh7vyP4.jpg",
    alt: "Pool Deck with Loungers",
    category: "pool-deck",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=720,fit=crop/AGB2Mlr1kBCLQG4w/11-min-YBgXvBJQ86f0DNRG.jpg",
    alt: "Pool Deck Sunset View",
    category: "pool-deck",
    sortOrder: 2
  },
  
  // Lake Garden
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-front-garden-dai034-AalZ87Xe9Pfr3xOl.jpg",
    alt: "Lake Garden Pathway",
    category: "lake-garden",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-lake-garden-dai028-mp10JLzNZRC7KWED.jpg",
    alt: "Lake Garden Seating Area",
    category: "lake-garden",
    sortOrder: 2
  },
  
  // Roof Garden
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-roof-garden-dai039-dOVD8wLlv9sO90XG.jpg",
    alt: "Roof Garden Panoramic View",
    category: "roof-garden",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1280,h=854,fit=crop/AGB2Mlr1kBCLQG4w/g-roof-garden-dai037-dOVD8w7z1VuLKeW8.jpg",
    alt: "Roof Garden Lounge Area",
    category: "roof-garden",
    sortOrder: 2
  },
  
  // Front Garden and Entrance
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1280,fit=crop/AGB2Mlr1kBCLQG4w/1-min-AoPWZwpbLZTW8Rr7.jpg",
    alt: "Villa Main Entrance",
    category: "front-garden",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/g-front-garden-dai027-dOVD8w6n9yt7GNB8.jpg",
    alt: "Front Garden Path",
    category: "front-garden",
    sortOrder: 2
  },
  
  // Koggala Lake Ahangama and Surrounding
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1080,fit=crop/AGB2Mlr1kBCLQG4w/koggala-lake-boat-ride-AvQ70njKxkUjwyPL.jpg",
    alt: "Koggala Lake Aerial View",
    category: "koggala-lake",
    featured: true,
    sortOrder: 1
  },
  {
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1281,fit=crop/AGB2Mlr1kBCLQG4w/unnamed-3-Y74lE4MpkGI21JvB.jpg",
    alt: "Koggala Lake Sunset",
    category: "koggala-lake",
    sortOrder: 2
  }
];

// Function to download an image and save it to the local file system
const downloadImage = (imageUrl, destination) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    console.log(`Downloading: ${imageUrl} to ${destination}`);
    
    https.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://kolakehouse.com/',
      }
    }, (response) => {
      // Check if the response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      // Pipe the response to the file
      response.pipe(file);
      
      // Handle file events
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve(destination);
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
};

// Function to process all images
const processAllImages = async () => {
  // Create directories for each category
  const processedImages = [];
  
  for (const image of galleryImages) {
    try {
      // Create directory for category if it doesn't exist
      const categoryDir = path.join(__dirname, 'uploads', 'gallery', image.category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Extract filename from URL and sanitize it
      const urlParts = image.imageUrl.split('/');
      const originalFilename = urlParts[urlParts.length - 1];
      const filename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Create destination path
      const destination = path.join(categoryDir, filename);
      
      // Download the image
      await downloadImage(image.imageUrl, destination);
      
      // Create relative path for database
      const relativePath = `/uploads/gallery/${image.category}/${filename}`;
      
      // Add processed image information to the list
      processedImages.push({
        ...image,
        originalImageUrl: image.imageUrl,
        imageUrl: relativePath,
        localPath: destination
      });
      
    } catch (error) {
      console.error(`Failed to process image ${image.imageUrl}:`, error);
    }
  }
  
  // Save the processed images list to a JSON file for reference
  const outputPath = path.join(__dirname, 'downloads', 'processed-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedImages, null, 2));
  
  console.log(`Processed ${processedImages.length} images out of ${galleryImages.length}`);
  console.log(`Results saved to ${outputPath}`);
  
  return processedImages;
};

// Run the script
processAllImages().then((processedImages) => {
  console.log('Done!');
}).catch((error) => {
  console.error('Error processing images:', error);
});