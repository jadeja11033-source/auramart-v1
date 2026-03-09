import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ye details aapko Firebase Console se milengi (Project Settings mein)
const firebaseConfig = {
  apiKey: "AIzaSyCxNArIhYNeOZuQFzFCIBK2qeAmghTV9Hk",
  authDomain: "auramart-82467.firebaseapp.com",
  projectId: "auramart-82467",
  storageBucket: "auramart-82467.firebasestorage.app",
  messagingSenderId: "67507250786",
  appId: "1:67507250786:web:b124fff4739c5de5c7933b",
  measurementId: "G-YXCWM1JE10"
};

// 1. Firebase App initialize kar rahe hain
const app = initializeApp(firebaseConfig);

// 2. Auth service: Login aur Signup handle karne ke liye
export const auth = getAuth(app);

// 3. Firestore: Products aur Orders ka data save karne ke liye
export const db = getFirestore(app);