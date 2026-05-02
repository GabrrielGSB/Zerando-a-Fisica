import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importe o Firestore
// Removido o Analytics, pois ele não funciona no Node.js

const firebaseConfig = {
  apiKey: "AIzaSyDfJIYI48LwgKq8RtRyddHyNlwJ5W6crLI",
  authDomain: "zerando-a-fisica.firebaseapp.com",
  projectId: "zerando-a-fisica",
  storageBucket: "zerando-a-fisica.firebasestorage.app",
  messagingSenderId: "948702485678",
  appId: "1:948702485678:web:876fc667f0097ffae4e13f",
  measurementId: "G-8FMYY8HGNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Obtenha uma referência ao Firestore e exporta para outros arquivos
const db = getFirestore(app); export default db;

