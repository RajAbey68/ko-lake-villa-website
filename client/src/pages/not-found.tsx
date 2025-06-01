
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-display font-bold text-[#1E4E5F] mb-4">404</h1>
          <h2 className="text-3xl font-display font-bold text-[#8B5E3C] mb-4">Page Not Found</h2>
          <p className="text-lg text-[#333333] mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist. You might have typed the wrong address or the page may have moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-[#E8B87D] hover:bg-[#1E4E5F] text-white px-8 py-3 rounded-full text-lg transition-colors mr-4">
              Go Home
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button variant="outline" className="border-[#1E4E5F] text-[#1E4E5F] hover:bg-[#1E4E5F] hover:text-white px-8 py-3 rounded-full text-lg transition-colors">
              Contact Us
            </Button>
          </Link>
        </div>
        
        <div className="mt-8">
          <img 
            src="/uploads/gallery/koggala-lake/KoggalaNinePeaks_koggala-lake_0.jpg" 
            alt="Ko Lake Villa - Beautiful lake view" 
            className="w-64 h-40 object-cover rounded-lg mx-auto opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
