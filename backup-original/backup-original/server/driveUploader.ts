import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { log } from './vite';

// Initialize the Google Drive API client
const initDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET
  );

  // Set credentials using the refresh token
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
  });

  // Create Drive API client
  return google.drive({ version: 'v3', auth: oauth2Client });
};

// Create a folder in Google Drive
export const createDriveFolder = async (name: string, parentId?: string) => {
  try {
    if (!process.env.GOOGLE_DRIVE_CLIENT_ID || 
        !process.env.GOOGLE_DRIVE_CLIENT_SECRET || 
        !process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
      throw new Error('Google Drive credentials are not configured.');
    }
    
    const drive = initDriveClient();
    
    // Set folder metadata
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined
    };
    
    // Create the folder
    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id'
    });
    
    log(`Created folder: ${name} with ID: ${response.data.id}`, 'drive');
    return response.data.id;
  } catch (error) {
    log(`Error creating folder: ${error}`, 'drive');
    throw error;
  }
};

// Upload a file to Google Drive
export const uploadFileToDrive = async (
  filePath: string, 
  fileName: string, 
  mimeType: string, 
  folderId: string
) => {
  try {
    if (!process.env.GOOGLE_DRIVE_CLIENT_ID || 
        !process.env.GOOGLE_DRIVE_CLIENT_SECRET || 
        !process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
      throw new Error('Google Drive credentials are not configured.');
    }
    
    const drive = initDriveClient();
    
    // Set file metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };
    
    // Create media object
    const media = {
      mimeType,
      body: fs.createReadStream(filePath)
    };
    
    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id,name,webViewLink'
    });
    
    log(`Uploaded file: ${fileName} with ID: ${response.data.id}`, 'drive');
    return {
      id: response.data.id,
      name: response.data.name,
      webViewLink: response.data.webViewLink
    };
  } catch (error) {
    log(`Error uploading file: ${error}`, 'drive');
    throw error;
  }
};

// Get file extension from URL
const getExtensionFromUrl = (url: string): string => {
  // Extract filename from URL
  const parsed = new URL(url);
  const pathname = parsed.pathname;
  const filename = pathname.split('/').pop() || '';
  
  // Check if there's an extension
  const extension = path.extname(filename);
  return extension.toLowerCase();
};

// Get MIME type based on file extension
const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

// Upload a gallery image to Google Drive from the uploads folder
export const uploadGalleryImage = async (
  imageUrl: string, 
  category: string | null | undefined, 
  folderId: string
) => {
  try {
    // Use a default category if none provided
    const categoryName = category || 'Uncategorized';
    
    // Check if the URL is a local file in the uploads folder
    if (imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), imageUrl);
      const fileName = path.basename(imageUrl);
      const extension = path.extname(fileName).toLowerCase();
      const mimeType = getMimeType(extension);
      
      // If file exists, upload it
      if (fs.existsSync(filePath)) {
        return await uploadFileToDrive(filePath, fileName, mimeType, folderId);
      } else {
        throw new Error(`File not found: ${filePath}`);
      }
    } else if (imageUrl.startsWith('http')) {
      // For external URLs, just log that we're skipping
      log(`Skipping external URL: ${imageUrl}`, 'drive');
      return null;
    } else {
      throw new Error(`Invalid image URL format: ${imageUrl}`);
    }
  } catch (error) {
    log(`Error uploading gallery image: ${error}`, 'drive');
    throw error;
  }
};

// Create main folder and category subfolders
export const createGalleryFolderStructure = async (categories: string[]) => {
  try {
    // Create main Ko Lake Villa folder
    const mainFolderId = await createDriveFolder('Ko Lake Villa Media');
    
    // Create category subfolders
    const categoryFolders: Record<string, string> = {};
    
    // Process each category
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      // Skip undefined or null categories
      if (!category) continue;
      
      // Create folder for this category
      const folderId = await createDriveFolder(category, mainFolderId);
      categoryFolders[category] = folderId;
    }
    
    return { mainFolderId, categoryFolders };
  } catch (error) {
    log(`Error creating folder structure: ${error}`, 'drive');
    throw error;
  }
};