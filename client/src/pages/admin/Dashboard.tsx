import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { logOut } from '../../lib/firebase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Spinner } from '../../components/ui/spinner';
import { useToast } from '../../hooks/use-toast'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../../lib/queryClient';
import { z } from 'zod';
// Import GalleryImage type directly to fix the import error
type GalleryImage = {
  id: number;
  imageUrl: string;
  alt: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  mediaType: string;
};
import { 
  HomeIcon, 
  LayoutDashboardIcon, 
  LogOutIcon, 
  MailIcon, 
  CalendarRangeIcon, 
  ImageIcon, 
  UsersIcon,
  EditIcon,
  TrashIcon,
  ImagePlusIcon,
  CheckCircleIcon,
  ExternalLinkIcon
} from 'lucide-react';

// Forward declaration of components
function AdminDashboardContent();
function GalleryTab();
function GalleryManager(props: GalleryManagerProps);

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

// Validation schema for gallery images
const galleryImageSchema = z.object({
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  alt: z.string().min(3, { message: "Alt text must be at least 3 characters" }),
  category: z.string().min(2, { message: "Please select a category" }),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().nonnegative().default(0),
  mediaType: z.enum(["image", "video"]).default("image"),
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
  
  // Load gallery images
  const { data: images = [], isLoading, isError } = useQuery<GalleryImage[]>({
    queryKey: [selectedCategory ? `/api/gallery?category=${selectedCategory}` : '/api/gallery'],
    retry: false
  });
  
  // Form for adding/editing images
  const form = useForm<FormValues>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      imageUrl: '',
      alt: '',
      category: '',
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
        title: "Success",
        description: "Image added successfully",
        variant: "default",
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
        title: "Success",
        description: "Image updated successfully",
        variant: "default",
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
        title: "Success",
        description: "Image deleted successfully",
        variant: "default",
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
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (isEditingImage !== null) {
      // Update existing image
      updateMutation.mutate({ id: isEditingImage, data: values });
    } else {
      // Create new image
      createMutation.mutate(values);
    }
  };
  
  // Handle editing an image
  const handleEdit = (image: GalleryImage) => {
    form.reset({
      imageUrl: image.imageUrl,
      alt: image.alt,
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
  
  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant={selectedCategory === undefined ? "default" : "outline"}
          onClick={() => setSelectedCategory(undefined)}
          className={selectedCategory === undefined ? "bg-[#FF914D] hover:bg-[#e67e3d]" : ""}
        >
          All Categories
        </Button>
        {CATEGORIES.map(category => (
          <Button 
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value ? "bg-[#FF914D] hover:bg-[#e67e3d]" : ""}
          >
            {category.label}
          </Button>
        ))}
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
            <div key={image.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col">
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
                <div className="text-sm text-gray-700 mb-1 line-clamp-2 flex-1">{image.alt}</div>
                <div className="text-xs text-gray-500 mb-2">
                  Category: {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
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
        <DialogContent className="sm:max-w-[600px]">
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mediaType"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Media Type</FormLabel>
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
                          <Label htmlFor="media-image">Image</Label>
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
                          <Label htmlFor="media-video">Video Embed</Label>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value === "video" 
                        ? "Enter an embed URL (YouTube, Vimeo, etc)" 
                        : "Enter a direct link to your image"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.watch("mediaType") === "video" ? "Video URL" : "Image URL"}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe this image" 
                        {...field} 
                        className="resize-none"
                      />
                    </FormControl>
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
                      <SelectContent>
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
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#FF914D] hover:bg-[#e67e3d]"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Spinner size="sm" className="mr-2" />
                  )}
                  {isEditingImage !== null ? "Update Image" : "Add Image"}
                </Button>
              </DialogFooter>
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
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Gallery Management</CardTitle>
          <CardDescription>Upload and organize photos for your website</CardDescription>
        </div>
        <Button 
          onClick={() => setIsAddingImage(true)}
          className="bg-[#FF914D] hover:bg-[#e67e3d]"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Add New Image
        </Button>
      </CardHeader>
      <CardContent>
        <GalleryManager isAddingImage={isAddingImage} setIsAddingImage={setIsAddingImage} />
      </CardContent>
    </Card>
  );
}

function AdminDashboardContent() {
  const { currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Admin Header */}
      <header className="bg-[#8B5E3C] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboardIcon className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Ko Lake Villa Admin</h1>
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
      </header>

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
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium w-full text-left ${
                  activeTab === 'gallery' 
                    ? 'bg-[#FDF6EE] text-[#FF914D]' 
                    : 'text-[#8B5E3C] hover:bg-[#FDF6EE]'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Gallery</span>
              </button>
              
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
            </nav>
          </div>

          {/* Main Content Area */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#8B5E3C]">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Admin'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Pending Bookings</CardTitle>
                      <CardDescription>Booking requests awaiting review</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#FF914D]">3</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Unread Messages</CardTitle>
                      <CardDescription>Contact messages to respond to</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#FF914D]">5</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Newsletter Subscribers</CardTitle>
                      <CardDescription>Total subscriber count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#FF914D]">42</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest events on your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CalendarRangeIcon className="w-5 h-5 text-[#FF914D] mt-0.5" />
                        <div>
                          <p className="font-medium">New booking request</p>
                          <p className="text-sm text-gray-500">Robert Moore booked the Family Suite for Jun 15-20, 2025</p>
                          <p className="text-xs text-gray-400">Today, 2:34 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MailIcon className="w-5 h-5 text-[#FF914D] mt-0.5" />
                        <div>
                          <p className="font-medium">New contact message</p>
                          <p className="text-sm text-gray-500">Sarah Williams asked about wheelchair accessibility</p>
                          <p className="text-xs text-gray-400">Today, 11:20 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <UsersIcon className="w-5 h-5 text-[#FF914D] mt-0.5" />
                        <div>
                          <p className="font-medium">New newsletter subscriber</p>
                          <p className="text-sm text-gray-500">james.wilson@example.com joined your mailing list</p>
                          <p className="text-xs text-gray-400">Yesterday, 5:42 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>Manage booking requests and availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">Bookings management functionality will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Messages</CardTitle>
                    <CardDescription>View and respond to contact form submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">Contact messages functionality will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gallery">
                <GalleryTab />
              </TabsContent>
              
              <TabsContent value="subscribers">
                <Card>
                  <CardHeader>
                    <CardTitle>Newsletter Subscribers</CardTitle>
                    <CardDescription>Manage your email subscribers list</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">Subscriber management functionality will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}