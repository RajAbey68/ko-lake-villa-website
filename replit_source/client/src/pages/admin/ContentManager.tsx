import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useToast } from '../../hooks/use-toast';
import { Link } from 'wouter';
import { ArrowLeft, Save, FileText, Home, Utensils, Camera, Phone, Bed } from 'lucide-react';
import EnhancedContentManager from '../../components/EnhancedContentManager';
import { uploadFile } from '../../lib/firebaseStorage';

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
        // Convert object structure to array format
        if (data.pages) {
          const contentArray: PageContent[] = [];
          Object.entries(data.pages).forEach(([pageName, pageData]: [string, any]) => {
            Object.entries(pageData).forEach(([key, value]: [string, any]) => {
              contentArray.push({
                id: `${pageName}-${key}`,
                page: pageName,
                section: key === 'title' ? 'hero' : 'content',
                title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                content: value as string,
                lastUpdated: data.lastUpdated || new Date().toISOString()
              });
            });
          });
          
          // Add default sections for pages that need more content
          const pagesWithDefaults = ['home', 'accommodation', 'dining', 'experiences', 'gallery', 'contact'];
          pagesWithDefaults.forEach(pageName => {
            const existingContent = contentArray.filter(item => item.page === pageName);
            if (existingContent.length === 0) {
              contentArray.push(
                {
                  id: `${pageName}-title`,
                  page: pageName,
                  section: 'hero',
                  title: 'Page Title',
                  content: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page`,
                  lastUpdated: new Date().toISOString()
                },
                {
                  id: `${pageName}-description`,
                  page: pageName,
                  section: 'content',
                  title: 'Page Description',
                  content: `Edit the description for your ${pageName} page here. You can use **bold**, *italic*, bullet points, and [links](url).`,
                  lastUpdated: new Date().toISOString()
                }
              );
            }
          });
          setContent(contentArray);
        } else {
          initializeDefaultContent();
        }
      } else {
        initializeDefaultContent();
      }
    } catch (error) {
      console.error('Error loading content:', error);
      initializeDefaultContent();
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultContent = () => {
    const initialContent: PageContent[] = [
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
        content: 'Ko Lake Villa is a boutique accommodation nestled on the shores of a serene lake in Ahangama, Galle, offering a perfect blend of luxury, comfort, and natural beauty.',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'accommodation-title',
        page: 'accommodation',
        section: 'hero',
        title: 'Page Title',
        content: 'Luxury Accommodations',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'dining-title',
        page: 'dining',
        section: 'hero',
        title: 'Page Title',
        content: 'Culinary Excellence',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'experiences-title',
        page: 'experiences',
        section: 'hero',
        title: 'Page Title',
        content: 'Unique Experiences',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'contact-title',
        page: 'contact',
        section: 'hero',
        title: 'Page Title',
        content: 'Get in Touch',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'gallery-title',
        page: 'gallery',
        section: 'hero',
        title: 'Page Title',
        content: 'Photo Gallery',
        lastUpdated: new Date().toISOString()
      }
    ];
    
    setContent(initialContent);
  };

  const handleContentChange = (id: string, newContent: string) => {
    setContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, content: newContent, lastUpdated: new Date().toISOString() }
        : item
    ));
  };

  const saveContent = async (pageId?: string) => {
    setSaving(true);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast({
          title: "Content Saved Successfully!",
          description: pageId 
            ? `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} page content updated on live website`
            : "All page content has been saved and is now live on your website",
          variant: "default",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to save content');
      }

    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAllContent = () => saveContent();

  const getContentByPage = (page: string) => {
    if (!Array.isArray(content)) return [];
    return content.filter(item => item.page === page);
  };

  // Image upload handler
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const path = `content/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, path);
      return url;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  // Convert PageContent to ContentSection format for EnhancedContentManager
  const convertToContentSections = (pageContent: PageContent[]) => {
    if (!Array.isArray(pageContent) || pageContent.length === 0) {
      // Return default sections if no content exists
      return [
        {
          id: 'hero-title',
          title: 'Page Title',
          content: 'Add your page title here',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'hero-subtitle', 
          title: 'Page Subtitle',
          content: 'Add your page subtitle or description here',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'main-content',
          title: 'Main Content',
          content: 'Add your main page content here. You can use **bold text**, *italic text*, bullet points, and [links](https://example.com).',
          lastUpdated: new Date().toISOString()
        }
      ];
    }
    
    return pageContent.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      lastUpdated: item.lastUpdated
    }));
  };

  // Handle content updates from EnhancedContentManager
  const handleContentUpdate = async (sectionId: string, newContent: string): Promise<boolean> => {
    try {
      // Update local state
      handleContentChange(sectionId, newContent);
      
      // Save to backend
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast({
          title: "Content Updated",
          description: "Your changes have been saved successfully.",
        });
        return true;
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading content...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                  Edit the main landing page content with rich formatting support (bold, italic, bullet points, links)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedContentManager 
                  sections={convertToContentSections(getContentByPage('home'))}
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                />
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
                  Edit content for the rooms and accommodation page with advanced formatting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedContentManager 
                  sections={convertToContentSections(getContentByPage('accommodation'))}
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                />
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
                <EnhancedContentManager 
                  sections={convertToContentSections(getContentByPage('dining'))}
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                />
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
                <EnhancedContentManager 
                  sections={convertToContentSections(getContentByPage('experiences'))}
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                />
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
                <EnhancedContentManager 
                  sections={convertToContentSections(getContentByPage('gallery'))}
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                />
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
                <EnhancedContentManager 
                  sections={convertToContentSections(getContentByPage('contact'))}
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Notice */}
        <Card className="mt-8 border-[#FF914D]/20 bg-[#FF914D]/5">
          <CardHeader>
            <CardTitle className="text-[#8B5E3C]">Live Website Updates</CardTitle>
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