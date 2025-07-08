import DOMPurify from 'dompurify';

// Configure DOMPurify with security settings
const sanitizeConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span'],
  ALLOWED_ATTR: ['href', 'title', 'alt'],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param content - Raw HTML content
 * @returns Sanitized HTML content
 */
export const sanitizeHtml = (content: string): string => {
  if (!content) return '';
  return DOMPurify.sanitize(content, sanitizeConfig);
};

/**
 * Sanitize text content for safe display
 * @param text - Raw text content
 * @returns Sanitized text content
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  // Remove HTML tags and decode entities
  const div = document.createElement('div');
  div.innerHTML = text;
  const sanitized = div.textContent || div.innerText || '';
  
  // Additional sanitization for special characters
  return sanitized
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

/**
 * Validate and sanitize URLs
 * @param url - URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
};

/**
 * Sanitize image alt text and titles
 * @param alt - Alt text to sanitize
 * @returns Sanitized alt text
 */
export const sanitizeImageAlt = (alt: string): string => {
  if (!alt) return '';
  
  return alt
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .substring(0, 255); // Limit length
};