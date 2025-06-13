interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class ServerCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtl = 5 * 60 * 1000; // 5 minutes default
  
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl
    };
    this.cache.set(key, entry);
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const serverCache = new ServerCache();

// Cache keys constants
export const CACHE_KEYS = {
  GALLERY_ALL: 'gallery:all',
  GALLERY_CATEGORY: (category: string) => `gallery:category:${category}`,
  ROOMS: 'rooms:all',
  ACTIVITIES: 'activities:all',
  TESTIMONIALS: 'testimonials:all',
  CONTENT: 'content:all'
} as const;

// Cache TTL constants (in milliseconds) - Reduced for better responsiveness
export const CACHE_TTL = {
  SHORT: 30 * 1000,          // 30 seconds
  MEDIUM: 2 * 60 * 1000,     // 2 minutes  
  LONG: 5 * 60 * 1000,       // 5 minutes
  STATIC: 15 * 60 * 1000     // 15 minutes
} as const;