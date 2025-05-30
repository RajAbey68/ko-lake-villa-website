import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Set document title for SEO
    document.title = "404 - Page Not Found | Ko Lake Villa";
    
    // Set HTTP status to 404 if on server side
    if (typeof window === 'undefined') {
      // This would work for SSR, but since we're using client-side routing,
      // we'll need to handle this differently
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you're looking for doesn't exist.
          </p>
          
          <div className="mt-6">
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1E4E5F] hover:bg-[#E8B87D] transition-colors"
            >
              Return Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
