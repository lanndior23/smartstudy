// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4ZzukpOjoh0G4J126vabAGDtf6tL6fq0",
  authDomain: "smartstudy-23492.firebaseapp.com",
  projectId: "smartstudy-23492",
  storageBucket: "smartstudy-23492.firebasestorage.app",
  messagingSenderId: "726830389180",
  appId: "1:726830389180:web:a834fe253b3c6077cbfdb9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
