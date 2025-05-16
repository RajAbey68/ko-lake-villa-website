import { Request, Response } from 'express';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { galleryImages } from '@shared/schema';
import { log } from './vite';
import { createGalleryFolderStructure, uploadGalleryImage } from './driveUploader';

export const exportToGoogleDrive = async (req: Request, res: Response) => {
  try {
    // Check if Google Drive credentials are configured
    if (!process.env.GOOGLE_DRIVE_CLIENT_ID || 
        !process.env.GOOGLE_DRIVE_CLIENT_SECRET || 
        !process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'Google Drive credentials not configured. Please add the required secrets.'
      });
    }
    
    const { categories, imageIds } = req.body;
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No categories selected for export'
      });
    }
    
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images selected for export'
      });
    }
    
    // Create folder structure in Google Drive
    log(`Creating folder structure for categories: ${categories.join(', ')}`, 'drive-export');
    const { categoryFolders } = await createGalleryFolderStructure(
      categories.filter(category => typeof category === 'string')
    );
    
    // Get the gallery images to export
    const imagesToExport = await db
      .select()
      .from(galleryImages)
      .where(db.inArray(galleryImages.id, imageIds));
    
    log(`Found ${imagesToExport.length} images to export`, 'drive-export');
    
    // Upload each image to the appropriate folder
    const results = {
      success: 0,
      failed: 0,
      uploadedFiles: [] as Array<{ name: string, webViewLink: string }>
    };
    
    for (const image of imagesToExport) {
      try {
        // Skip images with missing category or if category wasn't selected
        if (!image.category || !categoryFolders[image.category]) {
          log(`Skipping image ${image.id} with category ${image.category}`, 'drive-export');
          continue;
        }
        
        // Upload the image to the appropriate folder
        const folderId = categoryFolders[image.category];
        
        if (!folderId) {
          log(`No folder ID for category ${image.category}`, 'drive-export');
          results.failed++;
          continue;
        }
        
        const uploadResult = await uploadGalleryImage(
          image.imageUrl,
          image.category,
          folderId
        );
        
        if (uploadResult) {
          results.success++;
          results.uploadedFiles.push({
            name: uploadResult.name,
            webViewLink: uploadResult.webViewLink
          });
        } else {
          // This is an external URL that was skipped
          results.failed++;
        }
      } catch (error) {
        log(`Error uploading image ${image.id}: ${error}`, 'drive-export');
        results.failed++;
      }
    }
    
    return res.status(200).json({
      ...results,
      message: `Successfully uploaded ${results.success} files to Google Drive`
    });
  } catch (error) {
    log(`Error in Google Drive export: ${error}`, 'drive-export');
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};