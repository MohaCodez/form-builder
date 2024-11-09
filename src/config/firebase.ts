import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7MGVYKolcucdDdFXwa_g7s3TVFCS8ldE",
  authDomain: "form-builder-24154.firebaseapp.com",
  projectId: "form-builder-24154",
  storageBucket: "form-builder-24154.firebasestorage.app",
  messagingSenderId: "326751172366",
  appId: "1:326751172366:web:3ec1d287340482a40c495f",
  measurementId: "G-VEW6Q7G9BB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
