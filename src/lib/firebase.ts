import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { browser } from '$app/environment';

let app: FirebaseApp;
let db: Firestore;

const firebaseConfig = {
    apiKey: "AIzaSyBuVQfPvgbFRJZVkYoRQKQEtXUCPbdnOyE",
    authDomain: "yoannkittery.firebaseapp.com",
    projectId: "yoannkittery",
    storageBucket: "yoannkittery.appspot.com",
    messagingSenderId: "1075249144147",
    appId: "1:1075249144147:web:0f7f8a3e0f0f0f0f0f0f0f",
    measurementId: "G-XXXXXXXXXX"
};

if (browser) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
}

export { app, db };
