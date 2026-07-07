// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";


// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQfyEm-3gSJXPw2wYz4Jx9VL-sDqCRtms",
    authDomain: "ranger-rover-website.firebaseapp.com",
    projectId: "ranger-rover-website",
    storageBucket: "ranger-rover-website.firebasestorage.app",
    messagingSenderId: "716902324271",
    appId: "1:716902324271:web:ce0c323882b81c83ae4eda",
    measurementId: "G-SN8LTJTMGN"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Services
const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// Export Services
export { auth, db, storage };