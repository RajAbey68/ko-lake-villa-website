
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UploadIcon, 
  XIcon,
  CheckIcon,
  AlertCircleIcon
} from 'lucide-react';

import { GALLERY_CATEGORIES } from '@/lib/galleryUtils';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface FileUploadStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function BulkUploadDialog({ isOpen, onClose, onUploadComplete }: BulkUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileUploadStatus[]>([]);
  const [category, setCategory] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [currentUpload, setCurrentUpload] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileStatuses: FileUploadStatus[] = files.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }));
    setSelectedFiles(fileStatuses);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (fileStatus: FileUploadStatus, index: number) => {
    const formData = new FormData();
    formData.append('file', fileStatus.file);
    formData.append('category', category);
    formData.append('title', fileStatus.file.name.replace(/\.[^/.]+$/, ""));
    formData.append('alt', fileStatus.file.name.replace(/\.[^/.]+$/, ""));
    formData.append('featured', 'false');
    formData.append('mediaType', fileStatus.file.type.startsWith('video/') ? 'video' : 'image');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  };

  const handleBulkUpload = async () => {
    if (!category) {
      toast({
        title: "Category Required",
        description: "Please select a category for all images",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setCurrentUpload(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      setCurrentUpload(i + 1);
      
      // Update status to uploading
      setSelectedFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'uploading', progress: 50 } : file
      ));

      try {
        await uploadFile(selectedFiles[i], i);
        
        // Update status to success
        setSelectedFiles(prev => prev.map((file, index) => 
          index === i ? { ...file, status: 'success', progress: 100 } : file
        ));
        
      } catch (error: any) {
        // Update status to error
        setSelectedFiles(prev => prev.map((file, index) => 
          index === i ? { ...file, status: 'error', progress: 0, error: error.message } : file
        ));
      }
    }

    setUploading(false);
    queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
    onUploadComplete();
    
    const successCount = selectedFiles.filter(f => f.status === 'success').length;
    toast({
      title: "Bulk Upload Complete",
      description: `Successfully uploaded ${successCount} of ${selectedFiles.length} files`,
    });
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([]);
      setCategory('');
      onClose();
    }
  };

  const overallProgress = selectedFiles.length > 0 
    ? (currentUpload / selectedFiles.length) * 100 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Images</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click to select multiple images/videos</p>
            <p className="text-sm text-gray-500 mt-2">Supports: JPEG, PNG, GIF, WebP, MP4, MOV</p>
          </div>

          {/* Category Selection */}
          {selectedFiles.length > 0 && (
            <div>
              <Label htmlFor="bulk-category">Category for all files *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category for all images" />
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
          )}

          {/* File List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Files ({selectedFiles.length})</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {selectedFiles.map((fileStatus, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {fileStatus.status === 'success' && <CheckIcon className="h-4 w-4 text-green-600" />}
                      {fileStatus.status === 'error' && <AlertCircleIcon className="h-4 w-4 text-red-600" />}
                      {fileStatus.status === 'uploading' && <div className="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />}
                      
                      <span className="text-sm">{fileStatus.file.name}</span>
                      {fileStatus.error && <span className="text-xs text-red-600">({fileStatus.error})</span>}
                    </div>
                    
                    {!uploading && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files... ({currentUpload}/{selectedFiles.length})</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="w-full" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleBulkUpload}
            disabled={selectedFiles.length === 0 || !category || uploading}
            className="bg-[#FF914D] hover:bg-[#8B5E3C]"
          >
            Upload {selectedFiles.length} Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
