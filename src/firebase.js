// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH3b4REpFQ62Lmu7XMjd7PyK84vvagl1I",
  authDomain: "assignment--submission.firebaseapp.com",
  projectId: "assignment--submission",
  storageBucket: "assignment--submission.firebasestorage.app",
  messagingSenderId: "942206471384",
  appId: "1:942206471384:web:e9327a00c733e85134dbad",
  measurementId: "G-7LNT7TZJ50"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };


export const storage = getStorage(app);