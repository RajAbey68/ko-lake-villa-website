import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Progress } from '@/components/ui/progress';
import { GalleryImage } from '@shared/schema';

const MediaExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const { data: galleryImages, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Calculate total file sizes
  const totalImageCount = galleryImages?.length || 0;
  const totalVideoCount = galleryImages?.filter(img => img.mediaType === 'video').length || 0;
  // Default fileSize to 0 if not available
  const totalSize = galleryImages?.reduce((acc, img) => {
    const fileSize = typeof img.fileSize === 'number' ? img.fileSize : 0;
    return acc + fileSize;
  }, 0) || 0;
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  // Function to download all media files
  const downloadAllMedia = async () => {
    if (!galleryImages || galleryImages.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);
    setStatusMessage('Preparing export...');

    try {
      const zip = new JSZip();
      
      // Create folders for categories
      const categorySet = new Set<string>();
      galleryImages.forEach(img => categorySet.add(img.category || 'Uncategorized'));
      const categories = Array.from(categorySet);
      categories.forEach(category => {
        zip.folder(category);
      });

      // Add files to their respective category folders
      for (let i = 0; i < galleryImages.length; i++) {
        const img = galleryImages[i];
        const category = img.category || 'Uncategorized';
        const filename = img.imageUrl.split('/').pop() || `file-${i}.${img.mediaType === 'video' ? 'mp4' : 'jpg'}`;
        
        setStatusMessage(`Downloading ${filename} (${i+1}/${galleryImages.length})...`);
        
        // Download file
        const response = await fetch(img.imageUrl);
        const blob = await response.blob();
        
        // Add to zip in category folder
        zip.folder(category)?.file(filename, blob);
        
        // Update progress
        setExportProgress(Math.round(((i + 1) / galleryImages.length) * 100));
      }

      setStatusMessage('Generating zip file...');
      
      // Generate and download zip
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      }, (metadata) => {
        setExportProgress(Math.round(metadata.percent));
      });
      
      saveAs(content, 'kolakehouse-media-export.zip');
      setStatusMessage('Export complete!');
    } catch (error) {
      console.error('Export failed:', error);
      setStatusMessage('Export failed. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Media Export Utility</CardTitle>
          <CardDescription>
            Download all media files organized by category for migration to your live website.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Total Images</h3>
                  <p className="text-2xl font-bold">{totalImageCount - totalVideoCount}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Total Videos</h3>
                  <p className="text-2xl font-bold">{totalVideoCount}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Total Size</h3>
                  <p className="text-2xl font-bold">{totalSizeMB} MB</p>
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
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            onClick={downloadAllMedia}
            disabled={isLoading || isExporting || !galleryImages?.length}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download All Media Files
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MediaExport;