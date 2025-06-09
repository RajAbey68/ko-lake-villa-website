import { Link, useLocation } from 'wouter';
import { Home, ArrowLeft, User, Settings, Image, Calendar, FileText, BarChart3 } from 'lucide-react';

interface AdminNavigationProps {
  title?: string;
}

export function AdminNavigation({ title = "Admin Panel" }: AdminNavigationProps) {
  const [location] = useLocation();

  const navigationItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/gallery', label: 'Gallery', icon: Image },
    { path: '/admin/content', label: 'Content', icon: FileText },
    { path: '/admin/booking-calendar', label: 'Bookings', icon: Calendar },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: Settings },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Navigation */}
          <div className="flex items-center space-x-4">
            {/* Home button */}
            <Link href="/" className="flex items-center text-gray-600 hover:text-[#8B5E3C] transition-colors">
              <Home className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Website</span>
            </Link>
            
            {/* Back to Admin Dashboard */}
            {location !== '/admin' && (
              <Link href="/admin" className="flex items-center text-gray-600 hover:text-[#8B5E3C] transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* Page title */}
            <div className="flex items-center">
              <div className="h-6 border-l border-gray-300 mx-4"></div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Right side - Quick navigation */}
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#8B5E3C] text-white'
                      : 'text-gray-600 hover:text-[#8B5E3C] hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* User menu */}
            <div className="flex items-center ml-4 pl-4 border-l border-gray-300">
              <button className="flex items-center text-gray-600 hover:text-[#8B5E3C] transition-colors">
                <User className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavigation;