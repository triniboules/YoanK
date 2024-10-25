import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAKkejhUq7paQc2LR3CmUvKaC9KSueQNIk",
  authDomain: "trinidatabase.firebaseapp.com",
  projectId: "trinidatabase",
  storageBucket: "trinidatabase.appspot.com",
  messagingSenderId: "878723184583",
  appId: "1:878723184583:web:d621be34788401bc168be2"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {
  db as d
};
