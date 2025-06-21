/**
 * Ko Lake Villa - Global Fixes Implementation
 * Consolidated solution for ABnB links, card validation, staff rules, FAQ, and gallery
 */

/* ========================
   ABnB LINK TOGGLE FIX
   ======================== */
class ABnBLinkManager {
  constructor() {
    this.links = document.querySelectorAll('.abnb-link, [data-abnb-link]');
    this.setupListeners();
  }

  setupListeners() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const wasActive = link.classList.contains('active');
        this.toggleAllLinks();
        if (!wasActive) {
          link.classList.add('active');
          const url = link.href || link.dataset.url;
          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }
      });
    });
  }

  toggleAllLinks() {
    this.links.forEach(link => link.classList.remove('active'));
  }
}

/* ========================
   CARD VALIDATION FIX
   ======================== */
class CardValidator {
  static validate(cardNumber) {
    // Luhn Algorithm Implementation with enhanced security
    if (!cardNumber) return false;
    
    const sanitized = cardNumber.replace(/[\s-]/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) return false;

    let sum = 0;
    let isEven = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  static getCardType(cardNumber) {
    const sanitized = cardNumber.replace(/[\s-]/g, '');
    
    if (/^4/.test(sanitized)) return 'Visa';
    if (/^5[1-5]/.test(sanitized)) return 'MasterCard';
    if (/^3[47]/.test(sanitized)) return 'American Express';
    if (/^6(?:011|5)/.test(sanitized)) return 'Discover';
    
    return 'Unknown';
  }
}

/* ========================
   STAFF HARASSMENT RULES
   ======================== */
const staffProtectionRules = `
KO LAKE VILLA STAFF PROTECTION POLICY

1. ZERO TOLERANCE FOR HARASSMENT:
   • Any form of harassment, abuse, or inappropriate behavior towards staff is strictly prohibited
   • Violations result in immediate removal from premises and booking cancellation
   • No refunds will be provided for policy violations

2. REPORTING INCIDENTS:
   • Staff: Use emergency button or call management immediately
   • Guests: Report concerns to management at contact@KoLakeHouse.com
   • Include: Date, time, location, description, witnesses

3. EMERGENCY CONTACTS:
   • Management: +94 77 123 4567
   • Local Police: 119
   • Tourist Police: +94 11 242 1052

4. GUEST RESPONSIBILITIES:
   • Treat all staff with respect and courtesy
   • Follow property rules and guidelines
   • Report any concerning behavior immediately

Our staff's safety and dignity are paramount to providing exceptional hospitality.
`;

/* ========================
   FAQ CLEAR BUTTON FIX
   ======================== */
class FAQManager {
  constructor() {
    this.clearButton = document.getElementById('faq-clear') || document.querySelector('[data-faq-clear]');
    this.faqItems = document.querySelectorAll('.faq-item, [data-faq-item]');
    this.setupListeners();
  }

  setupListeners() {
    this.clearButton?.addEventListener('click', () => {
      this.clearAllFAQ();
    });
  }

  clearAllFAQ() {
    // Clear form inputs
    this.faqItems.forEach(item => {
      const inputs = item.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
    });

    // Clear accordion states
    document.querySelectorAll('.faq-accordion [data-state="open"]').forEach(item => {
      item.setAttribute('data-state', 'closed');
    });

    // Clear localStorage
    localStorage.removeItem('faqState');
    localStorage.removeItem('kolakevilla_faq_state');
    
    // Visual feedback
    this.showClearConfirmation();
  }

  showClearConfirmation() {
    const notification = document.createElement('div');
    notification.className = 'faq-clear-notification';
    notification.textContent = 'FAQ form cleared successfully';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 9999;
      animation: fadeInOut 3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

/* ========================
   GALLERY UPLOAD/REFRESH
   ======================== */
class GalleryManager {
  constructor() {
    this.uploadForm = document.getElementById('gallery-upload') || document.querySelector('[data-gallery-upload]');
    this.refreshBtn = document.getElementById('gallery-refresh') || document.querySelector('[data-gallery-refresh]');
    this.galleryGrid = document.querySelector('.gallery-grid, [data-gallery-grid]');
    this.setup();
  }

  setup() {
    this.uploadForm?.addEventListener('submit', this.handleUpload.bind(this));
    this.refreshBtn?.addEventListener('click', this.refreshGallery.bind(this));
  }

  async handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(this.uploadForm);
    const submitButton = this.uploadForm.querySelector('[type="submit"]');
    
    // Add loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Uploading...';
    }
    
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        this.showUploadSuccess();
        this.uploadForm.reset();
        await this.refreshGallery();
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      this.showUploadError(error.message);
    } finally {
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Upload';
      }
    }
  }

  async refreshGallery() {
    if (this.galleryGrid) {
      // Add loading state to gallery
      this.galleryGrid.style.opacity = '0.5';
      
      try {
        // Trigger React component refresh or reload
        if (window.location.pathname.includes('/gallery')) {
          window.location.reload();
        } else {
          // If using React, dispatch custom event
          window.dispatchEvent(new CustomEvent('galleryRefresh'));
        }
      } catch (error) {
        console.error('Gallery refresh failed:', error);
      } finally {
        this.galleryGrid.style.opacity = '1';
      }
    }
  }

  showUploadSuccess() {
    this.showNotification('Image uploaded successfully!', 'success');
  }

  showUploadError(message) {
    this.showNotification(`Upload failed: ${message}`, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `gallery-notification gallery-notification-${type}`;
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 9999;
      animation: fadeInOut 4s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }
}

/* ========================
   BOOKING VALIDATION
   ======================== */
class BookingValidator {
  static validateDates(checkIn, checkOut) {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Check if dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return { valid: false, message: 'Please enter valid dates' };
    }
    
    // Check if check-in is not in the past
    if (checkInDate < today) {
      return { valid: false, message: 'Check-in date cannot be in the past' };
    }
    
    // Check if check-out is after check-in
    if (checkOutDate <= checkInDate) {
      return { valid: false, message: 'Check-out date must be after check-in date' };
    }
    
    // Calculate nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    return { valid: true, nights };
  }
}

/* ========================
   INITIALIZATION
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize ABnB Links
  if (document.querySelector('.abnb-link, [data-abnb-link]')) {
    new ABnBLinkManager();
  }

  // Initialize FAQ Manager
  if (document.getElementById('faq-clear') || document.querySelector('[data-faq-clear]')) {
    new FAQManager();
  }

  // Initialize Gallery Manager
  if (document.getElementById('gallery-upload') || document.querySelector('[data-gallery-upload]')) {
    new GalleryManager();
  }

  // Card Validation Example
  const cardInput = document.getElementById('card-number');
  const validateButton = document.getElementById('validate-card');
  
  if (cardInput && validateButton) {
    validateButton.addEventListener('click', () => {
      const cardNumber = cardInput.value;
      const isValid = CardValidator.validate(cardNumber);
      const cardType = CardValidator.getCardType(cardNumber);
      
      const message = isValid ? 
        `Valid ${cardType} card number` : 
        'Invalid card number';
      
      alert(message);
    });
  }

  // Staff Rules Injection
  const staffRulesElement = document.getElementById('staff-rules') || document.querySelector('[data-staff-rules]');
  if (staffRulesElement) {
    staffRulesElement.textContent = staffProtectionRules;
  }

  // Booking date validation
  const bookingForm = document.querySelector('[data-booking-form]');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      const checkIn = bookingForm.querySelector('[name="checkIn"]')?.value;
      const checkOut = bookingForm.querySelector('[name="checkOut"]')?.value;
      
      if (checkIn && checkOut) {
        const validation = BookingValidator.validateDates(checkIn, checkOut);
        if (!validation.valid) {
          e.preventDefault();
          alert(validation.message);
        }
      }
    });
  }
});

/* ========================
   EMBEDDED STYLES
   ======================== */
const style = document.createElement('style');
style.textContent = `
  .abnb-link {
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }
  
  .abnb-link.active {
    background: #FF5A5F;
    color: white;
    transform: scale(1.05);
  }
  
  .abnb-link:hover {
    opacity: 0.8;
  }
  
  #staff-rules, [data-staff-rules] {
    white-space: pre-line;
    padding: 20px;
    background: #f8f9fa;
    border-left: 4px solid #FF914D;
    margin: 16px 0;
    font-family: monospace;
    border-radius: 4px;
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translateY(-20px); }
    10%, 90% { opacity: 1; transform: translateY(0); }
  }
  
  .gallery-notification, .faq-clear-notification {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-weight: 500;
  }
  
  .card-input {
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }
  
  .loading-overlay {
    position: relative;
  }
  
  .loading-overlay::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

document.head.appendChild(style);

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ABnBLinkManager,
    CardValidator,
    FAQManager,
    GalleryManager,
    BookingValidator
  };
}