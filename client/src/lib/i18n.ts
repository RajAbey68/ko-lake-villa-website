export const fallbackLanguage = 'en';

export const translations: Record<string, Record<string, string>> = {
  en: { 
    welcome: 'Welcome to Ko Lake Villa',
    booking: 'Book Now',
    gallery: 'Photo Gallery',
    experiences: 'Local Experiences',
    accommodation: 'Accommodation',
    contact: 'Contact Us',
    about: 'About Villa',
    amenities: 'Amenities'
  },
  si: { 
    welcome: 'කෝ ලේක් විල්ලා වෙත සාදරයෙන් පිළිගනිමු',
    booking: 'දැන් වෙන්කරන්න',
    gallery: 'ඡායාරූප ගැලරිය',
    experiences: 'ප්‍රාදේශීය අත්දැකීම්',
    accommodation: 'නවාතැන්',
    contact: 'අප හා සම්බන්ධ වන්න',
    about: 'විල්ලා ගැන',
    amenities: 'පහසුකම්'
  },
  ar: { 
    welcome: 'مرحباً بكم في كو ليك فيلا',
    booking: 'احجز الآن',
    gallery: 'معرض الصور',
    experiences: 'التجارب المحلية',
    accommodation: 'الإقامة',
    contact: 'اتصل بنا',
    about: 'عن الفيلا',
    amenities: 'المرافق'
  },
  zh: { 
    welcome: '欢迎来到高湖别墅',
    booking: '立即预订',
    gallery: '照片画廊',
    experiences: '当地体验',
    accommodation: '住宿',
    contact: '联系我们',
    about: '关于别墅',
    amenities: '设施'
  },
  ru: { 
    welcome: 'Добро пожаловать в Ко Лейк Вилла',
    booking: 'Забронировать',
    gallery: 'Фотогалерея',
    experiences: 'Местные впечатления',
    accommodation: 'Размещение',
    contact: 'Связаться с нами',
    about: 'О вилле',
    amenities: 'Удобства'
  }
};

export function t(key: string, lang: string = fallbackLanguage): string {
  return translations[lang]?.[key] || translations[fallbackLanguage][key] || key;
}

export function getCurrentLanguage(): string {
  return localStorage.getItem('language') || fallbackLanguage;
}

export function setLanguage(lang: string): void {
  localStorage.setItem('language', lang);
}