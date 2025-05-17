// firebase.js
import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Function to sign in anonymously and get a user ID (client-side only)
export const getOrCreateAnonymousUser = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    try {
      if (auth.currentUser) {
        return auth.currentUser.uid;
      }
      const userCredential = await signInAnonymously(auth);
      return userCredential.user.uid;
    } catch (error: any) {
      console.error("Error signing in anonymously:", error);
      if (error.code !== 'auth/admin-restricted-operation') {
        console.error("Error signing in anonymously:", error);
      }
      return null;
    }
  } else {
    console.warn("Anonymous sign-in not available on the server.");
    return null;
  }
};