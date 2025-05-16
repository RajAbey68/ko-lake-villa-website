import React, { useState } from 'react';

const SimpleLanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Flags for each language
  const languageFlags = {
    en: '🇬🇧',
    si: '🇱🇰',
    ta: '🇱🇰',
    zh: '🇨🇳',
    ru: '🇷🇺'
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center text-[#8B5E3C] hover:text-[#FF914D] transition-colors"
        aria-label="Select language"
      >
        <span className="mr-1 text-lg">
          {languageFlags.en}
        </span>
        <span className="hidden md:inline text-sm">EN</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 py-1">
          <button className="flex items-center w-full px-4 py-2 text-sm text-[#8B5E3C] hover:bg-gray-100">
            <span className="mr-2">{languageFlags.en}</span> English
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-[#8B5E3C] hover:bg-gray-100">
            <span className="mr-2">{languageFlags.si}</span> සිංහල
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-[#8B5E3C] hover:bg-gray-100">
            <span className="mr-2">{languageFlags.ta}</span> தமிழ்
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-[#8B5E3C] hover:bg-gray-100">
            <span className="mr-2">{languageFlags.zh}</span> 中文
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-[#8B5E3C] hover:bg-gray-100">
            <span className="mr-2">{languageFlags.ru}</span> Русский
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleLanguageSwitcher;