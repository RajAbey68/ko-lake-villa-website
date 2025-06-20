import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'default');
    formData.append('title', file.name);
    formData.append('mediaType', file.type.startsWith('image/') ? 'image' : 'video');
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Handle success
      toast({
        title: "Upload Successful",
        description: "Your image has been uploaded!",
      });

      setUploadedImageUrl(data.data.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coconut-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{color: 'var(--kurumba-brown)'}}>Image Uploader</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>Select and upload images for your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                
                {file && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Preview:</h3>
                    <div className="relative w-full h-48 rounded-md overflow-hidden border">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="btn-palm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : "Upload Image"}
              </Button>
            </CardFooter>
          </Card>
          
          {uploadedImageUrl && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Uploaded Image</CardTitle>
                <CardDescription>Your image was uploaded successfully</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <img 
                    src={uploadedImageUrl.startsWith('https://') 
                      ? uploadedImageUrl 
                      : window.location.origin + uploadedImageUrl
                    } 
                    alt="Uploaded" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-4 text-sm break-all">
                  <span className="font-medium">Image URL:</span><br/>
                  {uploadedImageUrl}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}