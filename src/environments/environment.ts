// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJIuuj83mE_cf9g5eGPb9juwgSKXa-l7o",
  authDomain: "homefit-9395b.firebaseapp.com",
  projectId: "homefit-9395b",
  storageBucket: "homefit-9395b.appspot.com",
  messagingSenderId: "252702106053",
  appId: "1:252702106053:web:6b40b11576bc9423626bac",
  measurementId: "G-JPH586J5QC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);