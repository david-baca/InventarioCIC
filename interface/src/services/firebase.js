import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAnPO1fzQAc5pNhtqpqbu-EBGJmeDnYy38",
    authDomain: "logincic-upqroo.firebaseapp.com",
    projectId: "logincic-upqroo",
    storageBucket: "logincic-upqroo.appspot.com",
    messagingSenderId: "333420260408",
    appId: "1:333420260408:web:269fb5e2ca340bf20e4acd"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);