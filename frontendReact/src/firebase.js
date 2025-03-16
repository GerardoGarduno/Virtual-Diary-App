import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY4nuJfu1qtb8eZL2nRc_tr0s_yQH5rxw",
  authDomain: "moneycounter-aaeb0.firebaseapp.com",
  projectId: "moneycounter-aaeb0",
  storageBucket: "moneycounter-aaeb0.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "227937604693",
  appId: "1:227937604693:web:39e3d770e77653267a30dc",
  measurementId: "G-YTBHRBEQTP",
  databaseURL: "https://moneycounter-aaeb0-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, analytics, auth, storage, database };