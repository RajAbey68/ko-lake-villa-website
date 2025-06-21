import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  showBackButton?: boolean;
  customBackAction?: () => void;
  customBackLabel?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

const NavigationBar = ({ 
  showBackButton = true, 
  customBackAction, 
  customBackLabel,
  breadcrumbs,
  className 
}: NavigationBarProps) => {
  const [location, navigate] = useLocation();

  const handleBackClick = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      window.history.back();
    }
  };

  const handleForwardClick = () => {
    window.history.forward();
  };

  // Define page titles for breadcrumb generation
  const pageNames: Record<string, string> = {
    '/': 'Home',
    '/deals': 'Deals',
    '/accommodation': 'Accommodation',
    '/dining': 'Dining',
    '/experiences': 'Experiences',
    '/gallery': 'Gallery',
    '/contact': 'Contact',
    '/faq': 'FAQ',
    '/booking': 'Booking',
    '/admin': 'Admin'
  };

  // Auto-generate breadcrumbs if not provided
  const defaultBreadcrumbs = () => {
    const pathSegments = location.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const label = pageNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, href: currentPath });
    });
    
    return crumbs;
  };

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs();

  return (
    <div className={cn(
      "bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between",
      className
    )}>
      {/* Left section - Back/Forward buttons */}
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-[#8B5E3C] hover:bg-[#E8B87D]/10 rounded transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{customBackLabel || 'Back'}</span>
          </button>
        )}
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleBackClick}
            className="p-1.5 text-gray-500 hover:text-[#8B5E3C] hover:bg-gray-100 rounded transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleForwardClick}
            className="p-1.5 text-gray-500 hover:text-[#8B5E3C] hover:bg-gray-100 rounded transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center section - Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm">
        {displayBreadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-400" />
            )}
            {crumb.href && index < displayBreadcrumbs.length - 1 ? (
              <Link 
                href={crumb.href}
                className="text-[#8B5E3C] hover:text-[#FF914D] transition-colors"
              >
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-600 font-medium">
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Right section - Page actions */}
      <div className="flex items-center space-x-2">
        <Link
          href="/"
          className="p-1.5 text-[#8B5E3C] hover:bg-[#E8B87D]/10 rounded transition-colors"
          title="Go to homepage"
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;