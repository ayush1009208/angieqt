import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-RW_TxIo8wooH6RckAg_OB55e9UmsvM4",
  authDomain: "angie-f9ff5.firebaseapp.com",
  projectId: "angie-f9ff5",
  storageBucket: "angie-f9ff5.firebasestorage.app",
  messagingSenderId: "1051972297837",
  appId: "1:1051972297837:web:405189e9597041af120b64"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore and export
export const db = getFirestore(app);

// Initialize Storage and export
export const storage = getStorage(app);
