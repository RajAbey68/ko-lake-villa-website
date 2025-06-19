import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC5xsgdPgOQP-ClyGxqswoxKFolMEVdLcw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ko-lake-villa-69f03.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ko-lake-villa-69f03",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ko-lake-villa-69f03.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1093542852432",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1093542852432:web:91ca5ad836208a2944de55"
};

// Log Firebase configuration for debugging
console.log("Firebase storage configuration:");
console.log("- Using project ID:", firebaseConfig.projectId);
console.log("- Using storage bucket:", firebaseConfig.storageBucket);

// Initialize Firebase - avoid duplicate initialization
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully for storage operations");
} catch (error) {
  console.error("Error initializing Firebase for storage:", error);
  // Create a minimal fallback for testing
  app = { name: 'fallback-app' } as any;
}
const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param {File} file - The file to upload
 * @param {string} path - Optional path within the storage bucket
 * @param {Function} progressCallback - Optional callback to track upload progress (0-100)
 * @returns {Promise<string>} - URL of the uploaded file
 */
export const uploadFile = async (
  file: File, 
  path = 'gallery', 
  progressCallback?: (progress: number) => void
): Promise<string> => {
  // For debugging: log file details
  console.log("Uploading file:", {
    name: file.name,
    size: file.size,
    type: file.type,
    path: path
  });
  
  try {
    // Create a unique filename to prevent overwriting
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const fullPath = `${path}/${uniqueFilename}`;
    
    console.log("Storage path:", fullPath);
    
    // Create reference to the file location
    const storageRef = ref(storage, fullPath);
    console.log("Storage reference created");
    
    // First try a simple upload to test permissions
    try {
      console.log("Testing upload with uploadBytes...");
      const metadata = {
        contentType: file.type || 'image/jpeg'
      };
      await uploadBytes(storageRef, file, metadata);
      console.log("Basic upload succeeded, now trying with progress tracking");
    } catch (error: any) {
      console.error("Test upload failed:", error);
      // If simple upload failed, throw an error with more details
      throw new Error(`Firebase Storage permission denied: ${error?.message || 'Unknown error'}`);
    }
    
    return new Promise((resolve, reject) => {
      // Use resumable upload for progress tracking
      console.log("Starting resumable upload with progress tracking");
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Listen for state changes
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          
          // Call progress callback if provided
          if (progressCallback) {
            progressCallback(progress);
          }
          
          console.log(`Upload progress: ${progress}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes)`);
        },
        (error) => {
          // Handle errors
          console.error("Upload error:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          
          // Check for specific Firebase storage errors
          let errorMessage = 'Failed to upload file: ';
          
          if (error.code === 'storage/unauthorized') {
            errorMessage += 'You don\'t have permission to access Firebase Storage.';
          } else if (error.code === 'storage/canceled') {
            errorMessage += 'Upload was canceled.';
          } else if (error.code === 'storage/unknown') {
            errorMessage += 'Unknown error occurred, check Firebase Storage rules.';
          } else {
            errorMessage += error.message;
          }
          
          reject(new Error(errorMessage));
        },
        async () => {
          // Upload completed successfully
          console.log("Upload completed, getting download URL");
          try {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL obtained:", downloadURL);
            resolve(downloadURL);
          } catch (error: any) {
            console.error("Error getting download URL:", error);
            reject(new Error('Failed to get download URL: ' + (error?.message || 'Unknown error')));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in uploadFile function:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred during upload';
    
    console.error("Error details:", errorMessage);
    throw new Error('Upload failed: ' + errorMessage);
  }
};

/**
 * Generate a Firebase Storage reference for a specific path
 * @param {string} path - Path within the storage bucket
 * @returns {StorageReference} - Firebase Storage reference
 */
export const getStorageRef = (path: string) => {
  return ref(storage, path);
};

/**
 * Get the download URL for a file in Firebase Storage
 * @param {string} path - Path to the file within the storage bucket
 * @returns {Promise<string>} - Download URL for the file
 */
export const getFileUrl = async (path: string): Promise<string> => {
  const fileRef = ref(storage, path);
  return await getDownloadURL(fileRef);
};