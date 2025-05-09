import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBBgBWe8Mapr2lE0EhRMtPWGTWkZDYMCOU",
  authDomain: "wallpaperverse-87927.firebaseapp.com",
  databaseURL: "https://wallpaperverse-87927-default-rtdb.firebaseio.com",
  projectId: "wallpaperverse-87927",
  storageBucket: "wallpaperverse-87927.appspot.com",
  messagingSenderId: "833948658302",
  appId: "1:833948658302:web:70b06b45f23f5489e7862f",
  measurementId: "G-TKR66VB2C3",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)
