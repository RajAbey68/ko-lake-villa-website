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
import Home from "@/pages/Home";
import Accommodation from "@/pages/Accommodation";
import Dining from "@/pages/Dining";
import Experiences from "@/pages/Experiences";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Booking from "@/pages/Booking";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminLanding from "@/pages/admin/AdminLanding";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminGallery from "@/pages/admin/Gallery";
import Statistics from "@/pages/admin/Statistics";

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
            <Route path="/admin/*" component={() => null} /> {/* Catch and ignore admin routes here */}
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        {/* WhatsApp contact button */}
        <WhatsAppButton phoneNumber="+940711730345" />
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
        <Route path="/admin" component={AdminLanding} />
        <Route path="/admin/*" component={NotFound} />
      </Switch>
    </main>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
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
