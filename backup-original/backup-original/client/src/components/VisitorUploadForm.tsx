
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon, CheckIcon } from 'lucide-react';

const GALLERY_CATEGORIES = [
  { value: "entire-villa", label: "Entire Villa" },
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "roof-garden", label: "Roof Garden" },
  { value: "front-garden", label: "Front Garden" },
  { value: "koggala-lake", label: "Koggala Lake" },
  { value: "excursions", label: "Excursions" },
  { value: "friends", label: "Friends" },
  { value: "events", label: "Events" }
];

interface VisitorUploadFormProps {
  onSuccess?: () => void;
}

export default function VisitorUploadForm({ onSuccess }: VisitorUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const response = await fetch('/api/visitor-uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      setSubmitted(true);
      toast({
        title: "Upload Submitted!",
        description: "Your photo/video has been submitted for review. We'll notify you once it's approved.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#8B5E3C] mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your upload has been submitted for review. Our team will review it within 24 hours 
            and you'll be notified once it's approved and published to the gallery.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            className="bg-[#FF914D] hover:bg-[#8B5E3C]"
          >
            Upload Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-[#8B5E3C]">Share Your Ko Lake Villa Experience</CardTitle>
        <p className="text-gray-600">
          Upload your photos and videos from your stay! All submissions are reviewed before being published.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Photo/Video *</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*,video/*"
              required
              className="h-12"
            />
            <p className="text-xs text-gray-500">Max file size: 50MB. Supported formats: JPG, PNG, MP4, MOV</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select name="category" required>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select where this was taken..." />
              </SelectTrigger>
              <SelectContent>
                {GALLERY_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt">Title/Caption *</Label>
            <Input
              id="alt"
              name="alt"
              placeholder="Give your photo/video a title..."
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell us about this moment..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="vacation, family, sunset, pool (separated by commas)"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uploaderName">Your Name *</Label>
            <Input
              id="uploaderName"
              name="uploaderName"
              placeholder="Your full name"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uploaderEmail">Email</Label>
            <Input
              id="uploaderEmail"
              name="uploaderEmail"
              type="email"
              placeholder="your@email.com (for updates on your submission)"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uploaderPhone">Phone</Label>
            <Input
              id="uploaderPhone"
              name="uploaderPhone"
              type="tel"
              placeholder="Your phone number (optional)"
              className="h-12"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Review Process</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All uploads are reviewed by our team within 24 hours</li>
              <li>• We'll email you when your submission is approved</li>
              <li>• Published photos become part of our gallery</li>
              <li>• We reserve the right to edit or decline submissions</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            disabled={uploading}
            className="w-full h-12 bg-[#FF914D] hover:bg-[#8B5E3C]"
          >
            {uploading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
