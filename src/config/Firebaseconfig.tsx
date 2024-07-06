// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhhK7QNwI-J5ShEdvznjoDl5CjpC8KDHs",
  authDomain: "schooling-software.firebaseapp.com",
  databaseURL: "https://schooling-software-default-rtdb.firebaseio.com",
  projectId: "schooling-software",
  storageBucket: "schooling-software.appspot.com",
  messagingSenderId: "782747203624",
  appId: "1:782747203624:web:a62c0d2e9971ad555c1d1d",
  measurementId: "G-L7GK3KZF31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Export the app and other Firebase services
export { 
  app,
  db,
  auth,
  storage,
  ref,
  set,
  push,
  onValue,
  remove
};

// Export app as default for backwards compatibility
export default app;