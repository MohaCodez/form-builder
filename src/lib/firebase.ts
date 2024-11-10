import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZ-l38kh25qE0s1F-p4PGd0ZaCOQkpH0E",
  authDomain: "approval-form-builder.firebaseapp.com",
  projectId: "approval-form-builder",
  storageBucket: "approval-form-builder.firebasestorage.app",
  messagingSenderId: "771942475450",
  appId: "1:771942475450:web:32181a280d88c8ee228483"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);