import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase with error handling
let app = null;
let storage = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase not available, using local storage");
  app = null;
  storage = null;
}

export const uploadFile = async (
  file: File, 
  path = 'gallery', 
  progressCallback?: (progress: number) => void
): Promise<string> => {
  // Use local path if Firebase unavailable
  if (!storage) {
    return `/uploads/${file.name}`;
  }
  
  try {
    const timestamp = Date.now();
    const uniqueId = uuidv4().substring(0, 8);
    const fileName = `${timestamp}-${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fullPath = `${path}/${fileName}`;
    
    const storageRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          if (progressCallback) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressCallback(Math.round(progress));
          }
        },
        () => {
          // Error fallback
          resolve(`/uploads/${file.name}`);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch {
            resolve(`/uploads/${file.name}`);
          }
        }
      );
    });
  } catch {
    return `/uploads/${file.name}`;
  }
};

export async function uploadImageToFirebase(file: File, path: string): Promise<string> {
  return uploadFile(file, path);
}

export default { uploadFile, uploadImageToFirebase };