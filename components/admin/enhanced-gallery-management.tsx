"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { 
  Trash2, Archive, RotateCcw, CheckSquare, Square, 
  AlertTriangle, Package, FolderOpen, RefreshCw, Eye, EyeOff
} from "lucide-react"
import Image from "next/image"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  filename: string
  size: number
  isPublished: boolean
  isArchived?: boolean
  archivedAt?: string
  uploadDate: string
}

export default function EnhancedGalleryManagement() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'active' | 'archived' | 'all'>('active')
  const [isLoading, setIsLoading] = useState(true)
  const [isOperating, setIsOperating] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'clear-gallery' | 'clear-archive' | 'permanent-delete'
    items?: string[]
  } | null>(null)

  const { toast } = useToast()

  // Load gallery items from admin API (includes archived)
  const loadGalleryItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/gallery/admin-list')
      if (!response.ok) throw new Error('Failed to load gallery items')
      
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

  useEffect(() => {
    loadGalleryItems()
  }, [])

  // Filter items based on view mode
  const filteredItems = mediaItems.filter(item => {
    switch (viewMode) {
      case 'active':
        return !item.isArchived && item.isPublished
      case 'archived':
        return item.isArchived
      case 'all':
        return true
      default:
        return true
    }
  })

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)))
    }
  }

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  // Archive operations
  const handleArchiveOperation = async (action: string, itemIds: string[], reason?: string) => {
    try {
      setIsOperating(true)
      
      const response = await fetch('/api/gallery/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          imageIds: itemIds,
          reason: reason || 'Bulk operation'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${action} items`)
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: `${result.successCount} item(s) ${action}d successfully`,
      })

      setSelectedItems(new Set())
      setConfirmAction(null)
      await loadGalleryItems()

    } catch (error) {
      console.error(`${action} error:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} items`,
        variant: "destructive",
      })
    } finally {
      setIsOperating(false)
    }
  }

  const handleClearArchive = async () => {
    try {
      setIsOperating(true)
      
      const response = await fetch('/api/gallery/archive', {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to clear archive')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: `Archive cleared! ${result.deletedCount} item(s) permanently deleted`,
      })

      setConfirmAction(null)
      await loadGalleryItems()

    } catch (error) {
      console.error('Clear archive error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to clear archive',
        variant: "destructive",
      })
    } finally {
      setIsOperating(false)
    }
  }

  // Quick action handlers
  const archiveSelected = () => {
    if (selectedItems.size === 0) return
    handleArchiveOperation('archive', Array.from(selectedItems), 'Selected items archived')
  }

  const restoreSelected = () => {
    if (selectedItems.size === 0) return
    handleArchiveOperation('restore', Array.from(selectedItems))
  }

  const clearGallery = () => {
    handleArchiveOperation('clear-gallery', [], 'Gallery cleared - all items moved to archive')
  }

  const permanentDeleteSelected = () => {
    if (selectedItems.size === 0) return
    setConfirmAction({ type: 'permanent-delete', items: Array.from(selectedItems) })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getItemCounts = () => {
    const active = mediaItems.filter(item => !item.isArchived && item.isPublished).length
    const archived = mediaItems.filter(item => item.isArchived).length
    const total = mediaItems.length
    return { active, archived, total }
  }

  const { active, archived, total } = getItemCounts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
        <span className="ml-2 text-lg">Loading gallery items...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-800 mb-2">Enhanced Gallery Management</h1>
        <p className="text-gray-600">Complete gallery management with archive, bulk operations, and permanent deletion</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Active (Published)</p>
                <p className="text-2xl font-bold text-green-600">{active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Archive className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-blue-600">{archived}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-600">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckSquare className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-purple-600">{selectedItems.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={viewMode === 'active' ? 'default' : 'outline'}
          onClick={() => setViewMode('active')}
          className={viewMode === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          <Eye className="w-4 h-4 mr-2" />
          Active ({active})
        </Button>
        <Button
          variant={viewMode === 'archived' ? 'default' : 'outline'}
          onClick={() => setViewMode('archived')}
          className={viewMode === 'archived' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive ({archived})
        </Button>
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          onClick={() => setViewMode('all')}
          className={viewMode === 'all' ? 'bg-gray-600 hover:bg-gray-700' : ''}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          All Items ({total})
        </Button>
      </div>

      {/* Bulk Actions Toolbar */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="flex items-center"
              >
                {selectedItems.size === filteredItems.length ? (
                  <CheckSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Square className="w-4 h-4 mr-2" />
                )}
                {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </Button>
              <span className="text-sm text-gray-600">
                {selectedItems.size} of {filteredItems.length} selected
              </span>
            </div>
            
            <div className="flex space-x-2">
              {viewMode === 'active' && (
                <>
                  <Button
                    onClick={archiveSelected}
                    disabled={selectedItems.size === 0 || isOperating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Selected ({selectedItems.size})
                  </Button>
                  <Button
                    onClick={() => setConfirmAction({ type: 'clear-gallery' })}
                    disabled={isOperating}
                    variant="destructive"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Clear Gallery
                  </Button>
                </>
              )}
              
              {viewMode === 'archived' && (
                <>
                  <Button
                    onClick={restoreSelected}
                    disabled={selectedItems.size === 0 || isOperating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore Selected ({selectedItems.size})
                  </Button>
                  <Button
                    onClick={permanentDeleteSelected}
                    disabled={selectedItems.size === 0 || isOperating}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Permanent Delete ({selectedItems.size})
                  </Button>
                  <Button
                    onClick={() => setConfirmAction({ type: 'clear-archive' })}
                    disabled={isOperating}
                    variant="destructive"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Clear Archive
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className={`group cursor-pointer transition-all duration-200 ${
              selectedItems.has(item.id) ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'
            } ${item.isArchived ? 'opacity-75 border-blue-200' : ''}`}
            onClick={() => toggleSelectItem(item.id)}
          >
            <CardContent className="p-0">
              {/* Image/Video Preview */}
              <div className="relative aspect-square">
                {item.type === 'video' ? (
                  <video 
                    className="w-full h-full object-cover rounded-t-lg"
                    src={item.url}
                    poster="/thumbnails/video-default.svg"
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="bg-white border-2"
                  />
                </div>
                
                {/* Status Badges */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  {item.isArchived && (
                    <Badge className="bg-blue-600 text-white">
                      <Archive className="w-3 h-3 mr-1" />
                      Archived
                    </Badge>
                  )}
                  {item.isPublished && !item.isArchived && (
                    <Badge className="bg-green-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  )}
                  {!item.isPublished && !item.isArchived && (
                    <Badge className="bg-gray-600 text-white">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Item Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatFileSize(item.size)}</span>
                  <span>{item.type.toUpperCase()}</span>
                </div>
                {item.archivedAt && (
                  <p className="text-xs text-blue-600 mt-1">
                    Archived: {new Date(item.archivedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No {viewMode} items found
          </h3>
          <p className="text-gray-500">
            {viewMode === 'active' && "No published items in the gallery"}
            {viewMode === 'archived' && "No items in the archive"}
            {viewMode === 'all' && "No items uploaded yet"}
          </p>
        </div>
      )}

      {/* Confirmation Dialogs */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Confirm Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {confirmAction.type === 'clear-gallery' && 
                  "This will move ALL active gallery items to the archive. They will no longer appear on the public website."
                }
                {confirmAction.type === 'clear-archive' && 
                  "This will PERMANENTLY DELETE all archived items. This action cannot be undone."
                }
                {confirmAction.type === 'permanent-delete' && 
                  `This will PERMANENTLY DELETE ${confirmAction.items?.length} selected item(s). This action cannot be undone.`
                }
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (confirmAction.type === 'clear-gallery') {
                      clearGallery()
                    } else if (confirmAction.type === 'clear-archive') {
                      handleClearArchive()
                    } else if (confirmAction.type === 'permanent-delete' && confirmAction.items) {
                      handleArchiveOperation('permanent-delete', confirmAction.items)
                    }
                  }}
                  disabled={isOperating}
                  variant="destructive"
                  className="flex-1"
                >
                  {isOperating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mr-2" />
                  )}
                  Confirm
                </Button>
                <Button
                  onClick={() => setConfirmAction(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 