import React, { useState, useEffect } from 'react';

type Language = 'en' | 'si' | 'ta' | 'zh' | 'ru';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  // Get saved language from local storage or use default (English)
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Save language preference to local storage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Also set html lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);
  
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-[#8B5E3C] hover:text-[#FF914D] transition-colors"
        aria-label="Change language"
      >
        <span className="mr-1 text-lg">
          {language === 'en' && '🇬🇧'}
          {language === 'si' && '🇱🇰'}
          {language === 'ta' && '🇱🇰'}
          {language === 'zh' && '🇨🇳'}
          {language === 'ru' && '🇷🇺'}
        </span>
        <span className="hidden md:inline text-sm">{language.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          <button 
            onClick={() => changeLanguage('en')}
            className={`flex items-center w-full px-3 py-2 text-sm ${language === 'en' ? 'bg-[#A0B985] text-white' : 'hover:bg-gray-100'}`}
          >
            <span className="mr-2">🇬🇧</span> English
          </button>
          <button 
            onClick={() => changeLanguage('si')}
            className={`flex items-center w-full px-3 py-2 text-sm ${language === 'si' ? 'bg-[#A0B985] text-white' : 'hover:bg-gray-100'}`}
          >
            <span className="mr-2">🇱🇰</span> සිංහල
          </button>
          <button 
            onClick={() => changeLanguage('ta')}
            className={`flex items-center w-full px-3 py-2 text-sm ${language === 'ta' ? 'bg-[#A0B985] text-white' : 'hover:bg-gray-100'}`}
          >
            <span className="mr-2">🇱🇰</span> தமிழ்
          </button>
          <button 
            onClick={() => changeLanguage('zh')}
            className={`flex items-center w-full px-3 py-2 text-sm ${language === 'zh' ? 'bg-[#A0B985] text-white' : 'hover:bg-gray-100'}`}
          >
            <span className="mr-2">🇨🇳</span> 中文
          </button>
          <button 
            onClick={() => changeLanguage('ru')}
            className={`flex items-center w-full px-3 py-2 text-sm ${language === 'ru' ? 'bg-[#A0B985] text-white' : 'hover:bg-gray-100'}`}
          >
            <span className="mr-2">🇷🇺</span> Русский
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;