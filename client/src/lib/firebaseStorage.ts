import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

// Log Firebase configuration for debugging
console.log("Firebase configuration status:");
console.log("- API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log("- Storage Bucket exists:", !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log("- Project ID exists:", !!import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase - avoid duplicate initialization
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
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
  try {
    // Create a unique filename to prevent overwriting
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const fullPath = `${path}/${uniqueFilename}`;
    
    // Create reference to the file location
    const storageRef = ref(storage, fullPath);
    
    return new Promise((resolve, reject) => {
      // Use resumable upload for progress tracking
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
          
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          // Handle errors
          console.error("Upload error:", error);
          reject(new Error('Failed to upload file: ' + error.message));
        },
        async () => {
          // Upload completed successfully
          try {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(new Error('Failed to get download URL'));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error('Failed to upload file: ' + (error instanceof Error ? error.message : String(error)));
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