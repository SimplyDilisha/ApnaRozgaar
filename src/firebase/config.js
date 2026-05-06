// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBC6KyHuZdb680OGYYEnBmX4lxFElib5xk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rozgar-61d46.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://rozgar-61d46-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rozgar-61d46",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rozgar-61d46.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "909895055014",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:909895055014:web:0310f880801be1322ce667",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-S0JD19XZ6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const rtdb = getDatabase(app);

// Analytics can fail on localhost or when not configured — don't let it crash the app
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (err) {
  console.warn('Firebase Analytics not available:', err.message);
}
export { analytics };

export default app;
