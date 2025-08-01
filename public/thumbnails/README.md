# Video Thumbnails Directory

This directory stores video thumbnail images for the Ko Lake Villa gallery.

## Structure

```
thumbnails/
├── video-{videoId}.jpg    # Main thumbnail for video
├── video-{videoId}.webp   # WebP format for better compression
└── poster-{videoId}.jpg   # Poster image for video players
```

## Thumbnail Generation

For production, implement automatic thumbnail generation:

1. **On Upload**: Extract first frame or generate custom thumbnail
2. **Formats**: Generate both JPG and WebP versions
3. **Sizes**: 
   - Grid thumbnails: 400x300px
   - Poster images: 800x600px
   - Mobile optimized: 200x150px

## Current Implementation

Currently using placeholder images with video-specific styling:
- Dark background (#1a1a1a)
- White text for better contrast
- Video title embedded in placeholder

## Future Enhancements

- FFmpeg integration for frame extraction
- AI-generated thumbnails highlighting key scenes
- Custom poster image uploads
- Multiple thumbnail options per video 