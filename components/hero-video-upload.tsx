"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Play, X, Video, FileVideo } from "lucide-react"

interface UploadedVideo {
  file: File
  url: string
  title: string
}

export default function HeroVideoUpload() {
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [videoTitle, setVideoTitle] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setIsUploading(true)
      
      // Create object URL for preview
      const url = URL.createObjectURL(file)
      
      setTimeout(() => {
        setUploadedVideo({
          file,
          url,
          title: videoTitle || file.name.replace(/\.[^/.]+$/, "")
        })
        setIsUploading(false)
      }, 1000) // Simulate upload delay
    }
  }

  const handleRemoveVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo.url)
      setUploadedVideo(null)
    }
    setVideoTitle("")
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {!uploadedVideo ? (
        /* Upload Area */
        <Card className="border-2 border-dashed border-white/30 bg-black/20 backdrop-blur-sm hover:border-white/50 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Video className="w-12 h-12 mx-auto text-white/70 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Upload Your Video</h3>
              <p className="text-sm text-white/80 mb-4">
                Add a personal video to showcase in this hero area
              </p>
            </div>
            
            {/* Video Title Input */}
            <div className="mb-4">
              <Label htmlFor="videoTitle" className="text-white/90 text-sm">
                Video Title (Optional)
              </Label>
              <Input
                id="videoTitle"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title..."
                className="mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            
            {/* Upload Button */}
            <Button
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="bg-white/90 text-amber-900 hover:bg-white hover:text-amber-800 w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-900 mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video File
                </>
              )}
            </Button>
            
            {/* Hidden File Input */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <p className="text-xs text-white/60 mt-2">
              Supports MP4, WebM, MOV files up to 50MB
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Video Display Area */
        <Card className="bg-black/20 backdrop-blur-sm border border-white/30 overflow-hidden">
          <CardContent className="p-0 relative">
            {/* Video Player */}
            <div className="relative aspect-video">
              <video
                src={uploadedVideo.url}
                controls
                poster="/thumbnails/video-default.svg"
                className="w-full h-full object-cover"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Remove Button */}
              <Button
                onClick={handleRemoveVideo}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* Video Badge */}
              <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                <FileVideo className="w-3 h-3 mr-1" />
                Your Video
              </Badge>
            </div>
            
            {/* Video Info */}
            <div className="p-4">
              <h4 className="font-semibold text-white mb-1 truncate">
                {uploadedVideo.title}
              </h4>
              <p className="text-sm text-white/70">
                Size: {(uploadedVideo.file.size / 1024 / 1024).toFixed(1)} MB
              </p>
              <p className="text-xs text-white/60 mt-1">
                Video displayed in hero section
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Help Text */}
      <div className="mt-3 text-center">
        <p className="text-xs text-white/60">
          📹 Your video will be visible to all visitors in this hero area
        </p>
      </div>
    </div>
  )
} 