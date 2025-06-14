import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, lazy } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import AccessibilityToggle from "@/components/AccessibilityToggle";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from '@/pages/not-found';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavigationBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import Home from "@/pages/Home";
import Accommodation from "@/pages/Accommodation";
import Dining from "@/pages/Dining";
import Experiences from "@/pages/Experiences";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Booking from "@/pages/Booking";
import Checkout from "@/pages/Checkout";
import CardValidation from "@/pages/CardValidation";
import Deals from "@/pages/Deals";
import Friends from "@/pages/Friends";
import FAQ from "@/pages/FAQ";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminLanding from "@/pages/admin/AdminLanding";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminGallery from '@/pages/admin/Gallery';
import AdminRoadmap from '@/pages/admin/RoadmapManager';
import VisitorUploads from '@/pages/admin/VisitorUploads';
import Statistics from '@/pages/admin/Statistics';
import ImageCompression from "@/pages/admin/ImageCompression";
import ContentManager from "@/pages/admin/ContentManager";
import Analytics from '@/pages/admin/Analytics';
import Documents from "@/pages/admin/Documents";
import MediaExport from "@/pages/admin/MediaExport";
import AdminCalendar from "@/pages/AdminCalendar";
import GoogleDriveExport from "@/pages/admin/GoogleDriveExport";
import DeploymentTesting from "@/pages/admin/DeploymentTesting";
import ImageUploader from "@/pages/admin/ImageUploader";
import UploadImages from "@/pages/admin/UploadImages";
import BulkUploader from "@/pages/admin/BulkUploader";
import GalleryUploader from "@/pages/admin/GalleryUploader";
import VideoUploader from "@/pages/admin/VideoUploader";
import PageImageManager from "@/pages/admin/PageImageManager";
import AdminBookingCalendar from './components/AdminBookingCalendar';
import AuditLogs from '@/pages/admin/AuditLogs';
import Upload from "@/pages/admin/Upload";

// New Roadmap Component
function Roadmap() {
  return (
    <div>
      <h1>Roadmap</h1>
      <p>This is the roadmap page.</p>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  // Track page views when routes change
  useAnalytics();

  // Regular website layout
  if (!isAdminRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <NavigationBar />
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/deals" component={Deals} />
            <Route path="/accommodation" component={Accommodation} />
            <Route path="/dining" component={Dining} />
            <Route path="/experiences" component={Experiences} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/friends" component={Friends} />
            <Route path="/contact" component={Contact} />
            <Route path="/booking" component={Booking} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/card-validation" component={CardValidation} />
            <Route path="/faq" component={FAQ} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        {/* WhatsApp contact button */}
        <WhatsAppButton phoneNumber="+940711730345" />
        {/* Back to top button */}
        <BackToTop />
      </div>
    );
  }

  // Admin routes (no header/footer)
  return (
    <main className="min-h-screen">
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin">
          <ProtectedRoute>
            <AdminLanding />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/dashboard">
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/gallery">
          <ProtectedRoute>
            <AdminGallery />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/upload">
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/visitor-uploads">
          <ProtectedRoute>
            <VisitorUploads />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/image-compression">
          <ProtectedRoute>
            <ImageCompression />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/content">
          <ProtectedRoute>
            <ContentManager />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/content-manager">
          <ProtectedRoute>
            <ContentManager />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/testing">
          <ProtectedRoute>
            <DeploymentTesting />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/statistics">
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/calendar">
          <ProtectedRoute>
            <AdminCalendar />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/deals">
          <ProtectedRoute>
            <Deals />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/drive-export">
          <ProtectedRoute>
            <GoogleDriveExport />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/upload-images">
          <ProtectedRoute>
            <UploadImages />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/image-uploader">
          <ProtectedRoute>
            <ImageUploader />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/bulk-uploader">
          <ProtectedRoute>
            <BulkUploader />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/bulk-upload">
          <ProtectedRoute>
            <BulkUploader />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/gallery-uploader">
          <ProtectedRoute>
            <GalleryUploader />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/video-uploader">
          <ProtectedRoute>
            <VideoUploader />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/page-images">
          <ProtectedRoute>
            <PageImageManager />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/page-image-manager">
          <ProtectedRoute>
            <PageImageManager />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/booking-calendar">
          <ProtectedRoute>
            <AdminBookingCalendar />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/roadmap">
          <ProtectedRoute>
            <AdminRoadmap />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/audit-logs">
          <ProtectedRoute>
            <AuditLogs />
          </ProtectedRoute>
        </Route>
         {/* Catch-all route for 404 - must be last */}
        <Route path="/admin/*" component={NotFound} />
      </Switch>
    </main>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    console.log('App starting up...');
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <AccessibilityToggle />
          </TooltipProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;