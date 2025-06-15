export const fallbackLanguage = 'en';

export const translations: Record<string, Record<string, string>> = {
  en: { welcome: 'Welcome', booking: 'Book Now' },
  si: { welcome: 'සාදරයෙන් පිළිගනිමු', booking: 'දැන් වෙන්කරන්න' },
  ar: { welcome: 'مرحبا', booking: 'احجز الآن' },
  zh: { welcome: '欢迎', booking: '立即预订' },
  ru: { welcome: 'Добро пожаловать', booking: 'Забронировать' },
};

export function t(key: string, lang: string) {
  return translations[lang]?.[key] || translations[fallbackLanguage][key] || key;
}
