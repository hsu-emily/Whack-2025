// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required Firebase config values
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field] === undefined);

if (missingFields.length > 0) {
  console.error('Firebase configuration error: Missing required environment variables:', missingFields);
  console.error('Please create a .env file with the following variables:');
  missingFields.forEach(field => {
    console.error(`  VITE_FIREBASE_${field.toUpperCase().replace(/([A-Z])/g, '_$1')}`);
  });
}

// Initialize Firebase app
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  console.error('Please verify your Firebase configuration values in the .env file are correct');
  console.error('Common issues:');
  console.error('  - appId does not match your Firebase project');
  console.error('  - projectId is incorrect');
  console.error('  - apiKey is invalid or expired');
  throw error; // Re-throw to prevent silent failures
}

// Initialize Analytics only if supported and in browser environment
// Analytics initialization is wrapped in try-catch to prevent errors from breaking the app
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    // Check if analytics is supported before initializing
    isSupported().then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (error) {
          console.warn('Firebase Analytics initialization failed:', error.message);
        }
      }
    }).catch(() => {
      // Analytics not supported, continue without it
    });
  } catch (error) {
    console.warn('Firebase Analytics setup error:', error.message);
  }
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);


// match /punchPasses/{passId} {
//   allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
// }