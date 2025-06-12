import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  HomeIcon, 
  UsersIcon, 
  GalleryVerticalIcon, 
  BarChartIcon, 
  CalendarIcon, 
  MessageSquareIcon, 
  MailIcon,
  LogOutIcon,
  DownloadIcon,
  TestTube as TestTubeIcon,
  CloudUploadIcon,
  Upload as UploadIcon,
  Video as VideoIcon,
  ChevronRightIcon,
  ListIcon,
  UserIcon,
  ClockIcon,
  CalendarDaysIcon,
  MapPinIcon,
  InfoIcon,
  FileTextIcon,
  TrendingUpIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';

export default function AdminLanding() {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  // State for modal dialogs
  const [visitorDetailsOpen, setVisitorDetailsOpen] = useState(false);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [messageDetailsOpen, setMessageDetailsOpen] = useState(false);
  
  useEffect(() => {
    // Development bypass for testing
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // Skip authentication in development
      return;
    }
    
    // If user is not authenticated and we're done loading, redirect to login
    if (!isLoading && !currentUser) {
      navigate('/admin/login');
    }
    
    // If user is authenticated but not an admin, redirect to home
    if (!isLoading && currentUser && !isAdmin) {
      navigate('/');
    }
  }, [currentUser, isLoading, isAdmin, navigate]);
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDF6EE]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF914D]"></div>
          <p className="mt-4 text-lg text-[#8B5E3C]">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Development bypass for testing
  const isDevelopment = import.meta.env.DEV;
  
  // If not logged in and not in development, don't render anything (redirect will happen)
  if (!isDevelopment && (!currentUser || !isAdmin)) {
    return null;
  }
  
  // Mock data for visitor details (in a real app, this would come from your database/API)
  const visitorData = [
    { id: 1, ip: "203.145.94.126", country: "Sri Lanka", city: "Colombo", timestamp: "Today, 15:42:18", page: "Home", device: "Mobile - iPhone" },
    { id: 2, ip: "157.240.229.35", country: "United States", city: "San Francisco", timestamp: "Today, 15:36:42", page: "Gallery", device: "Desktop - Chrome" },
    { id: 3, ip: "198.35.26.96", country: "India", city: "Mumbai", timestamp: "Today, 15:30:15", page: "Rooms", device: "Mobile - Android" },
    { id: 4, ip: "185.199.108.153", country: "United Kingdom", city: "London", timestamp: "Today, 15:22:07", page: "Contact", device: "Tablet - iPad" },
    { id: 5, ip: "104.244.42.129", country: "Germany", city: "Berlin", timestamp: "Today, 15:18:54", page: "Booking", device: "Desktop - Firefox" },
    { id: 6, ip: "140.82.113.25", country: "Australia", city: "Sydney", timestamp: "Today, 15:14:32", page: "Home", device: "Mobile - iPhone" },
    { id: 7, ip: "151.101.65.67", country: "Canada", city: "Toronto", timestamp: "Today, 15:09:19", page: "Gallery", device: "Desktop - Safari" },
    { id: 8, ip: "192.0.2.1", country: "Japan", city: "Tokyo", timestamp: "Today, 15:05:43", page: "Dining", device: "Mobile - Android" },
    { id: 9, ip: "198.51.100.1", country: "France", city: "Paris", timestamp: "Today, 14:56:21", page: "Activities", device: "Desktop - Edge" },
    { id: 10, ip: "203.0.113.1", country: "Sri Lanka", city: "Galle", timestamp: "Today, 14:51:09", page: "Home", device: "Mobile - Samsung" },
    // More entries would be here in a real application
  ];
  
  // Mock data for booking details
  const bookingData = [
    { id: 1, name: "John Smith", email: "john.smith@example.com", room: "Family Suite", guests: 4, checkIn: "2023-06-12", checkOut: "2023-06-16", status: "New", timestamp: "Today, 10:24 AM" },
    { id: 2, name: "Emily Wong", email: "emily.wong@example.com", room: "Triple Room", guests: 3, checkIn: "2023-06-15", checkOut: "2023-06-18", status: "New", timestamp: "Today, 09:15 AM" },
    { id: 3, name: "Michael Johnson", email: "michael.j@example.com", room: "Group Room", guests: 6, checkIn: "2023-06-20", checkOut: "2023-06-25", status: "New", timestamp: "Yesterday, 11:42 PM" },
  ];
  
  // Mock data for message details
  const messageData = [
    { id: 1, name: "Sarah Lee", email: "sarah.lee@example.com", subject: "Question about lake activities", message: "Hello, I'm planning to stay at Ko Lake Villa next month and I'm wondering what lake activities are available during my stay? Do you offer boat tours or kayaking? Thanks!", timestamp: "Today, 11:35 AM" },
    { id: 2, name: "Robert Chen", email: "robert.chen@example.com", subject: "Special dietary requirements", message: "Hi there, I have booked a stay for next week and wanted to inform you about my gluten-free dietary requirement. Would it be possible to accommodate this during my stay? Many thanks in advance.", timestamp: "Today, 09:42 AM" },
    { id: 3, name: "Maria Garcia", email: "maria.garcia@example.com", subject: "Airport transfer inquiry", message: "Good day! I'll be arriving at Colombo airport on the 18th. Do you provide airport transfer services? If yes, what is the cost and how can I arrange it? Looking forward to your reply.", timestamp: "Yesterday, 07:18 PM" },
    { id: 4, name: "David Kim", email: "david.kim@example.com", subject: "Late check-in possibility", message: "Hello, my flight arrives late in the evening around 11:30 PM. Is it possible to have a late check-in? Please let me know if any special arrangements need to be made. Thank you!", timestamp: "Yesterday, 03:55 PM" },
    { id: 5, name: "Emma Thompson", email: "emma.t@example.com", subject: "Reservation confirmation", message: "Hi, I made a booking for July 10-15 but haven't received a confirmation email yet. Could you please confirm if my reservation was processed successfully? My reference number is KLV-2023-0789. Thanks!", timestamp: "Yesterday, 01:20 PM" },
  ];
  
  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#8B5E3C]">Ko Lake Villa Admin Portal</h1>
            <p className="mt-2 text-[#8B5E3C]/80">
              Manage your website content, bookings, and analytics
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="mr-4 text-right">
              <p className="font-medium text-[#8B5E3C]">Welcome, {currentUser?.email || 'Development Admin'}</p>
              <p className="text-sm text-[#8B5E3C]/70">Admin User</p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                // Handle logout
                navigate('/admin/login');
              }}
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card 
            className="bg-white border border-[#A0B985]/20 hover:border-[#A0B985] cursor-pointer transform hover:shadow-md transition-all"
            onClick={() => setVisitorDetailsOpen(true)}
          >
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-medium text-[#8B5E3C]">Today's Visitors</CardTitle>
              <ChevronRightIcon className="h-5 w-5 text-[#8B5E3C]/50" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FF914D]">28</p>
              <p className="text-[#8B5E3C]/70 text-sm">+12% from yesterday</p>
              <p className="text-[#8B5E3C]/70 text-xs mt-2 flex items-center">
                <InfoIcon className="h-3 w-3 mr-1" /> Click for details
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white border border-[#A0B985]/20 hover:border-[#A0B985] cursor-pointer transform hover:shadow-md transition-all"
            onClick={() => setBookingDetailsOpen(true)}
          >
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-medium text-[#8B5E3C]">New Bookings</CardTitle>
              <ChevronRightIcon className="h-5 w-5 text-[#8B5E3C]/50" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FF914D]">3</p>
              <p className="text-[#8B5E3C]/70 text-sm">In the last 24 hours</p>
              <p className="text-[#8B5E3C]/70 text-xs mt-2 flex items-center">
                <InfoIcon className="h-3 w-3 mr-1" /> Click for details
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white border border-[#A0B985]/20 hover:border-[#A0B985] cursor-pointer transform hover:shadow-md transition-all"
            onClick={() => setMessageDetailsOpen(true)}
          >
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-medium text-[#8B5E3C]">Unread Messages</CardTitle>
              <ChevronRightIcon className="h-5 w-5 text-[#8B5E3C]/50" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FF914D]">5</p>
              <p className="text-[#8B5E3C]/70 text-sm">Awaiting response</p>
              <p className="text-[#8B5E3C]/70 text-xs mt-2 flex items-center">
                <InfoIcon className="h-3 w-3 mr-1" /> Click for details
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Visitor Details Dialog */}
        <Dialog open={visitorDetailsOpen} onOpenChange={setVisitorDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#8B5E3C]">Today's Visitors (28)</DialogTitle>
              <DialogDescription>
                Detailed breakdown of today's website visitors
              </DialogDescription>
            </DialogHeader>
            <div className="my-2">
              <ScrollArea className="h-[400px] rounded-md">
                <div className="space-y-2 p-2">
                  <div className="bg-[#FDF6EE] p-3 rounded-md grid grid-cols-6 font-medium text-[#8B5E3C]">
                    <div>Time</div>
                    <div>Country</div>
                    <div>City</div>
                    <div>IP Address</div>
                    <div>Page</div>
                    <div>Device</div>
                  </div>
                  {visitorData.map(visitor => (
                    <div key={visitor.id} className="p-3 rounded-md grid grid-cols-6 border-b border-[#A0B985]/10 hover:bg-[#FDF6EE]/50">
                      <div className="text-sm flex items-center gap-2">
                        <ClockIcon className="h-3 w-3 text-[#8B5E3C]/70" />
                        {visitor.timestamp}
                      </div>
                      <div className="text-sm">{visitor.country}</div>
                      <div className="text-sm">{visitor.city}</div>
                      <div className="text-sm text-[#8B5E3C]/80">{visitor.ip}</div>
                      <div className="text-sm">{visitor.page}</div>
                      <div className="text-sm">{visitor.device}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setVisitorDetailsOpen(false)}
                className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/80"
              >
                Close
              </Button>
              <Link href="/admin/statistics">
                <Button variant="outline" className="border-[#8B5E3C] text-[#8B5E3C]">
                  View Full Analytics
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Booking Details Dialog */}
        <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#8B5E3C]">New Bookings (3)</DialogTitle>
              <DialogDescription>
                Booking requests received in the last 24 hours
              </DialogDescription>
            </DialogHeader>
            <div className="my-2">
              <ScrollArea className="h-[400px] rounded-md">
                <div className="space-y-4 p-2">
                  {bookingData.map(booking => (
                    <div key={booking.id} className="p-4 rounded-md border border-[#A0B985]/20 hover:border-[#A0B985]/40 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-[#8B5E3C]">{booking.name}</h3>
                        <span className="bg-[#FF914D]/20 text-[#FF914D] text-xs px-2 py-1 rounded-full">
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-2 text-[#8B5E3C]/80">
                          <MailIcon className="h-3.5 w-3.5" />
                          {booking.email}
                        </div>
                        <div className="flex items-center gap-2 text-[#8B5E3C]/80">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {booking.timestamp}
                        </div>
                        <div className="flex items-center gap-2">
                          <HomeIcon className="h-3.5 w-3.5 text-[#8B5E3C]/80" />
                          <span className="font-medium">{booking.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-3.5 w-3.5 text-[#8B5E3C]/80" />
                          <span>{booking.guests} Guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="h-3.5 w-3.5 text-[#8B5E3C]/80" />
                          <span>Check-in: {booking.checkIn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="h-3.5 w-3.5 text-[#8B5E3C]/80" />
                          <span>Check-out: {booking.checkOut}</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" className="text-xs border-[#8B5E3C] text-[#8B5E3C]">
                          View Details
                        </Button>
                        <Button size="sm" className="text-xs bg-[#8B5E3C] hover:bg-[#8B5E3C]/80">
                          Process Booking
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setBookingDetailsOpen(false)}
                className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/80"
              >
                Close
              </Button>
              <Button variant="outline" className="border-[#8B5E3C] text-[#8B5E3C]">
                View All Bookings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Message Details Dialog */}
        <Dialog open={messageDetailsOpen} onOpenChange={setMessageDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#8B5E3C]">Unread Messages (5)</DialogTitle>
              <DialogDescription>
                Messages awaiting your response
              </DialogDescription>
            </DialogHeader>
            <div className="my-2">
              <ScrollArea className="h-[400px] rounded-md">
                <div className="space-y-4 p-2">
                  {messageData.map(message => (
                    <div key={message.id} className="p-4 rounded-md border border-[#A0B985]/20 hover:border-[#A0B985]/40 bg-white">
                      <div className="mb-2">
                        <h3 className="font-semibold text-[#8B5E3C]">{message.subject}</h3>
                        <div className="flex items-center gap-2 text-xs text-[#8B5E3C]/70 mt-1">
                          <ClockIcon className="h-3 w-3" />
                          {message.timestamp}
                        </div>
                      </div>
                      <div className="bg-[#FDF6EE]/50 p-3 rounded-md mb-3 text-sm">
                        {message.message}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-[#8B5E3C]/80">
                          <UserIcon className="h-3.5 w-3.5" />
                          {message.name}
                        </div>
                        <div className="flex items-center gap-2 text-[#8B5E3C]/80">
                          <MailIcon className="h-3.5 w-3.5" />
                          {message.email}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline" size="sm" className="text-xs border-[#8B5E3C] text-[#8B5E3C]">
                          Mark as Read
                        </Button>
                        <Button size="sm" className="text-xs bg-[#8B5E3C] hover:bg-[#8B5E3C]/80">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setMessageDetailsOpen(false)}
                className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/80"
              >
                Close
              </Button>
              <Button variant="outline" className="border-[#8B5E3C] text-[#8B5E3C]">
                View All Messages
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Main Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/dashboard">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <HomeIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Dashboard</h3>
                      <p className="text-[#8B5E3C]/70">Overview and quick actions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/gallery">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <GalleryVerticalIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Gallery Manager</h3>
                      <p className="text-[#8B5E3C]/70">Manage photos and videos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/calendar">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:border-green-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">Pricing Manager</h3>
                      <p className="text-green-700">Manage Airbnb rates & direct booking pricing</p>
                      <div className="mt-2 text-sm text-green-600">
                        <div>KNP: $431 → $388 (Save $43)</div>
                        <div>KNP1: $119 → $107 (Save $12)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/admin/testing">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <TestTubeIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">Deployment Testing</h3>
                      <p className="text-blue-700">A/B test matrix with debug logs</p>
                      <div className="mt-2 text-sm text-blue-600">
                        <div>• Route testing & validation</div>
                        <div>• Copy/paste debug reports</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/admin/analytics">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <TrendingUpIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Analytics Dashboard</h3>
                      <p className="text-[#8B5E3C]/70">Google Analytics & Meta insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/admin/documents">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <FileTextIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Content Documents</h3>
                      <p className="text-[#8B5E3C]/70">Marketing files, events & SEO content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/admin/roadmap">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 hover:border-purple-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800">Project Roadmap</h3>
                      <p className="text-purple-700">Release tracking & project management</p>
                      <div className="mt-2 text-sm text-purple-600">
                        <div>• Kanban board & timeline</div>
                        <div>• Release management</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/export">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <DownloadIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Media Export</h3>
                      <p className="text-[#8B5E3C]/70">Download media as ZIP archive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/drive-export">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <CloudUploadIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Google Drive Export</h3>
                      <p className="text-[#8B5E3C]/70">Upload media to Google Drive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/upload-images">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <UploadIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Image Uploader</h3>
                      <p className="text-[#8B5E3C]/70">Upload individual images</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/bulk-uploader">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <CloudUploadIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Bulk Image Upload</h3>
                      <p className="text-[#8B5E3C]/70">Upload hundreds of images at once</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/gallery-uploader">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985] bg-gradient-to-br from-[#FEF5ED] to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <GalleryVerticalIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Gallery Uploader</h3>
                      <p className="text-[#8B5E3C]/70">Upload images by category</p>
                      <span className="inline-block px-2 py-1 mt-2 text-xs bg-[#FF914D]/20 text-[#FF914D] rounded">Recommended</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <Link href="/admin/video-uploader">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985] bg-gradient-to-br from-[#FEF5ED] to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <VideoIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Video Uploader</h3>
                      <p className="text-[#8B5E3C]/70">Upload large video files</p>
                      <span className="inline-block px-2 py-1 mt-2 text-xs bg-[#FF914D]/20 text-[#FF914D] rounded">New!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
          
          <div className="cursor-pointer transition-all hover:shadow-lg opacity-60">
            <Card className="h-full bg-white border border-[#A0B985]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                    <UsersIcon className="h-8 w-8 text-[#FF914D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#8B5E3C]">User Management</h3>
                    <p className="text-[#8B5E3C]/70">Manage user accounts</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-[#62C3D2]/20 text-[#62C3D2] rounded">Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="cursor-pointer transition-all hover:shadow-lg opacity-60">
            <Card className="h-full bg-white border border-[#A0B985]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                    <CalendarIcon className="h-8 w-8 text-[#FF914D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#8B5E3C]">Booking Manager</h3>
                    <p className="text-[#8B5E3C]/70">Manage accommodation bookings</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-[#62C3D2]/20 text-[#62C3D2] rounded">Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="cursor-pointer transition-all hover:shadow-lg opacity-60">
            <Card className="h-full bg-white border border-[#A0B985]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                    <MessageSquareIcon className="h-8 w-8 text-[#FF914D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#8B5E3C]">Message Center</h3>
                    <p className="text-[#8B5E3C]/70">View and reply to inquiries</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-[#62C3D2]/20 text-[#62C3D2] rounded">Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#8B5E3C] mb-6">Recent Activity</h2>
          
          <Card className="bg-white border border-[#A0B985]/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#62C3D2]/10 p-2 rounded-full">
                    <CalendarIcon className="h-5 w-5 text-[#62C3D2]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#8B5E3C]">New booking request received</p>
                    <p className="text-sm text-[#8B5E3C]/70">Family Suite for 4 nights (June 12-16)</p>
                    <p className="text-xs text-[#8B5E3C]/60 mt-1">Today, 10:24 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#62C3D2]/10 p-2 rounded-full">
                    <GalleryVerticalIcon className="h-5 w-5 text-[#62C3D2]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#8B5E3C]">New photos uploaded to gallery</p>
                    <p className="text-sm text-[#8B5E3C]/70">5 photos added to "Pool Deck" category</p>
                    <p className="text-xs text-[#8B5E3C]/60 mt-1">Yesterday, 3:45 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#62C3D2]/10 p-2 rounded-full">
                    <MailIcon className="h-5 w-5 text-[#62C3D2]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#8B5E3C]">New contact message</p>
                    <p className="text-sm text-[#8B5E3C]/70">From: sarah.johnson@example.com</p>
                    <p className="text-xs text-[#8B5E3C]/60 mt-1">Yesterday, 11:32 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#A0B985]/20 text-center">
          <p className="text-sm text-[#8B5E3C]/60">
            &copy; {new Date().getFullYear()} Ko Lake Villa Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}