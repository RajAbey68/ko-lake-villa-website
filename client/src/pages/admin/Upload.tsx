import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload as UploadIcon, X as XIcon, Image as ImageIcon, Video as VideoIcon, ArrowLeft } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const GALLERY_CATEGORIES = [
  { value: "entire-villa", label: "Entire Villa" },
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "koggala-lake", label: "Koggala Lake" },
  { value: "excursions", label: "Excursions" },
  { value: "friends", label: "Friends" },
  { value: "events", label: "Events" }
];

interface FileUpload {
  file: File;
  preview: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  featured: boolean;
}

export default function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<FileUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (uploads: FileUpload[]) => {
      const formData = new FormData();
      
      uploads.forEach((upload, index) => {
        formData.append('images', upload.file);
        formData.append(`metadata[${index}]`, JSON.stringify({
          title: upload.title,
          description: upload.description,
          category: upload.category,
          tags: upload.tags,
          featured: upload.featured,
          alt: upload.title || upload.file.name
        }));
      });

      const response = await apiRequest('POST', '/api/gallery/upload', formData);
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: `${selectedFiles.length} file(s) uploaded successfully`
      });
      setSelectedFiles([]);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast({
          title: "Invalid File Type",
          description: "Please select only image or video files",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newUpload: FileUpload = {
          file,
          preview: e.target?.result as string,
          title: '',
          description: '',
          category: 'entire-villa',
          tags: '',
          featured: false
        };
        
        setSelectedFiles(prev => [...prev, newUpload]);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFileMetadata = (index: number, field: keyof FileUpload, value: any) => {
    setSelectedFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, [field]: value } : file
    ));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    // Validate that all files have required metadata
    const incompleteFiles = selectedFiles.filter(file => !file.title || !file.category);
    if (incompleteFiles.length > 0) {
      toast({
        title: "Incomplete Information",
        description: "Please provide title and category for all files",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(selectedFiles);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
          <p className="text-gray-600">Add new images and videos to your gallery</p>
        </div>
      </div>

      {/* File Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Choose files to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Select multiple images or videos (JPEG, PNG, MP4, MOV)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#FF914D] hover:bg-[#8B5E3C]"
            >
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Selected Files ({selectedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedFiles.map((upload, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="flex-shrink-0 w-24 h-24">
                      {upload.file.type.startsWith('video/') ? (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <VideoIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={upload.preview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>

                    {/* Metadata Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${index}`}>Title *</Label>
                        <Input
                          id={`title-${index}`}
                          value={upload.title}
                          onChange={(e) => updateFileMetadata(index, 'title', e.target.value)}
                          placeholder="Enter image title"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`category-${index}`}>Category *</Label>
                        <Select
                          value={upload.category}
                          onValueChange={(value) => updateFileMetadata(index, 'category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GALLERY_CATEGORIES.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          value={upload.description}
                          onChange={(e) => updateFileMetadata(index, 'description', e.target.value)}
                          placeholder="Describe this image or video"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tags-${index}`}>Tags</Label>
                        <Input
                          id={`tags-${index}`}
                          value={upload.tags}
                          onChange={(e) => updateFileMetadata(index, 'tags', e.target.value)}
                          placeholder="swimming, luxury, villa (comma separated)"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`featured-${index}`}
                          checked={upload.featured}
                          onChange={(e) => updateFileMetadata(index, 'featured', e.target.checked)}
                        />
                        <Label htmlFor={`featured-${index}`}>Featured Image</Label>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={isUploading || uploadMutation.isPending}
            className="bg-[#FF914D] hover:bg-[#8B5E3C]"
            size="lg"
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
          </Button>
        </div>
      )}
    </div>
  );
}