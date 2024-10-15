// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI-RC64PZ18hcqGGi6nhYNbf7Uaabf95o",
  authDomain: "homefit-493ec.firebaseapp.com",
  projectId: "homefit-493ec",
  storageBucket: "homefit-493ec.appspot.com",
  messagingSenderId: "875455240235",
  appId: "1:875455240235:web:0568ef74d5d13f2978326e",
  measurementId: "G-KPM4098M0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBI-RC64PZ18hcqGGi6nhYNbf7Uaabf95o",
    authDomain: "homefit-493ec.firebaseapp.com",
    projectId: "homefit-493ec",
    storageBucket: "homefit-493ec.appspot.com",
    messagingSenderId: "875455240235",
    appId: "1:875455240235:web:0568ef74d5d13f2978326e",
    measurementId: "G-KPM4098M0R"
  }
};