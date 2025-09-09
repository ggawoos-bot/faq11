// Fix: Import initializeApp directly from "firebase/app" for Firebase v9+ SDK.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your web app's Firebase configuration.
// You can find this in your project's settings in the Firebase console.
  const firebaseConfig = {
    apiKey: "AIzaSyALICY0zBIfHEgfyH1Cld0nlCWZlVCUN3M",
    authDomain: "faq11-c6149.firebaseapp.com",
    projectId: "faq11-c6149",
    storageBucket: "faq11-c6149.firebasestorage.app",
    messagingSenderId: "1084196335748",
    appId: "1:1084196335748:web:76839e7054a23d056f92d1"
  };

// Initialize Firebase
// Fix: Call the imported initializeApp function directly.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
