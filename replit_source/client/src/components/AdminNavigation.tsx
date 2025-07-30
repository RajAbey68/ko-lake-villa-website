import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Settings, 
  Image, 
  BarChart3, 
  FileText, 
  Calendar,
  Upload,
  Users,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const AdminNavigation = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/statistics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/content-manager', label: 'Content', icon: FileText },
    { href: '/admin/calendar', label: 'Bookings', icon: Calendar },
    { href: '/admin/bulk-uploader', label: 'Upload', icon: Upload },
    { href: '/admin/visitor-uploads', label: 'Visitor Media', icon: Users },
  ];

  const publicMenuItems = [
    { href: '/', label: 'Home' },
    { href: '/accommodation', label: 'Accommodation' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/dining', label: 'Dining' },
    { href: '/contact', label: 'Contact' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="nav-admin-header">
      <div className="nav-container">
        <div className="nav-admin-content">
          <div className="nav-admin-brand">
            <Link href="/admin" className="nav-admin-logo">
              <div className="nav-admin-logo-icon">
                <span className="text-white font-bold text-sm">KL</span>
              </div>
              <span className="nav-admin-logo-text">Ko Lake Villa Admin</span>
            </Link>
            
            <nav className="nav-admin-menu">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-admin-link",
                      location === item.href ? "nav-admin-link-active" : "nav-admin-link-inactive"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="nav-actions">
            <Link
              href="/"
              className="text-amber-700 hover:text-orange-500 text-sm font-medium transition-colors"
            >
              View Site
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            <button
              className="nav-mobile-button md:hidden"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="nav-mobile md:hidden">
            <nav className="nav-mobile-menu">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-mobile-link",
                      location === item.href ? "nav-mobile-link-active" : "nav-mobile-link-inactive"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="nav-mobile-contact">
                <Link
                  href="/"
                  className="nav-mobile-contact-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Site
                </Link>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="nav-mobile-contact-link text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavigation;