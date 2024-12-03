import { initializeApp,getApps, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDtvthrRMEHB2uhla4uJDjOKeNANw5_vfY",
    authDomain: "dochive-2aa18.firebaseapp.com",
    projectId: "dochive-2aa18",
    storageBucket: "dochive-2aa18.firebasestorage.app",
    messagingSenderId: "700981995112",
    appId: "1:700981995112:web:2bbf9824a30a28ae73fddd"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  const db = getFirestore(app)

  export {db}