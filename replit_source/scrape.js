import axios from "axios";
import cheerio from "cheerio";

// URLs to scrape - Updated to use KLV (Ko Lake Villa) listings only
const urls = [
  "https://www.airbnb.co.uk/h/klv", // Ko Lake Villa main listing
  "https://www.airbnb.co.uk/h/klv1", // Ko Lake Villa family suite
  "https://www.airbnb.co.uk/h/klv3", // Ko Lake Villa twin/triple rooms
  "https://www.airbnb.co.uk/h/klv6" // Ko Lake Villa group room
];

async function scrapeWebsite(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    console.log("\n=== TITLES ===");
    $("h1, h2, h3").each((i, el) => {
      console.log($(el).text().trim());
    });

    console.log("\n=== DESCRIPTIONS ===");
    $("p, div[data-testid='listing-description']").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 30) { // Only longer paragraphs to avoid buttons/labels
        console.log(text);
      }
    });

    console.log("\n=== IMAGES ===");
    $("img").each((i, el) => {
      const src = $(el).attr("src");
      if (src && src.startsWith("http") && i < 10) { // Limit to 10 images
        console.log(src);
      }
    });

    console.log("\n=== AMENITIES ===");
    $("[data-testid='amenities-section'] li, .amenities li").each((i, el) => {
      console.log($(el).text().trim());
    });
    
    console.log("\n---------------------------------\n");
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
  }
}

// Execute the scraping for all URLs
async function runScraper() {
  for (const url of urls) {
    await scrapeWebsite(url);
  }
}

runScraper();