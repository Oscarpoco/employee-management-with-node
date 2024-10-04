

// services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyA79Nf7JGxorYZ0yd-Ld4ZEdAOSHmNhnYQ",
  authDomain: "employee-registration-23309.firebaseapp.com",
  projectId: "employee-registration-23309",
  storageBucket: "employee-registration-23309.appspot.com",
  messagingSenderId: "550538282993",
  appId: "1:550538282993:web:2ff802b876725a52ace650",
  measurementId: "G-SQWE3DVCZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Optional

export { db, auth, storage };

