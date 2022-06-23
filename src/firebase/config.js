// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhQ0PDhhM_8Owa8D7HfrnEo1KseZ6JREw",
  authDomain: "web-app-chat-demo.firebaseapp.com",
  projectId: "web-app-chat-demo",
  storageBucket: "web-app-chat-demo.appspot.com",
  messagingSenderId: "467812895730",
  appId: "1:467812895730:web:67de32f6f518dffbd4396b",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
