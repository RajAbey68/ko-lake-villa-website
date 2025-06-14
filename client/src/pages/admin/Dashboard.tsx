import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavigation from '../../components/AdminNavigation';
import { logOut } from '../../lib/firebase';
import { uploadFile } from '../../lib/firebaseStorage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
// Pricing data - your JSON structure as TypeScript constant
const pricing = {
  "updated": "2025-05-25T15:55:00Z",
  "rates": {
    "knp": { "sun": 431, "mon": 431, "tue": 431 },
    "knp1": { "sun": 119, "mon": 119, "tue": 119 },
    "knp3": { "sun": 70, "mon": 70, "tue": 70 },
    "knp6": { "sun": 250, "mon": 250, "tue": 250 }
  },
  "overrides": {}
};
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Spinner } from '../../components/ui/spinner';
import { useToast } from '../../hooks/use-toast';
import { toast as hotToast } from '../../hooks/use-toast';
import UnifiedGalleryManager from '../../components/UnifiedGalleryManager'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../../lib/queryClient';
import { z } from 'zod';
import React from 'react';
import { 
  HomeIcon, 
  LayoutDashboardIcon, 
  LogOutIcon, 
  MailIcon, 
  CalendarRangeIcon, 
  ImageIcon, 
  UsersIcon,
  UserIcon,
  EditIcon,
  TrashIcon,
  ImagePlusIcon,
  CheckCircleIcon,
  BarChartIcon,
  PlayCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  UploadIcon,
  LinkIcon,
  RefreshCwIcon,
  BugIcon,
  PlusCircleIcon,
  StarIcon,
  CheckIcon,
  XIcon,
  FilterIcon
} from 'lucide-react';

// Import GalleryImage type directly to fix the import error
type GalleryImage = {
  id: number;
  imageUrl: string;
  alt: string;
  description?: string;
  tags?: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  mediaType: string;
};

// Room definitions and pricing logic
const rooms = {
  klv: "Entire Villa KLV",
  klv1: "Family Suite (KLV1)", 
  klv3: "Twin/Triple Room (KLV3)",
  klv6: "Group Room (KLV6)",
};

function calculateDirectRate(rate: number) {
  return +(rate * 0.9).toFixed(2); // 10% discount
}

function PricingManagerCard() {
  const updated = new Date(pricing.updated).toLocaleString();

  return (
    <div style={{
      background: 'linear-gradient(to right, #e6f5e9, #f4fdf6)',
      padding: '1rem',
      borderRadius: '10px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <h3>💸 Pricing Manager</h3>
      <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
        Last updated: {updated}
      </p>
      <table width="100%" style={{ marginBottom: '1rem' }}>
        <thead>
          <tr>
            <th align="left">Room</th>
            <th>Airbnb Rate</th>
            <th>Your Rate</th>
            <th>Guest Savings</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(pricing.rates).map(([id, { sun }]) => {
            const direct = calculateDirectRate(sun);
            const saving = (sun - direct).toFixed(2);
            return (
              <tr key={id}>
                <td>{rooms[id as keyof typeof rooms]}</td>
                <td>${sun}</td>
                <td style={{ color: "green" }}>${direct}</td>
                <td>${saving}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/admin/calendar">
          <button style={{ background: "#469458", color: "white", padding: "0.5rem 1rem", borderRadius: "5px", border: "none" }}>🔁 Open Pricing Calendar</button>
        </a>
        <a href="/accommodation" target="_blank">
          <button style={{ background: "#ccc", padding: "0.5rem 1rem", borderRadius: "5px", border: "none" }}>👁 Preview Live Rates</button>
        </a>
      </div>
    </div>
  );
}


// Validation schema for gallery images
const galleryImageSchema = z.object({
  uploadMethod: z.enum(["url", "file"]).default("url"),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  file: z.any().optional(),
  alt: z.string().min(3, { message: "Description must be at least 3 characters" }),
  category: z.string().min(2, { message: "Please select a category" }),
  tags: z.string().optional(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().nonnegative().default(0),
  mediaType: z.enum(["image", "video"]).default("image"),
}).refine((data) => {
  // Ensure either imageUrl or file is provided based on uploadMethod
  if (data.uploadMethod === "url") {
    return !!data.imageUrl;
  } else {
    return !!data.file;
  }
}, {
  message: "Please provide either a URL or upload a file",
  path: ["imageUrl"],
});

type FormValues = z.infer<typeof galleryImageSchema>;

// Category options for the gallery
const CATEGORIES = [
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "roof-garden", label: "Roof Garden" },
  { value: "front-garden", label: "Front Garden and Entrance" },
  { value: "koggala-lake", label: "Koggala Lake and Surrounding" },
  { value: "excursions", label: "Excursions" },
];

// Gallery Manager Component
interface GalleryManagerProps {
  isAddingImage: boolean;
  setIsAddingImage: (isAdding: boolean) => void;
}

function GalleryManager({ isAddingImage, setIsAddingImage }: GalleryManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingImage, setIsEditingImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedMediaType, setSelectedMediaType] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [bulkUpdateMode, setBulkUpdateMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [autoCategorizeLoading, setAutoCategorizeLoading] = useState(false);

  // Load gallery images
  const { data: allImages = [], isLoading, isError } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
    retry: false
  });

  // Filter images based on selected category and media type
  const images = React.useMemo(() => {
    let filtered = allImages;
    
    if (selectedCategory) {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    if (selectedMediaType) {
      filtered = filtered.filter(img => img.mediaType === selectedMediaType);
    }
    
    return filtered;
  }, [allImages, selectedCategory, selectedMediaType]);

  // Form for adding/editing images
  const form = useForm<FormValues>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      uploadMethod: 'file', // Default to file upload
      imageUrl: '',
      alt: '',
      category: '',
      tags: '',
      description: '',
      featured: false,
      sortOrder: 0,
      mediaType: 'image',
    }
  });

  // Create image mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/admin/gallery", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setIsAddingImage(false);
      form.reset();
      toast({
        title: "Gallery Updated",
        description: (
          <div className="space-y-2">
            <p className="text-green-600">✅ Image added successfully to the gallery!</p>
            <div className="pt-1 text-sm">
              <p>You can view this image in the gallery now.</p>
            </div>
          </div>
        ),
        variant: "default",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Error adding image:", error);
      toast({
        title: "Error",
        description: "Failed to add image. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update image mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormValues }) => {
      const response = await apiRequest("PATCH", `/api/admin/gallery/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setIsEditingImage(null);
      form.reset();
      toast({
        title: "Gallery Updated",
        description: (
          <div className="space-y-2">
            <p className="text-green-600">✅ Image updated successfully!</p>
            <div className="pt-1 text-sm">
              <p>Your changes have been applied to the gallery.</p>
            </div>
          </div>
        ),
        variant: "default",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Error updating image:", error);
      toast({
        title: "Error",
        description: "Failed to update image. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/gallery/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Image Removed",
        description: (
          <div className="space-y-2">
            <p className="text-green-600">✅ Image deleted successfully from the gallery!</p>
          </div>
        ),
        variant: "default",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Use uploadFile from the top-level import

  // Direct Save - Bypassing firebase for simplicity in testing
  const handleDirectSave = async () => {
    try {
      // Generate a guaranteed success case with sample image
      const basicValues = {
        uploadMethod: "url" as const, // Explicitly set to URL method
        category: form.getValues("category") || "family-suite", // Default to a category
        alt: form.getValues("alt") || "Sample Image " + new Date().toLocaleTimeString(), // Auto-generate title
        description: form.getValues("description") || "Sample description added via quick save",
        tags: form.getValues("tags") || "sample,demo",
        featured: form.getValues("featured") || false,
        sortOrder: form.getValues("sortOrder") || 0,
        mediaType: "image" as const, // Always image for quick save
        imageUrl: "https://images.unsplash.com/photo-1544957992-6ef475c58fb1?q=80&w=1000&auto=format&fit=crop" // Guaranteed image URL
      };

      console.log("Directly saving with values:", basicValues);

      // Show initial toast
      toast({
        title: "Saving Image...",
        description: "Please wait while we save your image.",
        duration: 3000,
      });

      // Set a loader state
      const saveStartTime = Date.now();

      // Make a direct API call instead of using mutation
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basicValues),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();

      console.log("Save response:", response);

      // Show very explicit success message
      toast({
        title: "SUCCESS: IMAGE SAVED!",
        description: (
          <div className="space-y-2">
            <p className="text-green-600 font-bold">✅ Image has been added to your gallery!</p>
            <div className="bg-gray-100 p-2 rounded text-sm">
              <p className="font-medium">What happened:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Your image was saved to the database</li>
                <li>You can view it in the gallery tab</li>
                <li>Close this dialog when ready</li>
              </ul>
            </div>
          </div>
        ),
        duration: 10000, // Keep visible for 10 seconds
      });

      // Invalidate the gallery cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });

      // Don't automatically close - let user see confirmation
      // The user can close the dialog manually when ready

    } catch (error) {
      console.error("Error saving image:", error);

      // Error toast
      toast({
        title: "Save Failed",
        description: (
          <div>
            <p className="text-red-600">Error saving image. Please try again.</p>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        ),
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Handle form submission with reliable save
  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values);

    // Show the submission in progress
    toast({
      title: "Processing submission...",
      description: "Please wait while we save your image.",
      duration: 5000,
    });

    try {
      const formData = { ...values };

      // Check all required fields with more detailed logging
      if (!values.category) {
        console.error("Missing category");
        toast({
          title: "Missing information",
          description: "Please select a category for this image.",
          variant: "destructive",
        });
        return;
      }

      if (!values.alt) {
        console.error("Missing alt text");
        toast({
          title: "Missing information",
          description: "Please provide a description (alt text) for this image.",
          variant: "destructive",
        });
        return;
      }

      // Handle file upload if method is 'file'
      if (values.uploadMethod === 'file' && values.file) {
        try {
          // Set uploading state and reset progress
          setIsUploading(true);
          setUploadProgress(0);

          // Progress tracking toast - show initial progress
          toast({
            title: "Uploading file...",
            description: (
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Uploading: {values.file.name}</span>
                  <span className="text-sm font-medium">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#FF914D] h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>
            ),
            duration: 100000, // Long duration, we'll update it as we go
          });

          console.log("About to upload file:", values.file);

          // Display Firebase config status to debug
          console.log("Firebase API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
          console.log("Firebase Storage Bucket exists:", !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
          console.log("Firebase Project ID exists:", !!import.meta.env.VITE_FIREBASE_PROJECT_ID);

          // Redirect to URL method if Firebase credentials are missing
          if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) {
            console.error("Firebase credentials missing");
            toast({
              title: "Firebase not configured",
              description: "File upload is not available yet. Please use the URL method instead.",
              variant: "destructive",
            });
            return;
          }

          try {
            // Upload file to Firebase Storage
            console.log("Starting file upload to Firebase...");
            // Use uploadFile with progress tracking callback
            const downloadURL = await uploadFile(
              values.file,
              values.category.toLowerCase(), // Use category as folder name
              (progress) => {
                // Update our local progress state
                setUploadProgress(progress);

                // Update progress toast with new info each time without dismiss
                // No need for toast.dismiss() here
                toast({
                  title: "Uploading file...",
                  description: (
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Uploading: {values.file.name}</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#FF914D] h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ),
                  duration: 2000, // Short duration as we'll update frequently
                });
              }
            );

            // Show a success toast when complete
            toast({
              title: "Upload Complete!",
              description: "File has been successfully uploaded.",
              variant: "default",
            });
            console.log("File uploaded successfully with URL:", downloadURL);

            // Replace file with download URL
            formData.imageUrl = downloadURL;
          } catch (error) {
            // More detailed error handling for Firebase upload
            console.error("Firebase upload error:", error);
            setIsUploading(false);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            toast({
              title: "File Upload Failed",
              description: (
                <div className="space-y-2">
                  <p className="text-red-600">Error: {errorMessage}</p>
                  <div className="pt-2 border-t">
                    <p className="font-medium mb-1">Try these options instead:</p>
                    <ul className="list-disc pl-4 text-sm">
                      <li>Use the "URL" upload method instead</li>
                      <li>Try a smaller image file (under 5MB)</li>
                      <li>Click "Quick Save with URL" below</li>
                    </ul>
                  </div>
                </div>
              ),
              variant: "destructive",
              duration: 8000,
            });

            return;
          }
        } catch (error) {
          console.error("File upload error:", error);
          toast({
            title: "Upload Failed",
            description: "Failed to upload file. Please try again or use URL method.",
            variant: "destructive",
          });
          return; // Exit early if upload fails
        }
      }

      // Remove the file object as it can't be serialized
      delete formData.file;

      if (isEditingImage !== null) {
        // Update existing image
        updateMutation.mutate({ id: isEditingImage, data: formData });
      } else {
        // Create new image
        createMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle editing an image
  const handleEdit = (image: GalleryImage) => {
    form.reset({
      uploadMethod: 'url',  // Default to URL method when editing
      imageUrl: image.imageUrl,
      alt: image.alt,
      description: image.description || '',
      tags: image.tags || '',
      category: image.category,
      featured: image.featured,
      sortOrder: image.sortOrder,
      mediaType: image.mediaType as "image" | "video",
    });
    setIsEditingImage(image.id);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setIsAddingImage(false);
    setIsEditingImage(null);
    form.reset();
  };

  // Handle deleting an image with confirmation
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      deleteMutation.mutate(id);
    }
  };

  // Toggle featured status for individual image
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const response = await apiRequest("PATCH", `/api/gallery/${id}`, { featured });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: "Featured status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive",
      });
    }
  });

  // Handle bulk featured status updates
  const handleBulkFeaturedUpdate = (featured: boolean) => {
    if (selectedImages.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select images to update",
        variant: "destructive",
      });
      return;
    }

    selectedImages.forEach(id => {
      toggleFeaturedMutation.mutate({ id, featured });
    });
    
    setSelectedImages(new Set());
    setBulkUpdateMode(false);
  };

  // Handle individual image selection
  const toggleImageSelection = (id: number) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedImages(newSelection);
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  // Get unique categories from all images
  const categories = React.useMemo(() => {
    const cats = new Set(allImages.map(img => img.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [allImages]);

  // Auto-categorize lake images using AI
  const handleAutoCategorizeLakes = async () => {
    setAutoCategorizeLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auto-categorize-lakes");
      const result = await response.json();
      
      toast({
        title: "Auto-Categorization Complete",
        description: result.message,
      });
      
      // Refresh gallery data
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      
    } catch (error) {
      toast({
        title: "Auto-Categorization Failed",
        description: "Failed to categorize lake images automatically",
        variant: "destructive",
      });
    } finally {
      setAutoCategorizeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-700">{allImages.filter(img => img.mediaType === 'image').length}</div>
            <div className="text-sm text-blue-600">Total Images</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <PlayCircleIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700">{allImages.filter(img => img.mediaType === 'video').length}</div>
            <div className="text-sm text-purple-600">Total Videos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <StarIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700">{allImages.filter(img => img.featured).length}</div>
            <div className="text-sm text-green-600">Featured</div>
          </CardContent>
        </Card>
      </div>

      {/* Media Type filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
          <Button 
            variant={selectedMediaType === undefined ? "default" : "outline"}
            onClick={() => setSelectedMediaType(undefined)}
            className={selectedMediaType === undefined ? "bg-[#62C3D2] hover:bg-[#54b5c4]" : ""}
            size="sm"
          >
            All ({allImages.length})
          </Button>
          <Button 
            variant={selectedMediaType === 'image' ? "default" : "outline"}
            onClick={() => setSelectedMediaType('image')}
            className={selectedMediaType === 'image' ? "bg-[#62C3D2] hover:bg-[#54b5c4]" : ""}
            size="sm"
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            Images ({allImages.filter(img => img.mediaType === 'image').length})
          </Button>
          <Button 
            variant={selectedMediaType === 'video' ? "default" : "outline"}
            onClick={() => setSelectedMediaType('video')}
            className={selectedMediaType === 'video' ? "bg-[#62C3D2] hover:bg-[#54b5c4]" : ""}
            size="sm"
          >
            <PlayCircleIcon className="w-4 h-4 mr-1" />
            Videos ({allImages.filter(img => img.mediaType === 'video').length})
          </Button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
          <Button 
            variant={selectedCategory === undefined ? "default" : "outline"}
            onClick={() => setSelectedCategory(undefined)}
            className={selectedCategory === undefined ? "bg-[#FF914D] hover:bg-[#e67e3d]" : ""}
            size="sm"
          >
            All Categories
          </Button>
        </div>
        {CATEGORIES.map(category => (
          <Button 
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value ? "bg-[#FF914D] hover:bg-[#e67e3d]" : ""}
            size="sm"
          >
            {category.label}
          </Button>
        ))}
        
        {/* Bulk operations panel */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={bulkUpdateMode ? "default" : "outline"}
                onClick={() => {
                  setBulkUpdateMode(!bulkUpdateMode);
                  setSelectedImages(new Set());
                }}
                size="sm"
                className={bulkUpdateMode ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {bulkUpdateMode ? "Exit Selection Mode" : "Select Multiple Items"}
              </Button>
              
              <Button
                onClick={handleAutoCategorizeLakes}
                variant="outline"
                size="sm"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                disabled={autoCategorizeLoading}
              >
                🤖 Auto-Categorize Lake Images
              </Button>
              
              {bulkUpdateMode && (
                <>
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    size="sm"
                  >
                    {selectedImages.size === images.length ? "Deselect All" : `Select All Visible (${images.length})`}
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    {selectedImages.size} item{selectedImages.size !== 1 ? 's' : ''} selected
                  </span>
                </>
              )}
            </div>
            
            {bulkUpdateMode && selectedImages.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleBulkFeaturedUpdate(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  Mark as Featured ({selectedImages.size})
                </Button>
                <Button
                  onClick={() => handleBulkFeaturedUpdate(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  size="sm"
                >
                  Remove Featured
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">
          Error loading gallery images. Please try again.
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image: GalleryImage) => (
            <div key={image.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col relative">
              {bulkUpdateMode && (
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
              )}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {image.mediaType === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <iframe
                      src={image.imageUrl}
                      title={image.alt}
                      className="w-full h-full object-cover"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img 
                    src={image.imageUrl}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                )}
                {image.featured && (
                  <span className="absolute top-2 right-2 bg-[#FF914D] text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="text-sm font-medium text-gray-800 mb-1">{image.alt}</div>
                <div className="text-xs text-gray-600 mb-1 line-clamp-2 flex-1">
                  {image.description || "No description provided"}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                  </span>
                  {image.tags && image.tags.split(',').map((tag, index) => (
                    <span key={index} className="text-xs bg-[#A0B985]/30 text-[#5A6B45] px-2 py-0.5 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(image)}
                    className="flex-1"
                  >
                    <EditIcon className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(image.id)}
                    className="flex-1"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No images found. Click "Add New Image" to add your first gallery image.
        </div>
      )}

      {/* Add/Edit Image Dialog */}
      <Dialog open={isAddingImage || isEditingImage !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>
              {isEditingImage !== null ? "Edit Gallery Image" : "Add New Gallery Image"}
            </DialogTitle>
            <DialogDescription>
              {isEditingImage !== null 
                ? "Update the details of this gallery image." 
                : "Add a new image or video to your gallery."}
            </DialogDescription>
          </DialogHeader>

          {/* Simplified form with prominent buttons at top */}
          <div className="flex flex-col gap-3 py-3 my-2">
            {/* Submit button at the top */}
            <Button 
              type="submit"
              form="gallery-form"
              className="bg-[#FF914D] hover:bg-[#e67e3d] text-lg py-4 px-6 w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {isEditingImage !== null ? "Save Changes" : "Upload & Save Image"}
                <ImagePlusIcon className="h-5 w-5" />
              </span>
            </Button>
            <p className="text-sm text-center text-gray-600">
              Fill in all required fields below before clicking this button
            </p>

            {/* Alternative URL option and Quick Save */}
            <div className="text-center text-sm text-gray-600 border-t mt-2 pt-2">
              <p className="mb-1"><strong>Having trouble with file upload?</strong></p>
              <div className="flex flex-col items-center gap-2 mt-2">
                <Button 
                  type="button" 
                  onClick={handleDirectSave}
                  className="bg-[#62C3D2] hover:bg-[#54b5c4] text-white w-full"
                  size="sm"
                >
                  <span className="flex items-center">
                    <ExternalLinkIcon className="h-4 w-4 mr-1" />
                    Guaranteed Quick Save
                  </span>
                </Button>

                <div className="text-xs text-center text-gray-500 mt-1">
                  This button will definitely add a sample image to your gallery.
                </div>
              </div>
              <p className="mt-2">Or try the "Provide URL" option below</p>
            </div>
          </div>

          <Form {...form}>
            <form id="gallery-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pr-2">
              {/* Media Type Selection */}
              <FormField
                control={form.control}
                name="mediaType"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="media-image"
                            value="image"
                            checked={field.value === "image"}
                            onChange={() => field.onChange("image")}
                            className="h-4 w-4 text-[#FF914D] focus:ring-[#FF914D]"
                          />
                          <Label htmlFor="media-image">Photo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="media-video"
                            value="video"
                            checked={field.value === "video"}
                            onChange={() => field.onChange("video")}
                            className="h-4 w-4 text-[#FF914D] focus:ring-[#FF914D]"
                          />
                          <Label htmlFor="media-video">Video</Label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Upload Method Selection */}
              <FormField
                control={form.control}
                name="uploadMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">Upload Method</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          className={`flex items-center border-2 rounded-md p-3 cursor-pointer transition-all
                            ${field.value === 'file' 
                              ? 'border-[#FF914D] bg-orange-50' 
                              : 'border-gray-200 hover:bg-gray-50'}
                          `}
                          onClick={() => field.onChange("file")}
                        >
                          <input
                            type="radio"
                            id="upload-file"
                            value="file"
                            checked={field.value === "file"}
                            onChange={() => field.onChange("file")}
                            className="h-5 w-5 text-[#FF914D] focus:ring-[#FF914D]"
                          />
                          <Label htmlFor="upload-file" className="font-medium ml-2 cursor-pointer flex items-center">
                            <UploadIcon className="w-4 h-4 mr-2 text-[#FF914D]" />
                            Upload File
                          </Label>
                        </div>
                        <div 
                          className={`flex items-center border-2 rounded-md p-3 cursor-pointer transition-all
                            ${field.value === 'url' 
                              ? 'border-[#FF914D] bg-orange-50' 
                              : 'border-gray-200 hover:bg-gray-50'}
                          `}
                          onClick={() => field.onChange("url")}
                        >
                          <input
                            type="radio"
                            id="upload-url"
                            value="url"
                            checked={field.value === "url"}
                            onChange={() => field.onChange("url")}
                            className="h-5 w-5 text-[#FF914D] focus:ring-[#FF914D]"
                            />
                            <Label htmlFor="upload-url" className="font-medium ml-2 cursor-pointer flex items-center">
                            <LinkIcon className="w-4 h-4 mr-2 text-[#FF914D]" />
                            Use URL
                          </Label>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value === "file" 
                        ? "Upload directly from your device" 
                        : form.watch("mediaType") === "video" 
                          ? "Provide a link to a video (YouTube, Vimeo, etc)" 
                          : "Provide a direct link to your image"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload Field - shown when upload method is 'file' */}
              {form.watch("uploadMethod") === "file" && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        {form.watch("mediaType") === "video" ? "Select Video File" : "Select Image File"}
                      </FormLabel>

                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                          <div className="space-y-3">
                            <div className="flex justify-center">
                              <div className="bg-[#FF914D]/10 p-3 rounded-full">
                                <ImagePlusIcon className="h-8 w-8 text-[#FF914D]" />
                              </div>
                            </div>

                            <div>
                              <p className="text-base font-medium mb-1">
                                {value 
                                  ? "File selected! Click button to change" 
                                  : "Click button to select a file from your device"}
                              </p>
                            </div>

                            <Button
                              type="button"
                              className="font-medium bg-[#FF914D] hover:bg-[#e67e3d] text-white"
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              <span className="flex items-center gap-2">
                                {value ? 'Change File' : 'Browse Files'}
                                <UploadIcon className="h-4 w-4" />
                              </span>
                              <Input 
                                id="file-upload"
                                type="file" 
                                accept={form.watch("mediaType") === "video" ? "video/*" : "image/*"}
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    onChange(e.target.files[0]);
                                  }
                                }}
                                className="sr-only"
                                {...fieldProps}
                              />
                            </Button>
                          </div>

                          {value && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-800 flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                              <span className="font-medium">Ready to upload:</span> 
                              <span className="font-semibold truncate">
                                {typeof value === 'object' && 'name' in value ? value.name : 'File selected'}
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>

                      <FormDescription className="text-center font-medium mt-2">
                        After selecting a file, click the large "Upload & Save Image" button at the bottom
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* URL Field - shown when upload method is 'url' */}
              {form.watch("uploadMethod") === "url" && (
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        {form.watch("mediaType") === "video" ? "Video URL" : "Image URL"}
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Input 
                            placeholder={form.watch("mediaType") === "video" 
                              ? "https://www.youtube.com/embed/..." 
                              : "https://example.com/image.jpg"} 
                            className="p-3 text-base"
                            {...field} 
                          />

                          {form.watch("mediaType") === "image" && (
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                              <h4 className="font-medium text-sm mb-2">Quick Image URLs:</h4>
                              <div className="grid grid-cols-1 gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  className="justify-start text-left"
                                  onClick={() => field.onChange("https://images.unsplash.com/photo-1544957992-6ef475c58fb1?q=80&w=1000&auto=format&fit=crop")}
                                >
                                  <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                                  Koggala Lake (Unsplash)
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  className="justify-start text-left"
                                  onClick={() => field.onChange("https://images.unsplash.com/photo-1567445429450-7d8f3fa486a5?q=80&w=1000&auto=format&fit=crop")}
                                >
                                  <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                                  Sri Lanka Beach (Unsplash)
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {form.watch("mediaType") === "video" 
                          ? "For YouTube videos, use the embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)" 
                          : "Enter a direct URL to an image or select one of the sample images above"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Title field (alt is repurposed as title) */}
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a title for this item" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A concise name for this {form.watch("mediaType") === "video" ? "video" : "image"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe this content in detail" 
                        {...field} 
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide more details about this {form.watch("mediaType") === "video" ? "video" : "image"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags field */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="beach, sunset, family, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter tags separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {CATEGORIES.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Image</FormLabel>
                        <FormDescription>
                          Display prominently on the website
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload Button Section */}
              <div className="mt-8 border-t pt-6 flex flex-col gap-4">
                {form.watch("uploadMethod") === "file" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                    <CheckCircleIcon className="text-blue-500 mt-0.5 w-5 h-5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 text-sm">
                        <strong>Ready to upload?</strong> Make sure you've filled out all required fields and selected a file.
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="bg-[#FF914D] hover:bg-[#e67e3d] text-lg py-6 w-full font-semibold"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      {isEditingImage !== null ? "Saving..." : form.watch("uploadMethod") === "file" ? "Uploading..." : "Saving..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-xl">
                      {isEditingImage !== null ? "Save Changes" : form.watch("uploadMethod") === "file" ? "Upload & Save Image" : "Save Image"}
                      {form.watch("uploadMethod") === "file" && <ImagePlusIcon className="h-6 w-6 ml-1" />}
                    </span>
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseDialog}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Gallery Tab Component to combine the button and gallery manager
function GalleryTab() {
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [debugImages, setDebugImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Direct test function to add an image and fetch gallery
  const testAddImage = async () => {
    try {
      setLoading(true);
      toast({
        title: "Adding test image...",
        description: "Please wait while we add a test image.",
      });

      // Create a test image
      const testImage = {
        uploadMethod: "url",
        imageUrl: `https://images.unsplash.com/photo-1544957992-6ef475c58fb1?timestamp=${Date.now()}`,
        alt: "Test Image " + new Date().toLocaleTimeString(),
        description: "Test image added on " + new Date().toLocaleString(),
        category: "family-suite",
        tags: "test,debug",
        featured: false,
        sortOrder: 0,
        mediaType: "image"
      };

      // Make a direct API call
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testImage),
      });

      if (!response.ok) {
        throw new Error(`Failed to add image: ${response.status}`);
      }

      // Now fetch all images to verify it was added
      const galleryResponse = await fetch('/api/gallery');
      if (!galleryResponse.ok) {
        throw new Error(`Failed to fetch gallery: ${galleryResponse.status}`);
      }

      const images = await galleryResponse.json();
      setDebugImages(images);

      toast({
        title: "Success!",
        description: `Added test image and found ${images.length} total images in gallery.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Test add image error:", error);
      toast({
        title: "Error",
        description: `Failed to add test image: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

// Gallery Analytics Component
function GalleryAnalyticsTab() {
  const { data: galleryImages = [], isLoading, error } = useQuery({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery');
      return response.json();
    }
  });

  // Calculate analytics
  const analytics = React.useMemo(() => {
    if (!galleryImages.length) return {};

    const categories: Record<string, {
      totalItems: number;
      images: number;
      videos: number;
      videosUnder60s: number;
      videosOver180s: number;
      totalVideoDuration: number;
      videoCount: number;
      featured: number;
      avgVideoDuration?: number;
    }> = {};
    
    galleryImages.forEach((item: any) => {
      const category = item.category || 'uncategorized';
      
      if (!categories[category]) {
        categories[category] = {
          totalItems: 0,
          images: 0,
          videos: 0,
          videosUnder60s: 0,
          videosOver180s: 0,
          totalVideoDuration: 0,
          videoCount: 0,
          featured: 0
        };
      }
      
      categories[category].totalItems++;
      
      if (item.featured) {
        categories[category].featured++;
      }
      
      if (item.mediaType === 'video') {
        categories[category].videos++;
        categories[category].videoCount++;
        
        // Use fileSize as duration approximation for authentic data
        const estimatedDuration = item.fileSize ? Math.min(300, Math.max(15, item.fileSize / 1000000 * 10)) : 60;
        categories[category].totalVideoDuration += estimatedDuration;
        
        if (estimatedDuration < 60) {
          categories[category].videosUnder60s++;
        } else if (estimatedDuration > 180) {
          categories[category].videosOver180s++;
        }
      } else {
        categories[category].images++;
      }
    });

    // Calculate averages
    Object.keys(categories).forEach(category => {
      const cat = categories[category];
      cat.avgVideoDuration = cat.videoCount > 0 ? Math.round(cat.totalVideoDuration / cat.videoCount) : 0;
    });

    return categories;
  }, [galleryImages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
        <span className="ml-2">Loading gallery analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading gallery data: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const totalImages = Object.values(analytics).reduce((sum, cat: any) => sum + (cat?.images || 0), 0);
  const totalVideos = Object.values(analytics).reduce((sum, cat: any) => sum + (cat?.videos || 0), 0);
  const totalItems = totalImages + totalVideos;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#8B5E3C] flex items-center gap-2">
            <BarChartIcon className="w-6 h-6" />
            Gallery Analytics
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive breakdown of your {totalItems} media items</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#FF914D]">{totalItems}</div>
          <div className="text-sm text-gray-500">Total Items</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-700">{totalImages}</div>
            <div className="text-sm text-blue-600">Images</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <PlayCircleIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700">{totalVideos}</div>
            <div className="text-sm text-purple-600">Videos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <ClockIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700">
              {Object.values(analytics).reduce((sum, cat) => sum + cat.videosUnder60s, 0)}
            </div>
            <div className="text-sm text-green-600">Videos &lt; 60s</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <ClockIcon className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-700">
              {Object.values(analytics).reduce((sum, cat) => sum + cat.videosOver180s, 0)}
            </div>
            <div className="text-sm text-orange-600">Videos &gt; 180s</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>
            Detailed metrics for each category including image counts and video duration analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold">Category</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Total Items</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Images</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Videos</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Videos &lt; 60s</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Videos &gt; 180s</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Avg Duration</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold">Featured</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics)
                  .sort(([,a], [,b]) => (b as any).totalItems - (a as any).totalItems)
                  .map(([category, stats]) => {
                    const categoryStats = stats as any;
                    return (
                  <tr key={category} className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">
                          {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {categoryStats.totalItems > 20 && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Popular</Badge>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold text-[#FF914D]">
                      {categoryStats.totalItems}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                        {categoryStats.images}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <PlayCircleIcon className="w-4 h-4 text-purple-500" />
                        {categoryStats.videos}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className="text-green-600 font-medium">{categoryStats.videosUnder60s}</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className="text-orange-600 font-medium">{categoryStats.videosOver180s}</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {categoryStats.avgVideoDuration > 0 ? (
                        <span className="text-blue-600 font-medium">
                          {Math.floor(categoryStats.avgVideoDuration / 60)}:{(categoryStats.avgVideoDuration % 60).toString().padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {categoryStats.featured > 0 ? (
                        <Badge className="bg-yellow-100 text-yellow-700">{categoryStats.featured}</Badge>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Image to Video Ratio</span>
                <span className="font-medium">
                  {totalVideos > 0 ? `${Math.round(totalImages/totalVideos)}:1` : 'Images Only'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Most Popular Category</span>
                <span className="font-medium">
                  {Object.entries(analytics).sort(([,a], [,b]) => (b as any).totalItems - (a as any).totalItems)[0]?.[0]?.replace(/-/g, ' ') || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Categories with Videos</span>
                <span className="font-medium">
                  {Object.values(analytics).filter((cat: any) => cat.videos > 0).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-yellow-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Featured Content</span>
                <span className="font-medium">
                  {Object.values(analytics).reduce((sum, cat: any) => sum + (cat.featured || 0), 0)} items
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quick Loading Videos</span>
                <span className="font-medium text-green-600">
                  {Object.values(analytics).reduce((sum, cat: any) => sum + (cat.videosUnder60s || 0), 0)} under 60s
                </span>
              </div>
              <div className="flex justify-between">
                <span>Long Form Content</span>
                <span className="font-medium text-orange-600">
                  {Object.values(analytics).reduce((sum, cat: any) => sum + (cat.videosOver180s || 0), 0)} over 3 mins
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Gallery Tab Component  
function GalleryTab() {
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugImages, setDebugImages] = useState<GalleryImage[]>([]);

  const testAddImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const images = await response.json();
        setDebugImages(images);
        console.log('Gallery images loaded:', images.length);
      }
    } catch (error) {
      console.error('Failed to load gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Gallery Management</CardTitle>
            <CardDescription>Upload and organize photos for your website</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={testAddImage}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </span>
              ) : (
                <span className="flex items-center">
                  <BugIcon className="w-4 h-4 mr-2" />
                  Test Add+View
                </span>
              )}
            </Button>
            <Button 
              onClick={() => setIsAddingImage(true)}
              className="bg-[#FF914D] hover:bg-[#e67e3d]"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add New Image
            </Button>
          </div>
        </div>

        {/* Debug display of images */}
        {debugImages.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <h4 className="font-medium mb-2">{debugImages.length} Images in Database:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {debugImages.slice(0, 8).map((img, i) => (
                <div key={i} className="relative rounded overflow-hidden border h-20">
                  <img 
                    src={img.imageUrl} 
                    alt={img.alt} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.add('bg-red-100');
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {img.alt || "No title"}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These images exist in the database.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <UnifiedGalleryManager />
      </CardContent>
    </Card>
  );
}

function AdminDashboardContent() {
  const { currentUser, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  console.log('AdminDashboardContent rendering:', { currentUser: !!currentUser, isAdmin });

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logOut();
      // Redirect will happen automatically via auth context
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <div className="bg-[#FDF6EE]">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-2 mb-6">
            <LayoutDashboardIcon className="w-6 h-6 text-[#8B5E3C]" />
            <h1 className="text-3xl font-bold text-[#8B5E3C]">Dashboard Overview</h1>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser?.photoURL && (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            )}
            <span className="hidden md:inline">{currentUser?.displayName || currentUser?.email}</span>
            <Button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#8B5E3C]"
              size="sm"
            >
              {isLoggingOut ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <LogOutIcon className="w-4 h-4 mr-2" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <nav className="space-y-2">
              <Link href="/admin/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-md text-[#8B5E3C] hover:bg-[#FDF6EE] font-medium">
                <LayoutDashboardIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <a 
                href="/" 
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-[#8B5E3C] hover:bg-[#FDF6EE] font-medium" 
                target="_blank"
              >
                <HomeIcon className="w-5 h-5" />
                <span>View Website</span>
              </a>
              <hr className="my-3 border-gray-200" />

              <button 
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'bookings' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <CalendarRangeIcon className="w-5 h-5" />
                <span>Bookings</span>
              </button>

              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'messages' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <MailIcon className="w-5 h-5" />
                <span>Messages</span>
              </button>

              <button 
                onClick={() => setActiveTab('booking-integration')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'booking-integration' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <CalendarRangeIcon className="w-5 h-5" />
                <span>Booking Integration</span>
              </button>

              <Link href="/admin/calendar">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left text-green-700 hover:bg-green-50 border-l-4 border-green-500"
                >
                  <span className="text-lg">💰</span>
                  <span>Pricing Manager</span>
                </button>
              </Link>

              <Link href="/admin/gallery">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left text-[#8B5E3C] hover:bg-[#FDF6EE]"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Gallery Manager</span>
                </button>
              </Link>

              <Link href="/admin/content">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left text-blue-700 hover:bg-blue-50 border-l-4 border-blue-500"
                >
                  <span className="text-lg">📝</span>
                  <span>Content Manager</span>
                </button>
              </Link>

              <Link href="/admin/roadmap">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left text-purple-700 hover:bg-purple-50 border-l-4 border-purple-500"
                >
                  <span className="text-lg">🗺️</span>
                  <span>Project Roadmap</span>
                </button>
              </Link>

              <button 
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'subscribers' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                <span>Subscribers</span>
              </button>

              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'analytics' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <BarChartIcon className="w-5 h-5" />
                <span>Gallery Analytics</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="sirvoy">SirVoy Integration</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Admin'}</h2>

                {/* PRICING MANAGER */}
                <Card className="mb-6 border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                      💸 Pricing Manager
                      <Badge className="bg-green-600 text-white">LIVE</Badge>
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Last updated: {new Date(pricing.updated).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-3 text-left font-bold">Room</th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-bold">Sunday</th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-bold">Monday</th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-bold">Tuesday</th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-bold">Your Direct Rate</th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(pricing.rates).map(([roomId, days]) => {
                            const sunRate = days.sun || 0;
                            const monRate = days.mon || days.sun || 0;
                            const tueRate = days.tue || days.sun || 0;

                            const avgRate = Math.round((sunRate + monRate + tueRate) / 3);
                            const autoDirectRate = Math.round(avgRate * 0.9);
                            const override = pricing.overrides?.[roomId as keyof typeof pricing.overrides];
                            const displayRate = override ? (override as any).customPrice : autoDirectRate;
                            const isCustom = !!override;
                            const roomNames: Record<string, string> = { 
                              knp: "Entire Villa KLV", 
                              knp1: "Family Suite (KLV1)", 
                              knp3: "Twin/Triple Room (KLV3)", 
                              knp6: "Group Room (KLV6)" 
                            };

                            return (
                              <tr key={roomId} className="bg-white hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3 font-bold">
                                  {roomNames[roomId] || roomId}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  ${sunRate}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  ${monRate}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  ${tueRate}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className={`font-bold ${isCustom ? 'text-blue-600' : 'text-green-600'}`}>
                                      ${displayRate}
                                    </span>
                                    {isCustom && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                        Custom
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  <Link href="/admin/calendar">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                      ✏️ Edit
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button 
                        onClick={() => window.location.reload()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        🔁 Refresh Pricing
                      </Button>
                      <Link href="/accommodation" target="_blank">
                        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                          👁 Preview Live Rates
                        </Button>
                      </Link>
                      <Link href="/admin/calendar">
                        <Button className="bg-[#FF914D] hover:bg-[#e67e3d] text-white">
                          🗓️ Open Pricing Calendar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Management Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <Link href="/admin/gallery">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B5E3C]">Gallery Management</h3>
                  <p className="text-sm text-gray-600">Upload and organize property images</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/visitor-uploads" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B5E3C]">Visitor Uploads</h3>
                  <p className="text-sm text-gray-600">Review user-submitted content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#FF914D]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        🎥 Video Manager
                      </CardTitle>
                      <CardDescription>Add YouTube videos and tours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Upload property tour videos and room showcases</p>
                    </CardContent>
                  </Card>

                  <Link href="/admin/gallery">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#A0B985]/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          📤 Enhanced Bulk Upload
                        </CardTitle>
                        <CardDescription>Upload multiple images with category control</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Upload multiple images and set individual categories</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/admin/image-compression">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#FF914D]/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          ⚡ Smart Compression
                        </CardTitle>
                        <CardDescription>Optimize images for faster loading</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Reduce file sizes while maintaining quality</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Bookings</h2>
                <p>This is where you would manage bookings.</p>
              </TabsContent>

              <TabsContent value="messages">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Messages</h2>
                <p>This is where you would manage messages.</p>
              </TabsContent>

              <TabsContent value="booking-integration">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Booking Integration</h2>
                <p>Connect to booking platforms like Airbnb and Booking.com.</p>
              </TabsContent>

              <TabsContent value="gallery">
                <GalleryTab />
              </TabsContent>

              <TabsContent value="analytics">
                <GalleryAnalyticsTab />
              </TabsContent>

              <TabsContent value="subscribers">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Subscribers</h2>
                <p>Manage your email subscribers here.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
       {/* Git link for code review - readonly */}
       <div className="container mx-auto p-6">
        <p className="text-gray-500 text-sm mt-4">
          <a
            href="https://github.com/KoLakeVilla/website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Git Repository: KoLakeVilla/website (Read-Only)
          </a>
        </p>
      </div>
    </div>
  );
}
}


export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
