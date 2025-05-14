import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Optional path within the storage bucket
 * @returns {Promise<string>} - URL of the uploaded file
 */
export const uploadFile = async (file: File, path = 'gallery'): Promise<string> => {
  try {
    // Create a unique filename to prevent overwriting
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const fullPath = `${path}/${uniqueFilename}`;
    
    // Create reference to the file location
    const storageRef = ref(storage, fullPath);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error('Failed to upload file.');
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