// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDXujp86wcighY2Xjhfe1LF4IXEFwdnOMo",
//   authDomain: "chat-app-demo-1315c.firebaseapp.com",
//   projectId: "chat-app-demo-1315c",
//   storageBucket: "chat-app-demo-1315c.appspot.com",
//   messagingSenderId: "291638349175",
//   appId: "1:291638349175:web:977dc853a7c6813d316572",
//   measurementId: "G-E7NM22KXBC",
// };
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

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
export { auth, db, storage };
