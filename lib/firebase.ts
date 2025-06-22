// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBArm7ej3j4lbgMbMh1VwuEVRaNUwzLrhE",
  authDomain: "bank-970bc.firebaseapp.com",
  projectId: "bank-970bc",
  storageBucket: "bank-970bc.firebasestorage.app",
  messagingSenderId: "441796527798",
  appId: "1:441796527798:web:60459d99604d770eccc817",
  measurementId: "G-RPM3RD15M3",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)

// Initialize Analytics only on client side
let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { analytics }
export default app
