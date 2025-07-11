"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Video, Trash2, Edit, Eye, Sparkles, Copy, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import CampaignGenerator from "@/components/admin/campaign-generator"
import MarketingAssetsGenerator from "@/components/admin/marketing-assets-generator"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  altText: string
  uploadDate: string
  filename: string
  size: number
  isPublished: boolean
  publishedAt?: string
  unpublishedAt?: string
  publishedBy?: string
}

export default function GalleryManagement() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const categories = [
    "Pool & Facilities",
    "Bedrooms", 
    "Living Areas",
    "Kitchen & Dining",
    "Outdoor Spaces",
    "Villa Tour",
    "Local Area",
    "Activities",
    "Default"
  ]

  const targetTribes = [
    "Family Groups",
    "Wellness & Yoga Retreats",
    "Surf Travellers & Beach Lovers",
    "Digital Nomads & Remote Workers",
    "Creative & Soulful Travellers",
    "Small Celebration Groups",
    "Eco-Conscious & Nature-Loving Guests",
  ]

  // Load gallery items from API
  const loadGalleryItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/gallery/list')
      if (!response.ok) {
        throw new Error('Failed to load gallery items')
      }
      const items = await response.json()
      setMediaItems(items)
    } catch (error) {
      console.error('Error loading gallery items:', error)
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load gallery items on component mount
  useEffect(() => {
    loadGalleryItems()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('category', 'default')
        formData.append('description', file.name)

        const response = await fetch('/api/gallery/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const result = await response.json()
        console.log('Upload result:', result)
      }

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      })

      // Reload gallery items after upload
      await loadGalleryItems()

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      console.log('Deleting item with ID:', itemId)
      
      const encodedId = encodeURIComponent(itemId)
      console.log('Encoded ID for API call:', encodedId)
      
      const response = await fetch(`/api/gallery/${encodedId}`, {
        method: 'DELETE'
      })

      console.log('Delete response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete failed with response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to delete item`)
      }

      const result = await response.json()
      console.log('Delete successful:', result)
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })

      // Update local state immediately
      setMediaItems(prev => prev.filter(item => item.id !== itemId))
      setDeleteConfirmId(null)
      
      // Also reload gallery items to ensure complete sync
      await loadGalleryItems()

    } catch (error) {
      console.error('Delete error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item'
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      
      // Still close the dialog even on error
      setDeleteConfirmId(null)
    }
  }

  const generateAISEO = async (item: MediaItem) => {
    setIsGeneratingAI(true)

    // Simulate AI generation
    setTimeout(() => {
      const updatedItem = {
        ...item,
        seoTitle: `${item.title} | Ko Lake Villa Luxury Accommodation Sri Lanka`,
        seoDescription: `${item.description} Perfect for luxury travelers seeking premium villa rental in Ahangama, Sri Lanka. Book direct and save 10%.`,
        altText: `${item.title} at Ko Lake Villa - luxury villa rental in Ahangama Sri Lanka`,
      }

      setMediaItems((prev) => prev.map((i) => (i.id === item.id ? updatedItem : i)))
      setSelectedItem(updatedItem)
      setIsGeneratingAI(false)
    }, 2000)
  }

  const handleSaveEdit = async (item: MediaItem) => {
    if (!item) return

    setIsSaving(true)

    try {
      console.log('Saving item:', item.id, 'with data:', {
        title: item.title,
        description: item.description,
        category: item.category,
        tags: item.tags,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        altText: item.altText,
      })

      const encodedId = encodeURIComponent(item.id)
      console.log('Encoded ID for save:', encodedId)
      
      const response = await fetch(`/api/gallery/${encodedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags,
          seoTitle: item.seoTitle,
          seoDescription: item.seoDescription,
          altText: item.altText,
        }),
      })

      console.log('Save response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Save failed with response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to save changes`)
      }

      const result = await response.json()
      console.log('Save successful:', result)
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      })

      // Update the item in local state to reflect changes
      setMediaItems(prev => prev.map(i => i.id === item.id ? item : i))
      setEditingItem(null)

    } catch (error) {
      console.error('Save error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes'
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublishToggle = async (itemId: string, currentStatus: boolean) => {
    setPublishingId(itemId)
    try {
      const action = currentStatus ? 'unpublish' : 'publish'
      const response = await fetch('/api/gallery/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: itemId,
          action: action,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update the item in the local state
        setMediaItems(prev => prev.map(item => 
          item.id === itemId ? { 
            ...item, 
            isPublished: result.status.isPublished,
            publishedAt: result.status.publishedAt,
            unpublishedAt: result.status.unpublishedAt,
            publishedBy: result.status.publishedBy
          } : item
        ))
        
        toast({
          title: "Success",
          description: `Item ${action}ed successfully`,
        })
      } else {
        throw new Error(`Failed to ${action} item`)
      }
    } catch (error) {
      console.error('Publish error:', error)
      toast({
        title: "Error",
        description: "Failed to update publish status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPublishingId(null)
    }
  }

  const filteredItems =
    selectedCategory === "all" ? mediaItems : mediaItems.filter((item) => item.category.toLowerCase().includes(selectedCategory.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600">Loading gallery...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-800">Gallery Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={loadGalleryItems}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-amber-600 hover:bg-amber-700"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Media"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="seo">SEO Optimization</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Generator</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">{filteredItems.length} items</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Video load error:', e);
                        // Fallback to placeholder if video fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    >
                      <source src={item.url} type="video/mp4" />
                      <source src={item.url} type="video/webm" />
                      <source src={item.url} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {item.type === "video" && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 hidden">
                      <Video className="w-12 h-12 text-gray-400" />
                      <span className="ml-2 text-gray-500">Video not supported</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {item.type === "image" ? (
                        <ImageIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <Video className="w-3 h-3 mr-1" />
                      )}
                      {item.type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge className="bg-amber-600 text-white text-xs">{item.category}</Badge>
                    <Badge className={`text-xs ${item.isPublished ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                      {item.isPublished ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {(item.size / 1024).toFixed(1)} KB
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePublishToggle(item.id, item.isPublished)}
                        disabled={publishingId === item.id}
                        className={item.isPublished ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {publishingId === item.id ? (
                          <div className="w-3 h-3 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : item.isPublished ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteConfirmId(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found for this category.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  AI SEO Optimization - {selectedItem.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={selectedItem.seoTitle}
                      onChange={(e) => setSelectedItem({ ...selectedItem, seoTitle: e.target.value })}
                      placeholder="Enter SEO title"
                    />
                    <p className="text-xs text-gray-500 mt-1">{selectedItem.seoTitle.length}/60 characters</p>
                  </div>
                  <div>
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <Input
                      id="alt-text"
                      value={selectedItem.altText}
                      onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                      placeholder="Enter alt text for accessibility"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="seo-description">SEO Description</Label>
                  <Textarea
                    id="seo-description"
                    value={selectedItem.seoDescription}
                    onChange={(e) => setSelectedItem({ ...selectedItem, seoDescription: e.target.value })}
                    placeholder="Enter SEO description"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{selectedItem.seoDescription.length}/160 characters</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => generateAISEO(selectedItem)}
                    disabled={isGeneratingAI}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingAI ? "Generating..." : "Generate AI SEO"}
                  </Button>
                  <Button variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SEO Data
                  </Button>
                </div>

                {isGeneratingAI && (
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      AI is analyzing your content and generating optimized SEO metadata...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select Media for SEO Optimization</h3>
                <p className="text-gray-600">
                  Choose an image or video from the gallery to optimize its SEO metadata with AI.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignGenerator />
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingAssetsGenerator />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-600" />
                Edit Media Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Media Preview */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {editingItem.type === "image" ? (
                  <img
                    src={editingItem.url || "/placeholder.svg"}
                    alt={editingItem.altText || editingItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={editingItem.url}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Video load error in edit dialog:', e);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  >
                    <source src={editingItem.url} type="video/mp4" />
                    <source src={editingItem.url} type="video/webm" />
                    <source src={editingItem.url} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {editingItem.type === "video" && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 hidden">
                    <Video className="w-12 h-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">Video preview not available</span>
                  </div>
                )}
              </div>

              {/* Edit Form */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editingItem.category} 
                    onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-alt-text">Alt Text</Label>
                <Input
                  id="edit-alt-text"
                  value={editingItem.altText}
                  onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                  placeholder="Enter alt text for accessibility"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-seo-title">SEO Title</Label>
                  <Input
                    id="edit-seo-title"
                    value={editingItem.seoTitle}
                    onChange={(e) => setEditingItem({ ...editingItem, seoTitle: e.target.value })}
                    placeholder="Enter SEO title"
                  />
                  <p className="text-xs text-gray-500 mt-1">{editingItem.seoTitle.length}/60 characters</p>
                </div>
                <div>
                  <Label htmlFor="edit-seo-description">SEO Description</Label>
                  <Textarea
                    id="edit-seo-description"
                    value={editingItem.seoDescription}
                    onChange={(e) => setEditingItem({ ...editingItem, seoDescription: e.target.value })}
                    placeholder="Enter SEO description"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">{editingItem.seoDescription.length}/160 characters</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingItem(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSaveEdit(editingItem)}
                  disabled={isSaving}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteItem(deleteConfirmId)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
