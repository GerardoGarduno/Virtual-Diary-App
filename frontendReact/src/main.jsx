import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY4nuJfu1qtb8eZL2nRc_tr0s_yQH5rxw",
  authDomain: "moneycounter-aaeb0.firebaseapp.com",
  projectId: "moneycounter-aaeb0",
  storageBucket: "moneycounter-aaeb0.firebasestorage.app",
  messagingSenderId: "227937604693",
  appId: "1:227937604693:web:39e3d770e77653267a30dc",
  measurementId: "G-YTBHRBEQTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)