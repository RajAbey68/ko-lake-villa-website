import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'en' | 'si' | 'ta' | 'zh' | 'ru';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Language provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // English translations
    'home': 'Home',
    'accommodation': 'Accommodation',
    'dining': 'Dining',
    'experiences': 'Experiences',
    'gallery': 'Gallery',
    'contact': 'Contact',
    'book_now': 'Book Now',
    'admin': 'Admin',
    'welcome': 'Welcome to Ko Lake House',
    'welcome_description': 'Experience luxury lakeside living at Ko Lake House, offering elegant accommodations and personalized experiences in a serene setting.',
    'discover_rooms': 'Discover Our Rooms',
    'about_us': 'About Us',
    'about_description': 'Ko Lake House is a boutique accommodation nestled on the shores of Koggala Lake, offering a perfect blend of luxury, comfort, and natural beauty.',
    'our_location': 'Our Location',
    'contact_us': 'Contact Us',
    'email': 'Email',
    'phone': 'Phone',
    'address': 'Address',
  },
  si: {
    // Sinhala translations
    'home': 'මුල් පිටුව',
    'accommodation': 'නවාතැන්',
    'dining': 'ආහාර',
    'experiences': 'අත්දැකීම්',
    'gallery': 'ගැලරිය',
    'contact': 'සම්බන්ධ වන්න',
    'book_now': 'දැන් වෙන් කරන්න',
    'admin': 'පරිපාලක',
    'welcome': 'කෝ වැව නිවසට සාදරයෙන් පිළිගනිමු',
    'welcome_description': 'කෝ වැව නිවසේ සුපිරි වැව ජීවිතය අත්විඳින්න, සුඛෝපභෝගී නවාතැන් පහසුකම් සහ පුද්ගලීකරණය කළ අත්දැකීම් ප්‍රශාන්ත පරිසරයක ලබා දෙයි.',
    'discover_rooms': 'අපගේ කාමර සොයා ගන්න',
    'about_us': 'අප ගැන',
    'about_description': 'කෝ වැව නිවස යනු කෝග්ගල වැව ඉවුරේ පිහිටා ඇති සුපිරි නවාතැන්පොළකි, සුඛෝපභෝගය, සුව පහසුව සහ ස්වාභාවික සුන්දරත්වය යන කරුණු මනාව ඒකාබද්ධ වී ඇත.',
    'our_location': 'අපගේ ස්ථානය',
    'contact_us': 'අප හා සම්බන්ධ වන්න',
    'email': 'විද්‍යුත් තැපෑල',
    'phone': 'දුරකථන',
    'address': 'ලිපිනය',
  },
  ta: {
    // Tamil translations
    'home': 'முகப்பு',
    'accommodation': 'தங்குமிடம்',
    'dining': 'உணவகம்',
    'experiences': 'அனுபவங்கள்',
    'gallery': 'கேலரி',
    'contact': 'தொடர்பு',
    'book_now': 'இப்போது முன்பதிவு செய்',
    'admin': 'நிர்வாகம்',
    'welcome': 'கோ ஏரி இல்லத்திற்கு வரவேற்கிறோம்',
    'welcome_description': 'கோ ஏரி இல்லத்தில் சொகுசு ஏரி வாழ்க்கையை அனுபவியுங்கள், அமைதியான சூழலில் கண்ணியமான தங்குமிடங்களையும் தனிப்பயனாக்கப்பட்ட அனுபவங்களையும் வழங்குகிறது.',
    'discover_rooms': 'எங்கள் அறைகளைக் கண்டறியுங்கள்',
    'about_us': 'எங்களைப் பற்றி',
    'about_description': 'கோ ஏரி இல்லம் கொக்கலா ஏரியின் கரையில் அமைந்துள்ள ஒரு பௌடிக் தங்குமிடமாகும், இது சொகுசு, ஆறுதல் மற்றும் இயற்கை அழகின் சரியான கலவையை வழங்குகிறது.',
    'our_location': 'எங்கள் இடம்',
    'contact_us': 'எங்களை தொடர்பு கொள்ள',
    'email': 'மின்னஞ்சல்',
    'phone': 'தொலைபேசி',
    'address': 'முகவரி',
  },
  zh: {
    // Chinese translations
    'home': '首页',
    'accommodation': '住宿',
    'dining': '餐饮',
    'experiences': '体验',
    'gallery': '画廊',
    'contact': '联系我们',
    'book_now': '立即预订',
    'admin': '管理员',
    'welcome': '欢迎来到科湖别墅',
    'welcome_description': '在科湖别墅体验豪华的湖畔生活，在宁静的环境中提供优雅的住宿和个性化的体验。',
    'discover_rooms': '探索我们的客房',
    'about_us': '关于我们',
    'about_description': '科湖别墅是一家位于科加拉湖岸边的精品住宿，提供奢华、舒适和自然美景的完美结合。',
    'our_location': '我们的位置',
    'contact_us': '联系我们',
    'email': '电子邮件',
    'phone': '电话',
    'address': '地址',
  },
  ru: {
    // Russian translations
    'home': 'Домой',
    'accommodation': 'Размещение',
    'dining': 'Питание',
    'experiences': 'Впечатления',
    'gallery': 'Галерея',
    'contact': 'Контакт',
    'book_now': 'Забронировать',
    'admin': 'Админ',
    'welcome': 'Добро пожаловать в Ко Лейк Хаус',
    'welcome_description': 'Испытайте роскошную жизнь на берегу озера в Ко Лейк Хаус, предлагающем элегантное размещение и персонализированные впечатления в спокойной обстановке.',
    'discover_rooms': 'Узнайте о наших номерах',
    'about_us': 'О нас',
    'about_description': 'Ко Лейк Хаус - это бутик-отель, расположенный на берегу озера Коггала, предлагающий идеальное сочетание роскоши, комфорта и природной красоты.',
    'our_location': 'Наше местоположение',
    'contact_us': 'Свяжитесь с нами',
    'email': 'Электронная почта',
    'phone': 'Телефон',
    'address': 'Адрес',
  }
};

// Define the language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get saved language from local storage or use default (English)
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  // Save language preference to local storage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Also set html lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    // Return the translation if it exists, otherwise return the key
    return translations[language][key] || key;
  };

  // Provide the language context to all children
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);