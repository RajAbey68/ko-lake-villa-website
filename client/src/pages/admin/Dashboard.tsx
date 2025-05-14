import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { logOut } from '../../lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Spinner } from '../../components/ui/spinner';
import { 
  HomeIcon, 
  LayoutDashboardIcon, 
  LogOutIcon, 
  MailIcon, 
  CalendarRangeIcon, 
  ImageIcon, 
  UsersIcon 
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logOut();
      // Redirect will happen automatically via auth context
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Admin Header */}
      <header className="bg-[#8B5E3C] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboardIcon className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Ko Lake Villa Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser?.photoURL && (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            )}
            <span className="hidden md:inline">{currentUser?.displayName || currentUser?.email}</span>
            <Button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#8B5E3C]"
              size="sm"
            >
              {isLoggingOut ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <LogOutIcon className="w-4 h-4 mr-2" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <nav className="space-y-2">
              <Link href="/admin/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-md text-[#8B5E3C] hover:bg-[#FDF6EE] font-medium">
                <LayoutDashboardIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <a 
                href="/" 
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-[#8B5E3C] hover:bg-[#FDF6EE] font-medium" 
                target="_blank"
              >
                <HomeIcon className="w-5 h-5" />
                <span>View Website</span>
              </a>
              <hr className="my-3 border-gray-200" />
              
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'bookings' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <CalendarRangeIcon className="w-5 h-5" />
                <span>Bookings</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'messages' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <MailIcon className="w-5 h-5" />
                <span>Messages</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'gallery' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Gallery</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'subscribers' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                <span>Subscribers</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Admin'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Pending Bookings</CardTitle>
                      <CardDescription>Booking requests awaiting review</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#FF914D]">3</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Unread Messages</CardTitle>
                      <CardDescription>Contact messages to respond to</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#FF914D]">5</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Newsletter Subscribers</CardTitle>
                      <CardDescription>Total subscriber count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#FF914D]">42</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest events on your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CalendarRangeIcon className="w-5 h-5 text-[#FF914D] mt-0.5" />
                        <div>
                          <p className="font-medium">New booking request</p>
                          <p className="text-sm text-gray-500">Robert Moore booked the Family Suite for Jun 15-20, 2025</p>
                          <p className="text-xs text-gray-400">Today, 2:34 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MailIcon className="w-5 h-5 text-[#FF914D] mt-0.5" />
                        <div>
                          <p className="font-medium">New contact message</p>
                          <p className="text-sm text-gray-500">Sarah Williams asked about wheelchair accessibility</p>
                          <p className="text-xs text-gray-400">Today, 11:20 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <UsersIcon className="w-5 h-5 text-[#FF914D] mt-0.5" />
                        <div>
                          <p className="font-medium">New newsletter subscriber</p>
                          <p className="text-sm text-gray-500">james.wilson@example.com joined your mailing list</p>
                          <p className="text-xs text-gray-400">Yesterday, 5:42 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>Manage booking requests and availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">Bookings management functionality will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Messages</CardTitle>
                    <CardDescription>View and respond to contact form submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">Contact messages functionality will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gallery">
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Gallery Management</CardTitle>
                      <CardDescription>Upload and organize photos for your website</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsAddingImage(true)}
                      className="bg-[#FF914D] hover:bg-[#e67e3d]"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Add New Image
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <GalleryManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subscribers">
                <Card>
                  <CardHeader>
                    <CardTitle>Newsletter Subscribers</CardTitle>
                    <CardDescription>Manage your email subscribers list</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">Subscriber management functionality will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}