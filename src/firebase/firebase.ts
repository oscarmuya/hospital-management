import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVs919nO72jqPyRqEwFlEw1xK8UYPPebc",
  authDomain: "hospital-management-166f6.firebaseapp.com",
  projectId: "hospital-management-166f6",
  storageBucket: "hospital-management-166f6.firebasestorage.app",
  messagingSenderId: "939385988706",
  appId: "1:939385988706:web:fe31d0412d1f800ea2d33b",
  measurementId: "G-950L3T08G1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);
export { auth, storage, db };
export default db;
