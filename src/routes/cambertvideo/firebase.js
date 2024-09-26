// Import necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp, arrayUnion, getDoc, collection, getDocs } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAKkejhUq7paQc2LR3CmUvKaC9KSueQNIk",
    authDomain: "trinidatabase.firebaseapp.com",
    projectId: "trinidatabase",
    storageBucket: "trinidatabase.appspot.com",
    messagingSenderId: "878723184583",
    appId: "1:878723184583:web:d621be34788401bc168be2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

// Export Firestore and other necessary functions for use in the app
export { db, Timestamp, setDoc, doc, arrayUnion, getDoc, collection, getDocs };

// Optional: If you plan to use Firestore batch operations, you can also export the batch function
// import { writeBatch } from 'firebase/firestore';
// export { writeBatch };
