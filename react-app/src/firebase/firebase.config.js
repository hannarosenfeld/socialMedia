// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import the auth module
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB41-LTd0FUDR6YxcceyWVVML7N6QH2SeE",
  authDomain: "relay--social.firebaseapp.com",
  projectId: "relay--social",
  storageBucket: "relay--social.appspot.com",
  messagingSenderId: "234653743957",
  appId: "1:234653743957:web:3df94592312a69cf5f4ddc",
  measurementId: "G-CVC2WS0NJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const firestore = getFirestore(app);

export { app, analytics, auth, db, firestore };
