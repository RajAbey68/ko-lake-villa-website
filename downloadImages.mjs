import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// URLs to scrape images from
const websites = [
  {
    url: "https://www.KoggalaNinePeaks.com",
    name: "KoggalaNinePeaks"
  },
  {
    url: "https://www.KolakeHouse.com",
    name: "KoLakeHouse"
  }
];

// Gallery categories
const categories = [
  'family-suite',
  'group-room',
  'triple-room',
  'dining-area',
  'pool-deck',
  'lake-garden',
  'roof-garden',
  'front-garden',
  'koggala-lake',
  'excursions'
];

// Ensure all category directories exist
function ensureDirectoriesExist() {
  categories.forEach(category => {
    const dir = path.join(__dirname, 'uploads', 'gallery', category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Download an image to a specific category
async function downloadImage(imageUrl, website, index, category) {
  try {
    // Clean up the URL and create a filename
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname;
    const extension = path.extname(pathname) || '.jpg'; // Default to .jpg if no extension
    
    // Create a unique filename based on website, category and index
    const filename = `${website}_${category}_${index}${extension}`;
    const outputPath = path.join(__dirname, 'uploads', 'gallery', category, filename);
    
    console.log(`Downloading: ${imageUrl} to ${outputPath}`);
    
    // Download the image
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream'
    });
    
    // Save the image
    const writer = createWriteStream(outputPath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✓ Downloaded ${filename}`);
        resolve(outputPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${imageUrl}:`, error.message);
    return null;
  }
}

// Scrape images from a website and assign to categories
async function scrapeAndDownloadImages(website) {
  try {
    console.log(`Scraping images from ${website.url}`);
    
    const response = await axios.get(website.url);
    const $ = cheerio.load(response.data);
    
    // Find all image elements
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http') && 
          !src.includes('icon') && 
          !src.includes('svg') && 
          !src.includes('logo')) {
        images.push(src);
      }
    });
    
    console.log(`Found ${images.length} images on ${website.name}`);
    
    // Download a subset of images to each category
    const imagesPerCategory = Math.max(1, Math.floor(images.length / categories.length));
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const startIndex = i * imagesPerCategory;
      const endIndex = Math.min(startIndex + imagesPerCategory, images.length);
      
      console.log(`Downloading ${endIndex - startIndex} images to category: ${category}`);
      
      for (let j = startIndex; j < endIndex; j++) {
        await downloadImage(images[j], website.name, j - startIndex, category);
      }
    }
    
    console.log(`Completed downloads from ${website.name}`);
  } catch (error) {
    console.error(`Error scraping ${website.url}:`, error.message);
  }
}

// Main function
async function main() {
  ensureDirectoriesExist();
  
  for (const website of websites) {
    await scrapeAndDownloadImages(website);
  }
  
  console.log('Image download process completed.');
}

main();