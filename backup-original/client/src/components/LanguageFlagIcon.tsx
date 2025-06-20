import React from 'react';

interface LanguageFlagIconProps {
  className?: string;
}

/**
 * A simple language switcher component with flag icons
 */
const LanguageFlagIcon: React.FC<LanguageFlagIconProps> = ({ className = '' }) => {
  // Simple dropdown for language selection with flags
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <button className="p-1 rounded hover:bg-gray-100" title="English">
          🇬🇧
        </button>
        <button className="p-1 rounded hover:bg-gray-100" title="සිංහල">
          🇱🇰
        </button>
        <button className="p-1 rounded hover:bg-gray-100" title="தமிழ்">
          🇱🇰
        </button>
        <button className="p-1 rounded hover:bg-gray-100" title="中文">
          🇨🇳
        </button>
        <button className="p-1 rounded hover:bg-gray-100" title="Русский">
          🇷🇺
        </button>
      </div>
    </div>
  );
};

export default LanguageFlagIcon;