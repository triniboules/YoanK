// Import necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp, arrayUnion, getDoc, collection, getDocs } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

// Export Firestore and other necessary functions for use in the app
export { db, Timestamp, setDoc, doc, arrayUnion, getDoc, collection, getDocs, };
