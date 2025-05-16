import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CloudUpload, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GalleryImage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const GoogleDriveExport = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [exportResults, setExportResults] = useState<{
    success: number;
    failed: number;
    uploadedFiles: Array<{ name: string, webViewLink: string }>;
  } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});

  // Get gallery images
  const { data: galleryImages, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Get unique categories
  const categories = React.useMemo(() => {
    if (!galleryImages) return [];
    const categorySet = new Set<string>();
    galleryImages.forEach(img => {
      if (img.category) categorySet.add(img.category);
    });
    return Array.from(categorySet);
  }, [galleryImages]);

  // Initialize selected categories
  React.useEffect(() => {
    if (categories.length > 0) {
      const initialSelected: Record<string, boolean> = {};
      categories.forEach(category => {
        initialSelected[category] = true;
      });
      setSelectedCategories(initialSelected);
    }
  }, [categories]);

  // Count images and videos by category
  const categoryStats = React.useMemo(() => {
    if (!galleryImages) return {};
    
    const stats: Record<string, { images: number, videos: number }> = {};
    
    categories.forEach(category => {
      stats[category] = { images: 0, videos: 0 };
    });
    
    galleryImages.forEach(img => {
      if (img.category) {
        if (img.mediaType === 'video') {
          stats[img.category].videos++;
        } else {
          stats[img.category].images++;
        }
      }
    });
    
    return stats;
  }, [galleryImages, categories]);

  const anySelected = Object.values(selectedCategories).some(Boolean);

  // Update selection state
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Select/deselect all
  const toggleAll = (selected: boolean) => {
    const newSelection: Record<string, boolean> = {};
    categories.forEach(category => {
      newSelection[category] = selected;
    });
    setSelectedCategories(newSelection);
  };

  // Upload selected media to Google Drive
  const uploadToGoogleDrive = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);
      setStatusMessage('Preparing Google Drive export...');
      setExportResults(null);

      // Prepare selected categories
      const selectedCats = Object.entries(selectedCategories)
        .filter(([_, selected]) => selected)
        .map(([category]) => category);

      if (selectedCats.length === 0) {
        toast({
          title: 'No categories selected',
          description: 'Please select at least one category to export.',
          variant: 'destructive'
        });
        setIsExporting(false);
        return;
      }

      // Filter images by selected categories
      const imagesToExport = galleryImages?.filter(img => 
        img.category && selectedCategories[img.category]
      ) || [];

      if (imagesToExport.length === 0) {
        toast({
          title: 'No media to export',
          description: 'There are no media files in the selected categories.',
          variant: 'destructive'
        });
        setIsExporting(false);
        return;
      }

      setStatusMessage('Creating folder structure in Google Drive...');

      // Start the export process
      const response = await apiRequest(
        'POST',
        '/api/export/google-drive',
        {
          categories: selectedCats,
          imageIds: imagesToExport.map(img => img.id)
        }
      );

      const result = await response.json();

      if (response.status !== 200) {
        throw new Error(result.message || 'Failed to export to Google Drive');
      }

      setExportResults({
        success: result.success,
        failed: result.failed,
        uploadedFiles: result.uploadedFiles || []
      });

      toast({
        title: 'Export completed',
        description: `Successfully uploaded ${result.success} files to Google Drive.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
      setExportProgress(100);
      setStatusMessage('Export completed');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Google Drive Export</CardTitle>
          <CardDescription>
            Export selected media files to your Google Drive account, organized by category.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Select Categories to Export</h3>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
                      Deselect All
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map(category => (
                    <div 
                      key={category} 
                      className="flex items-start space-x-2 border p-3 rounded-md"
                    >
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories[category] || false}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {category}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {categoryStats[category]?.images || 0} images, {categoryStats[category]?.videos || 0} videos
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{statusMessage}</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}
              
              {exportResults && (
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-medium">
                      Successfully uploaded {exportResults.success} files to Google Drive
                    </p>
                  </div>
                  
                  {exportResults.failed > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="text-sm font-medium">
                        Failed to upload {exportResults.failed} files
                      </p>
                    </div>
                  )}
                  
                  {exportResults.uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Upload Results:</p>
                      <div className="max-h-40 overflow-y-auto border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {exportResults.uploadedFiles.map((file, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{file.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  <a 
                                    href={file.webViewLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View in Drive
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            onClick={uploadToGoogleDrive}
            disabled={isLoading || isExporting || !anySelected}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting to Google Drive...
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-4 w-4" />
                Upload to Google Drive
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoogleDriveExport;