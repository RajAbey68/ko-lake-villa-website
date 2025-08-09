"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Image as ImageIcon, Trash2, Edit, Eye, X, RefreshCw, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

interface GalleryImage {
  id: number
  imageUrl: string
  alt: string
  description?: string
  category: string
  tags?: string
  featured: boolean
  sortOrder: number
  mediaType: 'image' | 'video'
  fileSize?: number
  createdAt?: string
}

const CATEGORIES = [
  { value: 'entire-villa', label: 'Entire Villa' },
  { value: 'family-suite', label: 'Family Suite' },
  { value: 'group-room', label: 'Group Room' },
  { value: 'triple-room', label: 'Triple Room' },
  { value: 'dining-area', label: 'Dining Area' },
  { value: 'pool-deck', label: 'Pool Deck' },
  { value: 'lake-garden', label: 'Lake Garden' },
  { value: 'roof-garden', label: 'Roof Garden' },
  { value: 'front-garden', label: 'Front Garden' },
  { value: 'koggala-lake', label: 'Koggala Lake' },
  { value: 'excursions', label: 'Excursions' },
  { value: 'default', label: 'Default' }
]

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Upload states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadData, setUploadData] = useState({
    alt: '',
    description: '',
    category: 'default',
    tags: '',
    featured: false
  })
  const [uploading, setUploading] = useState(false)

  // Edit states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [editData, setEditData] = useState({
    alt: '',
    description: '',
    category: '',
    tags: '',
    featured: false
  })

  // View states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingImage, setViewingImage] = useState<GalleryImage | null>(null)

  // Load images
  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      
      const data = await response.json()
      setImages(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [])

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  // Handle file upload
  const handleUpload = async () => {
    if (!uploadFile || !uploadData.alt) {
      alert('Please select a file and enter a title')
      return
    }

    try {
      setUploading(true)
      
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('alt', uploadData.alt)
      formData.append('description', uploadData.description)
      formData.append('category', uploadData.category)
      formData.append('tags', uploadData.tags)
      formData.append('featured', uploadData.featured.toString())

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      // Reset form
      setUploadFile(null)
      setUploadData({
        alt: '',
        description: '',
        category: 'default',
        tags: '',
        featured: false
      })
      
      setUploadDialogOpen(false)
      await loadImages()
      
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  // Handle edit
  const openEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setEditData({
      alt: image.alt,
      description: image.description || '',
      category: image.category,
      tags: image.tags || '',
      featured: image.featured
    })
    setEditDialogOpen(true)
  }

  const handleEdit = async () => {
    if (!editingImage) return

    try {
      const response = await fetch(`/api/gallery/${editingImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (!response.ok) {
        throw new Error('Update failed')
      }

      setEditDialogOpen(false)
      await loadImages()
      
    } catch (err) {
      alert('Update failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // Handle delete
  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Are you sure you want to delete "${image.alt}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/gallery/${image.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      await loadImages()
      
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // Handle view
  const openView = (image: GalleryImage) => {
    setViewingImage(image)
    setViewDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading gallery...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-600">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={loadImages}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gallery Management</h1>
          <p className="text-gray-600">Manage photos and videos for Ko Lake Villa</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Badge className="h-8 w-8 text-green-600 bg-green-100" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{images.filter(img => img.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">{CATEGORIES.length}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{new Set(images.map(img => img.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-2xl font-bold">{filteredImages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              All ({images.length})
            </Button>
            {CATEGORIES.map(category => {
              const count = images.filter(img => img.category === category.value).length
              if (count === 0) return null
              
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  size="sm"
                >
                  {category.label} ({count})
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={image.imageUrl}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {image.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  Featured
                </Badge>
              )}
              <Badge className="absolute top-2 right-2 bg-blue-500">
                {image.category}
              </Badge>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm truncate">{image.alt}</h3>
              {image.description && (
                <p className="text-xs text-gray-600 truncate">{image.description}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openView(image)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(image)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(image)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500">#{image.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No images found</h3>
            <p className="text-gray-500">
              {selectedCategory === 'all' 
                ? 'Upload some images to get started.' 
                : `No images in the "${selectedCategory}" category.`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upload-file">Select Image</Label>
              <Input
                id="upload-file"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            
            <div>
              <Label htmlFor="upload-title">Title *</Label>
              <Input
                id="upload-title"
                value={uploadData.alt}
                onChange={(e) => setUploadData(prev => ({ ...prev, alt: e.target.value }))}
                placeholder="Enter image title"
              />
            </div>

            <div>
              <Label htmlFor="upload-description">Description</Label>
              <Textarea
                id="upload-description"
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="upload-category">Category</Label>
              <Select
                value={uploadData.category}
                onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="upload-tags">Tags</Label>
              <Input
                id="upload-tags"
                value={uploadData.tags}
                onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="upload-featured"
                checked={uploadData.featured}
                onChange={(e) => setUploadData(prev => ({ ...prev, featured: e.target.checked }))}
              />
              <Label htmlFor="upload-featured">Featured image</Label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading || !uploadFile || !uploadData.alt}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          {editingImage && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                <Image
                  src={editingImage.imageUrl}
                  alt={editingImage.alt}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div>
                <Label>Title</Label>
                <Input
                  value={editData.alt}
                  onChange={(e) => setEditData(prev => ({ ...prev, alt: e.target.value }))}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={editData.category}
                  onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <Input
                  value={editData.tags}
                  onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editData.featured}
                  onChange={(e) => setEditData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <Label htmlFor="edit-featured">Featured image</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEdit} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewingImage?.alt}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewDialogOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <div className="space-y-4">
              <div className="relative max-h-[60vh] bg-gray-100 rounded overflow-hidden">
                <Image
                  src={viewingImage.imageUrl}
                  alt={viewingImage.alt}
                  width={800}
                  height={600}
                  className="object-contain w-full h-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> {viewingImage.category}
                </div>
                <div>
                  <strong>Featured:</strong> {viewingImage.featured ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>ID:</strong> {viewingImage.id}
                </div>
                <div>
                  <strong>Type:</strong> {viewingImage.mediaType}
                </div>
              </div>
              
              {viewingImage.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-gray-600">{viewingImage.description}</p>
                </div>
              )}
              
              {viewingImage.tags && (
                <div>
                  <strong>Tags:</strong>
                  <p className="mt-1 text-gray-600">{viewingImage.tags}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
