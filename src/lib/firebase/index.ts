// Mock Firebase - no actual Firebase initialization
// This provides a compatible interface for the app to work without Firebase

import { 
  signInWithPopup,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd2wrFZXPCHDLcRxsji9VPrIsldsWeJ2s",
  authDomain: "divinity-f6971.firebaseapp.com",
  projectId: "divinity-f6971",
  storageBucket: "divinity-f6971.firebasestorage.app",
  messagingSenderId: "1007088459265",
  appId: "1:1007088459265:web:b43f550c280226825dea00",
  measurementId: "G-E9LK3NQKW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Get auth instance
import { getAuth } from 'firebase/auth';
const auth = getAuth(app);

// Set persistence
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(console.error);
}

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Re-export everything needed
export { 
  app, 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  firebaseSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
};
