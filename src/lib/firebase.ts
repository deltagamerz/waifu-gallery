// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm1A9Ib0qfD8Pd2EyIliz4W_c1sR1EaDk",
  authDomain: "image-gallery-6018f.firebaseapp.com",
  projectId: "image-gallery-6018f",
  storageBucket: "image-gallery-6018f.firebasestorage.app",
  messagingSenderId: "177090275031",
  appId: "1:177090275031:web:5bbe86fa571e28241eb292",
  measurementId: "G-GPPN1QPL00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);