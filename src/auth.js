import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-auth.js";

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyD4okJhAEH6HjxsH84mynAtMhXggxK2URI",
  authDomain: "gymapp-93351.firebaseapp.com",
  databaseURL: "https://gymapp-93351-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gymapp-93351",
  storageBucket: "gymapp-93351.firebasestorage.app",
  messagingSenderId: "679760443477",
  appId: "1:679760443477:web:76d9b1217b67f6df2fbcdc"
};

// Firebase alkalmazás inicializálása
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google login provider
const provider = new GoogleAuthProvider();

// A bejelentkezési gomb funkciója
document.getElementById('google-login').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      // Ellenőrizzük, hogy a megfelelő fiókkal jelentkezett-e be
      if (user.email === "b.levi.levi@gmail.com") {
        console.log("Bejelentkezve:", user.displayName);
        // Beállítjuk a localStorage-ba a felhasználói adatokat
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('content').style.display = 'block'; // A tartalom láthatóvá tétele
        document.getElementById('login-container').style.display = 'none'; // A bejelentkezési gomb eltüntetése
        document.getElementById('logout-container').style.display = 'block'; // A kijelentkezési gomb megjelenítése
      } else {
        alert("Hozzáférés megtagadva. Csak a saját fiókom fiók használható.");
        signOut(auth);
      }
    })
    .catch((error) => {
      console.error("Hiba történt a bejelentkezés során:", error);
    });
});

// Kijelentkezés gomb funkciója
document.getElementById('google-logout').addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log("Kijelentkezve");
    // Töröljük a localStorage-ból a felhasználói adatokat
    localStorage.removeItem('user');
    document.getElementById('content').style.display = 'none'; // A tartalom eltüntetése
    document.getElementById('login-container').style.display = 'block'; // A bejelentkezési gomb megjelenítése
    document.getElementById('logout-container').style.display = 'none'; // A kijelentkezési gomb eltüntetése
  }).catch((error) => {
    console.error("Hiba történt a kijelentkezés során:", error);
  });
});

// Az aktuális felhasználó állapotának figyelése
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Ha a felhasználó be van jelentkezve, a tartalom megjelenik
    console.log("Bejelentkezve:", user.displayName);
    document.getElementById('content').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('logout-container').style.display = 'block';
  } else {
    // Ha nincs bejelentkezve, a tartalom el van rejtve
    console.log("Nincs bejelentkezve");
    document.getElementById('content').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('logout-container').style.display = 'none';
  }
});
