
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// 🔥 FIREBASE CONFIGURATION - PRODUCTION READY
// To switch to production: Replace these values with your production Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAw3Ux2b0DN1vi0xouyqeGfdYPQ8NBG6Rg",
  authDomain: "tekmbloggennie.firebaseapp.com",
  projectId: "tekmbloggennie",
  storageBucket: "tekmbloggennie.firebasestorage.app",
  messagingSenderId: "648005745114",
  appId: "1:648005745114:web:4f170d2f9b2ec99f14e8e3",
  measurementId: "G-YLX8LSLLHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - only in production/browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
