import React from 'react';

const SimpleLanguageSwitcher: React.FC = () => {
  // For now, just display the flags without functionality
  // We'll integrate with proper language switching later
  return (
    <div className="flex space-x-1">
      <button className="p-1 rounded hover:bg-gray-100" title="English">
        🇬🇧
      </button>
      <button className="p-1 rounded hover:bg-gray-100" title="සිංහල">
        🇱🇰
      </button>
      <button className="p-1 rounded hover:bg-gray-100" title="தமிழ்">
        🇮🇳
      </button>
      <button className="p-1 rounded hover:bg-gray-100" title="中文">
        🇨🇳
      </button>
      <button className="p-1 rounded hover:bg-gray-100" title="Русский">
        🇷🇺
      </button>
    </div>
  );
};

export default SimpleLanguageSwitcher;