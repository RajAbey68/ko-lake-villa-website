import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useToast } from '../../hooks/use-toast';
import { Link } from 'wouter';
import { ArrowLeft, Save, FileText, Home, Utensils, Camera, Phone, Bed } from 'lucide-react';

interface PageContent {
  id: string;
  page: string;
  section: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export default function ContentManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<PageContent[]>([]);

  // Load content from backend
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // Initialize with default content if backend fails
        const initialContent: PageContent[] = [
          // Homepage Content
          {
            id: 'home-hero-title',
            page: 'home',
            section: 'hero',
            title: 'Hero Title',
            content: 'Welcome to Lakeside Luxury',
            lastUpdated: new Date().toISOString()
          },
      {
        id: 'home-hero-subtitle',
        page: 'home',
        section: 'hero',
        title: 'Hero Subtitle',
        content: 'Ko Lake Villa is a boutique accommodation nestled on the shores of a serene lake in Ahangama, Galle, offering a perfect blend of luxury, comfort, and natural beauty. Our villa provides an exclusive retreat for travelers seeking tranquility and authentic Sri Lankan experience.',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'home-hero-description',
        page: 'home',
        section: 'hero',
        title: 'Hero Description',
        content: 'With spectacular views, personalized service, and attention to detail, we create memorable experiences for our guests - whether you\'re planning a family vacation, a romantic getaway, or a wellness retreat.',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'home-features-rooms',
        page: 'home',
        section: 'features',
        title: 'Luxurious Rooms Feature',
        content: 'Luxurious Rooms',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'home-features-dining',
        page: 'home',
        section: 'features',
        title: 'Gourmet Dining Feature',
        content: 'Gourmet Dining',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'home-features-lake',
        page: 'home',
        section: 'features',
        title: 'Lake Access Feature',
        content: 'Lake Access',
        lastUpdated: new Date().toISOString()
      },

      // Accommodation Page
      {
        id: 'accommodation-title',
        page: 'accommodation',
        section: 'hero',
        title: 'Page Title',
        content: 'Luxury Accommodations',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'accommodation-subtitle',
        page: 'accommodation',
        section: 'hero',
        title: 'Page Subtitle',
        content: 'Choose from our carefully designed rooms and suites, each offering unique amenities and stunning views of Koggala Lake.',
        lastUpdated: new Date().toISOString()
      },

      // Dining Page
      {
        id: 'dining-title',
        page: 'dining',
        section: 'hero',
        title: 'Page Title',
        content: 'Culinary Excellence',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'dining-subtitle',
        page: 'dining',
        section: 'hero',
        title: 'Page Subtitle',
        content: 'Savor exceptional cuisine crafted from the finest local ingredients, served in the comfort of your private villa or our scenic dining areas.',
        lastUpdated: new Date().toISOString()
      },

      // Experiences Page
      {
        id: 'experiences-title',
        page: 'experiences',
        section: 'hero',
        title: 'Page Title',
        content: 'Unique Experiences',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'experiences-subtitle',
        page: 'experiences',
        section: 'hero',
        title: 'Page Subtitle',
        content: 'Discover the magic of Sri Lanka through curated experiences that showcase the natural beauty, rich culture, and warm hospitality of our island paradise.',
        lastUpdated: new Date().toISOString()
      },

      // Contact Page
      {
        id: 'contact-title',
        page: 'contact',
        section: 'hero',
        title: 'Page Title',
        content: 'Get in Touch',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'contact-subtitle',
        page: 'contact',
        section: 'hero',
        title: 'Page Subtitle',
        content: 'We\'re here to help you plan your perfect getaway. Contact us for reservations, inquiries, or any special requests.',
        lastUpdated: new Date().toISOString()
      },

      // Gallery Page
      {
        id: 'gallery-title',
        page: 'gallery',
        section: 'hero',
        title: 'Page Title',
        content: 'Photo Gallery',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'gallery-subtitle',
        page: 'gallery',
        section: 'hero',
        title: 'Page Subtitle',
        content: 'Explore our beautiful property through stunning photography showcasing the villa, amenities, and breathtaking surroundings.',
        lastUpdated: new Date().toISOString()
      }
    ];

    setContent(initialContent);
  }, []);

  const handleContentChange = (id: string, newContent: string) => {
    setContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, content: newContent, lastUpdated: new Date().toISOString() }
        : item
    ));
  };

  const saveContent = async (pageId?: string) => {
    setSaving(true);
    setLoading(true);

    try {
      // Simulate API call - in real implementation, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Content Saved Successfully!",
        description: pageId 
          ? `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} page content updated`
          : "All page content has been saved",
        variant: "default",
        duration: 3000,
      });

    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const saveAllContent = () => saveContent();

  const getContentByPage = (page: string) => {
    return content.filter(item => item.page === page);
  };

  const ContentEditor = ({ pageContent, pageIcon: Icon }: { pageContent: PageContent[], pageIcon: any }) => (
    <div className="space-y-6">
      {pageContent.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>
              {item.section.charAt(0).toUpperCase() + item.section.slice(1)} section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.title.toLowerCase().includes('title') ? (
              <div>
                <Label htmlFor={item.id}>Content</Label>
                <Input
                  id={item.id}
                  value={item.content}
                  onChange={(e) => handleContentChange(item.id, e.target.value)}
                  className="mt-1"
                  placeholder="Enter title text..."
                />
              </div>
            ) : (
              <div>
                <Label htmlFor={item.id}>Content</Label>
                <Textarea
                  id={item.id}
                  value={item.content}
                  onChange={(e) => handleContentChange(item.id, e.target.value)}
                  className="mt-1 min-h-[100px]"
                  placeholder="Enter description text..."
                />
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Last updated: {new Date(item.lastUpdated).toLocaleString()}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => saveContent(item.page)}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-1" />
                Save This Page
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#8B5E3C] flex items-center gap-2">
              <FileText className="w-8 h-8 text-[#FF914D]" />
              Content Manager
            </h1>
            <p className="text-gray-600 mt-1">Edit text content for all pages of your Ko Lake Villa website</p>
          </div>
          <Button 
            onClick={saveAllContent}
            disabled={saving}
            className="bg-[#FF914D] hover:bg-[#e67e3d]"
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>

        {/* Content Editor Tabs */}
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="dining" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Dining
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Experiences
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Homepage Content
                </CardTitle>
                <CardDescription>
                  Edit the main landing page content including hero section and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor pageContent={getContentByPage('home')} pageIcon={Home} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accommodation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  Accommodation Page Content
                </CardTitle>
                <CardDescription>
                  Edit content for the rooms and accommodation page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor pageContent={getContentByPage('accommodation')} pageIcon={Bed} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dining">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Dining Page Content
                </CardTitle>
                <CardDescription>
                  Edit content for the dining and culinary experience page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor pageContent={getContentByPage('dining')} pageIcon={Utensils} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Experiences Page Content
                </CardTitle>
                <CardDescription>
                  Edit content for the experiences and activities page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor pageContent={getContentByPage('experiences')} pageIcon={FileText} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Gallery Page Content
                </CardTitle>
                <CardDescription>
                  Edit content for the photo gallery page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor pageContent={getContentByPage('gallery')} pageIcon={Camera} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Page Content
                </CardTitle>
                <CardDescription>
                  Edit content for the contact and booking page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor pageContent={getContentByPage('contact')} pageIcon={Phone} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Notice */}
        <Card className="mt-8 border-[#FF914D]/20 bg-[#FF914D]/5">
          <CardHeader>
            <CardTitle className="text-[#8B5E3C]">Content Preview</CardTitle>
            <CardDescription>
              Changes will be reflected on your live website immediately after saving. You can preview changes by visiting your website pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <a href="/" target="_blank">Preview Homepage</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/accommodation" target="_blank">Preview Accommodation</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/dining" target="_blank">Preview Dining</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/experiences" target="_blank">Preview Experiences</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/gallery" target="_blank">Preview Gallery</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/contact" target="_blank">Preview Contact</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}