import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Link } from 'wouter';
import { ArrowLeft, Zap, BarChart3, Download, Sparkles, FileImage, Gauge } from 'lucide-react';

interface GalleryImage {
  id: number;
  imageUrl: string;
  alt: string;
  category: string;
  mediaType: string;
  featured: boolean;
}

interface CompressionStats {
  totalImages: number;
  compressedImages: number;
  uncompressedImages: number;
  totalOriginalSizeFormatted: string;
  totalCompressedSizeFormatted: string;
  totalSpaceSavedFormatted: string;
  averageCompressionRatio: number;
}

interface CompressionResult {
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
  spaceSaved: string;
  compressionRatio: number;
  outputPath: string;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export default function ImageCompression() {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [compressionQuality, setCompressionQuality] = useState('80');
  const [compressionFormat, setCompressionFormat] = useState('webp');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery images
  const { data: images = [], isLoading: imagesLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
    retry: false
  });

  // Fetch compression statistics
  const { data: stats, isLoading: statsLoading } = useQuery<CompressionStats>({
    queryKey: ['/api/admin/compression-stats'],
    retry: false
  });

  // Batch compression mutation
  const compressMutation = useMutation({
    mutationFn: async ({ imageIds, quality, format }: { imageIds: number[]; quality: number; format: string }) => {
      const response = await apiRequest("POST", "/api/admin/compress-gallery", {
        imageIds,
        quality,
        format
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setCompressionResults(data.results);
      setIsCompressing(false);
      setSelectedImages([]);
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/compression-stats'] });
      
      toast({
        title: "Compression Complete! 🎉",
        description: (
          <div className="space-y-2">
            <p className="text-green-600">✅ Successfully compressed {data.compressedCount} images</p>
            <div className="pt-1 text-sm">
              <p>Average compression: {data.stats.averageCompressionRatio}%</p>
              <p>Space saved: {data.stats.totalSpaceSavedFormatted}</p>
            </div>
          </div>
        ),
        variant: "default",
        duration: 8000,
      });
    },
    onError: (error) => {
      setIsCompressing(false);
      console.error("Compression error:", error);
      toast({
        title: "Compression Failed",
        description: "There was an error compressing the images. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSelectImage = (imageId: number, checked: boolean) => {
    if (checked) {
      setSelectedImages(prev => [...prev, imageId]);
    } else {
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(images.map(img => img.id));
    } else {
      setSelectedImages([]);
    }
  };

  const handleCompress = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to compress.",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setCompressionResults([]);
    
    compressMutation.mutate({
      imageIds: selectedImages,
      quality: parseInt(compressionQuality),
      format: compressionFormat
    });
  };

  const imageOnlyImages = images.filter(img => img.mediaType === 'image');

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#8B5E3C] flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#FF914D]" />
              Smart Image Compression
            </h1>
            <p className="text-gray-600 mt-1">Optimize your Ko Lake Villa gallery images for faster loading</p>
          </div>
        </div>

        {/* Compression Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Total Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#8B5E3C]">{stats.totalImages}</p>
                <p className="text-sm text-gray-600">In gallery</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Compressed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.compressedImages}</p>
                <p className="text-sm text-gray-600">Optimized images</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Space Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#FF914D]">{stats.totalSpaceSavedFormatted}</p>
                <p className="text-sm text-gray-600">{stats.averageCompressionRatio}% average reduction</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCompressedSizeFormatted}</p>
                <p className="text-sm text-gray-600">vs {stats.totalOriginalSizeFormatted} original</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compression Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Compression Settings
            </CardTitle>
            <CardDescription>
              Choose quality and format settings for your image optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quality</label>
                <Select value={compressionQuality} onValueChange={setCompressionQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60% (High compression)</SelectItem>
                    <SelectItem value="70">70% (Balanced)</SelectItem>
                    <SelectItem value="80">80% (Recommended)</SelectItem>
                    <SelectItem value="90">90% (High quality)</SelectItem>
                    <SelectItem value="95">95% (Maximum quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Format</label>
                <Select value={compressionFormat} onValueChange={setCompressionFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webp">WebP (Best compression)</SelectItem>
                    <SelectItem value="jpeg">JPEG (Universal)</SelectItem>
                    <SelectItem value="png">PNG (Lossless)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleCompress} 
                  disabled={selectedImages.length === 0 || isCompressing}
                  className="w-full bg-[#FF914D] hover:bg-[#e67e3d]"
                >
                  {isCompressing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Compress {selectedImages.length} Images
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {isCompressing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Compressing images...</span>
                  <span>{selectedImages.length} images</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compression Results */}
        {compressionResults.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Compression Results
              </CardTitle>
              <CardDescription>
                Results from your latest compression operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compressionResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Image {index + 1}</p>
                        <p className="text-sm text-gray-600">{result.dimensions.width} × {result.dimensions.height}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {result.compressionRatio}% smaller
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.originalSizeFormatted} → {result.compressedSizeFormatted}
                        </p>
                        <p className="text-xs text-green-600">Saved: {result.spaceSaved}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Selection */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Select Images to Compress
                </CardTitle>
                <CardDescription>
                  Choose gallery images to optimize for better performance
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedImages.length === imageOnlyImages.length && imageOnlyImages.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label className="text-sm font-medium">Select All ({imageOnlyImages.length})</label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {imagesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#FF914D] border-t-transparent rounded-full" />
              </div>
            ) : imageOnlyImages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No images found in gallery</p>
                <Link href="/admin/gallery">
                  <Button variant="outline" className="mt-2">
                    Add Images to Gallery
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {imageOnlyImages.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <img 
                        src={image.imageUrl}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          checked={selectedImages.includes(image.id)}
                          onCheckedChange={(checked) => handleSelectImage(image.id, checked as boolean)}
                          className="bg-white/80 border-white"
                        />
                      </div>
                      {image.featured && (
                        <Badge className="absolute top-2 right-2 bg-[#FF914D]">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm truncate">{image.alt}</p>
                      <p className="text-xs text-gray-600 capitalize">{image.category.replace('-', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}