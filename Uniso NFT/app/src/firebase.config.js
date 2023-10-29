// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdK4ClTrD1WuEAmHyAww_c5l40bxXZKbE",
    authDomain: "sample-project-382e9.firebaseapp.com",
    projectId: "sample-project-382e9",
    storageBucket: "sample-project-382e9.appspot.com",
    messagingSenderId: "14597280247",
    appId: "1:14597280247:web:cb1922e09e8bf630259ef2",
    measurementId: "G-7N5RX3GEVW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);