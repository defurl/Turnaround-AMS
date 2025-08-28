// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC0pO2Hav4sDLSryY9fjS8UL3Cj0OL7lyk",
  authDomain: "turnaround-ams.firebaseapp.com",
  databaseURL: "https://turnaround-ams-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "turnaround-ams",
  storageBucket: "turnaround-ams.firebasestorage.app",
  messagingSenderId: "742173775021",
  appId: "1:742173775021:web:4b6510f719695a01696224",
  measurementId: "G-NDG4195ERJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);