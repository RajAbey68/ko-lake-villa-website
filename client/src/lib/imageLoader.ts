/**
 * Image Loading System - Ensures real images load instead of placeholders
 */

export interface ImageLoadResult {
  src: string;
  isValid: boolean;
  errorMessage?: string;
}

export class ImageLoader {
  private static cache = new Map<string, ImageLoadResult>();

  static async validateImageUrl(url: string): Promise<ImageLoadResult> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    try {
      // Test if image loads
      const result = await this.testImageLoad(url);
      this.cache.set(url, result);
      return result;
    } catch (error) {
      const failResult = { src: url, isValid: false, errorMessage: error instanceof Error ? error.message : 'Unknown error' };
      this.cache.set(url, failResult);
      return failResult;
    }
  }

  private static testImageLoad(url: string): Promise<ImageLoadResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ src: url, isValid: true });
      };
      
      img.onerror = () => {
        reject(new Error(`Image failed to load: ${url}`));
      };
      
      // Set timeout to avoid hanging
      setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, 5000);
      
      img.src = url;
    });
  }

  static getValidImageUrl(originalUrl: string): string {
    // Fix common URL issues
    if (!originalUrl) return '';
    
    // Ensure proper path formatting
    let fixedUrl = originalUrl;
    
    // Fix double slashes
    fixedUrl = fixedUrl.replace(/([^:]\/)\/+/g, '$1');
    
    // Ensure absolute path starts with /
    if (!fixedUrl.startsWith('http') && !fixedUrl.startsWith('/')) {
      fixedUrl = '/' + fixedUrl;
    }
    
    return fixedUrl;
  }

  static clearCache() {
    this.cache.clear();
  }
}

export default ImageLoader;