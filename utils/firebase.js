import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBikvddyw4_v76vs6f2AoPza-sFG7II2KA",
  authDomain: "restaurants-421a1.firebaseapp.com",
  projectId: "restaurants-421a1",
  storageBucket: "restaurants-421a1.appspot.com",
  messagingSenderId: "154186276108",
  appId: "1:154186276108:web:6daa06aa8a5fccfa0a7d29",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
