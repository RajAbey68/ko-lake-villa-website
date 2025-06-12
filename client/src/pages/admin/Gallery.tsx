import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ImageIcon, 
  UploadIcon, 
  SettingsIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon
} from 'lucide-react';

import SimpleGalleryManager from '@/components/SimpleGalleryManager';
import ImageUploadDialog from '@/components/ImageUploadDialog';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function AdminGallery() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-6 min-h-screen overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Gallery Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your property images and videos with AI-powered categorization
          </p>
        </div>
        
        <Button 
          onClick={() => setUploadDialogOpen(true)}
          className="bg-[#FF914D] hover:bg-[#8B5E3C]"
        >
          <UploadIcon className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Important Notice about Tag-Category Consistency */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Tag-Category Consistency</h3>
              <p className="text-sm text-blue-800 mb-3">
                This system ensures tags are automatically generated from the selected category. 
                This prevents the inconsistencies found in the previous system where categories 
                and tags could conflict.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <Badge variant="outline" className="text-green-700 border-green-300 mb-2">
                    ✓ CORRECT
                  </Badge>
                  <p>Category: "Family Suite"<br />
                     Tags: "#family-suite, #luxury, #spacious"</p>
                </div>
                <div>
                  <Badge variant="outline" className="text-red-700 border-red-300 mb-2">
                    ✗ PREVENTED
                  </Badge>
                  <p>Category: "Family Suite"<br />
                     Tags: "#entire-villa, #budget" (conflicting)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-[#FF914D]" />
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-[#8B5E3C]">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-[#8B5E3C]">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-[#8B5E3C]">11</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Validation</p>
                <p className="text-2xl font-bold text-green-600">✓</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Main Gallery Management Component */}
      <ErrorBoundary>
        <SimpleGalleryManager />
      </ErrorBoundary>

      {/* Upload Dialog */}
      <ImageUploadDialog 
        isOpen={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)} 
      />
    </div>
  );
}