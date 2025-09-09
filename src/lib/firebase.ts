import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace this configuration with your actual Firebase project config
// Go to Firebase Console > Project Settings > General > Your apps > Config
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
export const analytics = getAnalytics(app);

export default app;
