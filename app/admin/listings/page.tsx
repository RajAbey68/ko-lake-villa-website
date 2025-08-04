"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { listingsService, AirbnbListing } from "@/lib/firebase-listings"

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AirbnbListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingListing, setEditingListing] = useState<AirbnbListing | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<AirbnbListing>>({
    name: '',
    url: '',
    description: '',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    features: [],
    isActive: true,
    displayOrder: 1
  })

  // Load listings
  const loadListings = async () => {
    try {
      setLoading(true)
      await listingsService.initializeListings()
      const allListings = await listingsService.getAllListings()
      setListings(allListings)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      features: [],
      isActive: true,
      displayOrder: listings.length + 1
    })
    setEditingListing(null)
  }

  // Open dialog for new listing
  const handleAddNew = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Open dialog for editing
  const handleEdit = (listing: AirbnbListing) => {
    setFormData(listing)
    setEditingListing(listing)
    setIsDialogOpen(true)
  }

  // Handle form field changes
  const handleFieldChange = (field: keyof AirbnbListing, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle features array
  const handleFeaturesChange = (featuresText: string) => {
    const features = featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)
    setFormData(prev => ({ ...prev, features }))
  }

  // Save listing
  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(null)
      
      // Validate form
      const validation = listingsService.validateListing(formData)
      if (!validation.isValid) {
        setError(validation.errors.join(', '))
        return
      }

      const user = 'Admin' // Get from auth context in real app

      if (editingListing) {
        // Update existing
        await listingsService.updateListing(
          editingListing.id, 
          formData, 
          user
        )
        setSaveSuccess(`Listing "${formData.name}" updated successfully!`)
      } else {
        // Create new
        const newListing: AirbnbListing = {
          ...formData as AirbnbListing,
          id: formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
          lastUpdated: new Date(),
          updatedBy: user
        }
        await listingsService.createListing(newListing)
        setSaveSuccess(`Listing "${formData.name}" created successfully!`)
      }

      // Refresh listings
      await loadListings()
      
      // Close dialog
      setIsDialogOpen(false)
      setError(null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save listing')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete listing
  const handleDelete = async (listing: AirbnbListing) => {
    if (!confirm(`Are you sure you want to delete "${listing.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await listingsService.deleteListing(listing.id)
      setSaveSuccess(`Listing "${listing.name}" deleted successfully!`)
      await loadListings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete listing')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
          <span className="ml-2 text-lg">Loading listings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Airbnb Listings Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage Ko Lake Villa's Airbnb listings - the single source of truth for all URLs
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{saveSuccess}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Listings ({listings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={listing.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline max-w-[200px] truncate"
                      >
                        {listing.url.replace('https://', '')}
                      </a>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell>{listing.maxGuests}</TableCell>
                  <TableCell>
                    <Badge variant={listing.isActive ? "default" : "secondary"}>
                      {listing.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {listing.lastUpdated.toLocaleDateString()}
                    <br />
                    <span className="text-xs">by {listing.updatedBy}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(listing)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(listing)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingListing ? `Edit "${editingListing.name}"` : 'Add New Listing'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Listing Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g., Entire Villa"
                />
              </div>
              <div>
                <Label htmlFor="url">Airbnb URL *</Label>
                <Input
                  id="url"
                  value={formData.url || ''}
                  onChange={(e) => handleFieldChange('url', e.target.value)}
                  placeholder="https://airbnb.co.uk/h/..."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe this listing..."
                rows={3}
              />
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxGuests">Max Guests *</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  value={formData.maxGuests || 1}
                  onChange={(e) => handleFieldChange('maxGuests', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  value={formData.bedrooms || 1}
                  onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  value={formData.bathrooms || 1}
                  onChange={(e) => handleFieldChange('bathrooms', parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features?.join('\n') || ''}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                placeholder="e.g.,&#10;Lake views&#10;Private pool&#10;Air conditioning"
                rows={4}
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active Listing</Label>
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="1"
                  value={formData.displayOrder || 1}
                  onChange={(e) => handleFieldChange('displayOrder', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {editingListing ? 'Update' : 'Create'} Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 