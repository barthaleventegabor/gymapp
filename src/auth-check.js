import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-auth.js";

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyD4okJhAEH6HjxsH84mynAtMhXggxK2URI",
  authDomain: "gymapp-93351.firebaseapp.com",
  databaseURL: "https://gymapp-93351-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gymapp-93351",
  storageBucket: "gymapp-93351.appspot.com",
  messagingSenderId: "679760443477",
  appId: "1:679760443477:web:76d9b1217b67f6df2fbcdc"
};

// Firebase inicializálás
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Bejelentkezési állapot figyelés
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Nincs bejelentkezve -> irány vissza az index.html-re
    window.location.href = "index.html";
  } else {
    console.log("Be van jelentkezve:", user.email);
    // Itt csinálhatsz mást is, ha akarsz
  }
});
