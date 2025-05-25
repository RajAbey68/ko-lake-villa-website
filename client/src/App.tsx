import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import Home from "@/pages/Home";
import Accommodation from "@/pages/Accommodation";
import Dining from "@/pages/Dining";
import Experiences from "@/pages/Experiences";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Booking from "@/pages/Booking";
// import FAQ from "@/pages/FAQ";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminLanding from "@/pages/admin/AdminLanding";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminGallery from "@/pages/admin/Gallery";
import Statistics from "@/pages/admin/Statistics";
import MediaExport from "@/pages/admin/MediaExport";
import GoogleDriveExport from "@/pages/admin/GoogleDriveExport";
import ImageUploader from "@/pages/admin/ImageUploader";
import UploadImages from "@/pages/admin/UploadImages";
import BulkUploader from "@/pages/admin/BulkUploader";
import GalleryUploader from "@/pages/admin/GalleryUploader";
import VideoUploader from "@/pages/admin/VideoUploader";
import PageImageManager from "@/pages/admin/PageImageManager";

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
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/accommodation" component={Accommodation} />
            <Route path="/dining" component={Dining} />
            <Route path="/experiences" component={Experiences} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/contact" component={Contact} />
            <Route path="/booking" component={Booking} />
            <Route path="/faq" component={() => <div>FAQ page coming soon</div>} />
            <Route path="/admin/*" component={() => null} /> {/* Catch and ignore admin routes here */}
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
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/statistics" component={Statistics} />
        <Route path="/admin/export" component={MediaExport} />
        <Route path="/admin/drive-export" component={GoogleDriveExport} />
        <Route path="/admin/upload-images" component={UploadImages} />
        <Route path="/admin/image-uploader" component={ImageUploader} />
        <Route path="/admin/bulk-uploader" component={BulkUploader} />
        <Route path="/admin/gallery-uploader" component={GalleryUploader} />
        <Route path="/admin/video-uploader" component={VideoUploader} />
        <Route path="/admin/page-images" component={PageImageManager} />
        <Route path="/admin" component={AdminLanding} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
