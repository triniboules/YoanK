// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (this should come from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyAKkejhUq7paQc2LR3CmUvKaC9KSueQNIk",
  authDomain: "trinidatabase.firebaseapp.com",
  projectId: "trinidatabase",
  storageBucket: "trinidatabase.appspot.com",
  messagingSenderId: "878723184583",
  appId: "1:878723184583:web:d621be34788401bc168be2",
  measurementId: "G-D7RDGSY95F" // This is only needed if you use Firebase Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (for database usage)
const db = getFirestore(app);

// If you plan to use Firebase Analytics, you can uncomment this
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);

export { db };
