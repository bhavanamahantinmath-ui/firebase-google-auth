// =============================================================================
// Firebase Configuration & Initialization
// Replace the values below with your credentials from Firebase Console:
// Project Settings -> General -> Your apps -> Web app (</>)
// =============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYqaISdZViVwNcF5Jr36Ni8mvOxBBRYiw",
    authDomain: "auth-app-1ffa2.firebaseapp.com",
    projectId: "auth-app-1ffa2",
    storageBucket: "auth-app-1ffa2.firebasestorage.app",
    messagingSenderId: "170938265697",
    appId: "1:170938265697:web:24d4aa82bd99916619fa20",
    measurementId: "G-TST3TEWB61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Prompt user to select Google account each time
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged
};

