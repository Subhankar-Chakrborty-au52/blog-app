// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tech-blog-1cc7a.firebaseapp.com",
  projectId: "tech-blog-1cc7a",
  storageBucket: "tech-blog-1cc7a.appspot.com",
  messagingSenderId: "805228802655",
  appId: "1:805228802655:web:2f6c24297d7b56e48f61ea",
  measurementId: "G-P4J8DTDWSF",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
