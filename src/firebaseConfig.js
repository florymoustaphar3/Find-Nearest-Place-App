// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZEVyezVVo51swIgaz5HqyDiOPI8iizks",
  authDomain: "primfinds-b6365.firebaseapp.com",
  projectId: "primfinds-b6365",
  storageBucket: "primfinds-b6365.appspot.com",
  messagingSenderId: "579302422557",
  appId: "1:579302422557:web:76215627d88dc36085eef4",
  measurementId: "G-1S3Q2RW6HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
