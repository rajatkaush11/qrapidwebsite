// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCwt8azeI_GeGB69fE4ZiU3VvaAA5mJrkw",
    authDomain: "admindashboard-5e64e.firebaseapp.com",
    projectId: "admindashboard-5e64e",
    storageBucket: "admindashboard-5e64e.appspot.com",
    messagingSenderId: "904048817578",
    appId: "1:904048817578:web:1ce3cf54a98edaaff8e7d3"
  };
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
