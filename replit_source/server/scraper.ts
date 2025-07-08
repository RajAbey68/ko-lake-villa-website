import axios from 'axios';
import * as cheerio from 'cheerio';
import { Request, Response } from 'express';

// Function to scrape website content
async function scrapeWebsite(url: string) {
  try {
    // Fetch the HTML content of the website
    const response = await axios.get(url);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Extract relevant information
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract all paragraphs of text
    const paragraphs: string[] = [];
    $('p').each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });
    
    // Extract main headings
    const headings: string[] = [];
    $('h1, h2, h3').each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        headings.push(text);
      }
    });
    
    // Extract image URLs
    const images: string[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        // Handle relative URLs
        if (src.startsWith('/')) {
          images.push(`${new URL(url).origin}${src}`);
        } else if (!src.startsWith('http')) {
          images.push(`${url.endsWith('/') ? url.slice(0, -1) : url}/${src}`);
        } else {
          images.push(src);
        }
      }
    });
    
    return {
      title,
      metaDescription,
      paragraphs,
      headings,
      images,
      url
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error;
  }
}

// Express route handler to scrape a website
export const scrapeWebsiteHandler = async (req: Request, res: Response) => {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ 
      error: 'URL parameter is required and must be a string' 
    });
  }
  
  try {
    const scrapedData = await scrapeWebsite(url);
    res.json({ data: scrapedData });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape website', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Function to scrape multiple websites
export const scrapeMultipleWebsites = async (req: Request, res: Response) => {
  const { urls } = req.body;
  
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ 
      error: 'URLs array is required in request body' 
    });
  }
  
  try {
    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          return await scrapeWebsite(url);
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          return {
            url,
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
          };
        }
      })
    );
    
    res.json({ data: results });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape websites', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};