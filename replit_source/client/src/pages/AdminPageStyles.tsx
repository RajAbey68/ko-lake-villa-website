import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PageStyle {
  id: string;
  pageName: string;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  backgroundImage?: string;
  overlayColor?: string;
  overlayOpacity: number;
  textColor?: string;
  updatedAt: string;
}

const pages = [
  { value: 'home', label: 'Homepage' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' },
  { value: 'booking', label: 'Booking' },
  { value: 'faq', label: 'FAQ' }
];

export default function AdminPageStyles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState('home');
  const [styleData, setStyleData] = useState<Partial<PageStyle>>({
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    overlayOpacity: 0.4,
    textColor: '#ffffff'
  });

  const { data: pageStyles, isLoading } = useQuery({
    queryKey: ['/api/admin/page-styles'],
  });

  const updateStyleMutation = useMutation({
    mutationFn: async (data: Partial<PageStyle>) => {
      const response = await fetch('/api/admin/page-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, pageName: selectedPage })
      });
      if (!response.ok) throw new Error('Failed to update page style');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Page style updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-styles'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update page style", variant: "destructive" });
    }
  });

  useEffect(() => {
    if (pageStyles) {
      const currentStyle = pageStyles.find((style: PageStyle) => style.pageName === selectedPage);
      if (currentStyle) {
        setStyleData(currentStyle);
      } else {
        setStyleData({
          backgroundType: 'color',
          backgroundColor: '#ffffff',
          overlayOpacity: 0.4,
          textColor: '#ffffff'
        });
      }
    }
  }, [selectedPage, pageStyles]);

  const handleSave = () => {
    updateStyleMutation.mutate(styleData);
  };

  const previewStyle = () => {
    let background = '';
    if (styleData.backgroundType === 'color') {
      background = styleData.backgroundColor || '#ffffff';
    } else if (styleData.backgroundType === 'gradient') {
      background = `linear-gradient(135deg, ${styleData.gradientFrom || '#8B5E3C'}, ${styleData.gradientTo || '#A0B985'})`;
    } else if (styleData.backgroundType === 'image' && styleData.backgroundImage) {
      background = `url(${styleData.backgroundImage})`;
    }

    return {
      background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative' as const,
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
  };

  const overlayStyle = {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: styleData.overlayColor || '#000000',
    opacity: styleData.overlayOpacity / 100
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-[#1E4E5F] mb-2">Page Style Manager</h1>
          <p className="text-[#333333]">Customize backgrounds, overlays, and styling for each page of your website.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Style Settings</CardTitle>
              <CardDescription>Configure the visual appearance of your pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Page Selection */}
              <div className="space-y-2">
                <Label htmlFor="page-select">Select Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Background Type */}
              <div className="space-y-2">
                <Label htmlFor="bg-type">Background Type</Label>
                <Select 
                  value={styleData.backgroundType} 
                  onValueChange={(value) => setStyleData({...styleData, backgroundType: value as 'color' | 'gradient' | 'image'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Background Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Settings */}
              {styleData.backgroundType === 'color' && (
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <Input
                    type="color"
                    value={styleData.backgroundColor || '#ffffff'}
                    onChange={(e) => setStyleData({...styleData, backgroundColor: e.target.value})}
                  />
                </div>
              )}

              {styleData.backgroundType === 'gradient' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradient-from">Gradient Start</Label>
                    <Input
                      type="color"
                      value={styleData.gradientFrom || '#8B5E3C'}
                      onChange={(e) => setStyleData({...styleData, gradientFrom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradient-to">Gradient End</Label>
                    <Input
                      type="color"
                      value={styleData.gradientTo || '#A0B985'}
                      onChange={(e) => setStyleData({...styleData, gradientTo: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {styleData.backgroundType === 'image' && (
                <div className="space-y-2">
                  <Label htmlFor="bg-image">Background Image URL</Label>
                  <Input
                    type="text"
                    placeholder="/uploads/gallery/default/your-image.jpg"
                    value={styleData.backgroundImage || ''}
                    onChange={(e) => setStyleData({...styleData, backgroundImage: e.target.value})}
                  />
                  <p className="text-sm text-gray-500">Use images from your gallery or external URLs</p>
                </div>
              )}

              <Separator />

              {/* Overlay Settings */}
              <div className="space-y-4">
                <Label>Overlay Settings</Label>
                <div className="space-y-2">
                  <Label htmlFor="overlay-color">Overlay Color</Label>
                  <Input
                    type="color"
                    value={styleData.overlayColor || '#000000'}
                    onChange={(e) => setStyleData({...styleData, overlayColor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overlay-opacity">Overlay Opacity: {styleData.overlayOpacity}%</Label>
                  <Slider
                    value={[styleData.overlayOpacity || 40]}
                    onValueChange={(value) => setStyleData({...styleData, overlayOpacity: value[0]})}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  type="color"
                  value={styleData.textColor || '#ffffff'}
                  onChange={(e) => setStyleData({...styleData, textColor: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={updateStyleMutation.isPending}
                className="w-full"
              >
                {updateStyleMutation.isPending ? 'Saving...' : 'Save Style Settings'}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your {pages.find(p => p.value === selectedPage)?.label} will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={previewStyle()} className="rounded-lg overflow-hidden">
                <div style={overlayStyle}></div>
                <div className="relative z-10 text-center p-6" style={{ color: styleData.textColor }}>
                  <h2 className="text-2xl font-bold mb-2">Ko Lake Villa</h2>
                  <p className="text-lg">Preview of {pages.find(p => p.value === selectedPage)?.label} styling</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Style Summary:</h4>
                <ul className="text-sm space-y-1">
                  <li><strong>Background:</strong> {styleData.backgroundType}</li>
                  <li><strong>Overlay:</strong> {styleData.overlayOpacity}% opacity</li>
                  <li><strong>Text Color:</strong> {styleData.textColor}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}