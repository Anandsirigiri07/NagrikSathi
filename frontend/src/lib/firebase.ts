import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

console.log('Firebase Config:', firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase App initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback to avoid complete crash, though auth will fail
  app = initializeApp({ apiKey: 'none', projectId: 'none' }); 
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  console.log('Attempting Google Sign-In...');
  return signInWithPopup(auth, googleProvider);
};

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (elementId: string) => {
  if (!recaptchaVerifier) {
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, elementId, { size: 'invisible' });
    } catch (e) {
      console.warn("Recaptcha init failed", e);
    }
  }
  return recaptchaVerifier;
};

export const signInWithPhone = (phone: string, verifier: RecaptchaVerifier) =>
  signInWithPhoneNumber(auth, phone, verifier);

export const logOut = () => signOut(auth);
export { onAuthStateChanged, type User };
