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
  CloudUploadIcon,
  Upload as UploadIcon
} from 'lucide-react';

export default function AdminLanding() {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
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
  
  // If not logged in, don't render anything (redirect will happen)
  if (!currentUser || !isAdmin) {
    return null;
  }
  
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
              <p className="font-medium text-[#8B5E3C]">Welcome, {currentUser.email}</p>
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
          <Card className="bg-white border border-[#A0B985]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-[#8B5E3C]">Today's Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FF914D]">28</p>
              <p className="text-[#8B5E3C]/70 text-sm">+12% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-[#A0B985]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-[#8B5E3C]">New Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FF914D]">3</p>
              <p className="text-[#8B5E3C]/70 text-sm">In the last 24 hours</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-[#A0B985]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-[#8B5E3C]">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FF914D]">5</p>
              <p className="text-[#8B5E3C]/70 text-sm">Awaiting response</p>
            </CardContent>
          </Card>
        </div>
        
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
          
          <Link href="/admin/statistics">
            <div className="cursor-pointer transition-all hover:shadow-lg">
              <Card className="h-full bg-white border border-[#A0B985]/20 hover:border-[#A0B985]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF914D]/10 p-3 rounded-lg">
                      <BarChartIcon className="h-8 w-8 text-[#FF914D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#8B5E3C]">Analytics</h3>
                      <p className="text-[#8B5E3C]/70">Website statistics and reports</p>
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
                      <p className="text-[#8B5E3C]/70">Upload images to your website</p>
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