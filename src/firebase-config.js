// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMd7ufeJGwKuq_4FcOsHzuo75j5hPb2bA",
  authDomain: "help-it----firebase-project.firebaseapp.com",
  projectId: "help-it----firebase-project",
  storageBucket: "help-it----firebase-project.firebasestorage.app",
  databaseURL:
    "https://help-it----firebase-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  messagingSenderId: "861502596416",
  appId: "1:861502596416:web:be39b6029e0522e834c6a5",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
