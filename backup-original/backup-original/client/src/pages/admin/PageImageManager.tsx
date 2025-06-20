import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image, Save, Eye } from 'lucide-react';

interface PageImage {
  id: number;
  pageName: string;
  imageUrl: string;
  altText: string;
  isActive: boolean;
}

const PageImageManager = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const pages = [
    { id: 'home', name: 'Home Page', description: 'Main landing page hero image' },
    { id: 'accommodation', name: 'Accommodation', description: 'Rooms and suites page' },
    { id: 'dining', name: 'Dining', description: 'Restaurant and dining page' },
    { id: 'experiences', name: 'Experiences', description: 'Activities and experiences page' },
    { id: 'gallery', name: 'Gallery', description: 'Photo gallery page' },
    { id: 'contact', name: 'Contact', description: 'Contact page' },
    { id: 'booking', name: 'Booking', description: 'Booking page' },
  ];

  // Fetch current page images
  const { data: pageImages, isLoading } = useQuery<PageImage[]>({
    queryKey: ['/api/admin/page-images'],
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, pageName, altText }: { file: File; pageName: string; altText: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pageName', pageName);
      formData.append('altText', altText || `Hero image for ${pageName} page`);
      formData.append('category', 'hero-images');

      const response = await fetch('/api/admin/upload-page-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-images'] });
      toast({
        title: "Success!",
        description: "Page image uploaded successfully.",
      });
      setUploadingImage(null);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setUploadingImage(null);
    },
  });

  const handleFileUpload = async (pageName: string) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploadingImage(pageName);
    const altText = `Hero image for ${pages.find(p => p.id === pageName)?.name} page`;
    
    uploadImageMutation.mutate({ file, pageName, altText });
  };

  const currentPageImage = pageImages?.find(img => img.pageName === selectedPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B5E3C] mb-4">Page Image Manager</h1>
        <p className="text-gray-600">Upload and manage hero images for different pages of your website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Page Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Select Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => {
                const hasImage = pageImages?.some(img => img.pageName === page.id);
                return (
                  <div
                    key={page.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPage === page.id
                        ? 'border-[#8B5E3C] bg-[#FDF6EE]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPage(page.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{page.name}</h3>
                        <p className="text-sm text-gray-500">{page.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasImage && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            <Eye className="h-3 w-3 mr-1" />
                            Has Image
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Image Upload and Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Manage Image for {pages.find(p => p.id === selectedPage)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Image Preview */}
            {currentPageImage && (
              <div className="space-y-3">
                <Label>Current Image</Label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={currentPageImage.imageUrl}
                    alt={currentPageImage.altText}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600">{currentPageImage.altText}</p>
              </div>
            )}

            {/* Upload New Image */}
            <div className="space-y-4">
              <Label>Upload New Hero Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Choose a high-quality image for the {pages.find(p => p.id === selectedPage)?.name} page
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => handleFileUpload(selectedPage)}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage === selectedPage}
                  className="bg-[#8B5E3C] hover:bg-[#6B4423] text-white"
                >
                  {uploadingImage === selectedPage ? 'Uploading...' : 'Choose Image'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Recommended: High resolution images (1920x1080 or larger) for best quality.
                Supported formats: JPG, PNG, WebP
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Select a page from the left panel to manage its hero image</li>
              <li>Upload a high-quality image that represents that page well</li>
              <li>The image will automatically be set as the hero background for that page</li>
              <li>Visit the page to see your changes take effect immediately</li>
            </ol>
            <p className="mt-4 p-4 bg-[#FDF6EE] border border-[#A0B985] rounded-lg">
              <strong>Tip:</strong> Use authentic photos of Ko Lake House property for the best results. 
              High-contrast images work best as hero backgrounds with text overlay.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageImageManager;