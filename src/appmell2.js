// Firebase SDK importálása
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";

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
const database = getDatabase(app);

// Adatok feltöltése a Firebase-be (példák feltöltése a mellizomhoz)
set(ref(database, 'workouts/mell/gyakorlatok/gyakorlat1'), {
  nev: "Fekvőtámasz",
  naplozas: {
    suly: 40,
    datum: "2025-04-17"
  },
  pelda: "Egy egyszerű fekvőtámasz, amely minden edzésprogram alapja."
});

set(ref(database, 'workouts/mell/gyakorlatok/gyakorlat2'), {
  nev: "Pecs pressz",
  naplozas: {
    suly: 55,
    datum: "2025-04-15"
  },
  pelda: "A pecs pressz segít a mellkas fejlesztésében."
});

set(ref(database, 'workouts/mell/gyakorlatok/gyakorlat3'), {
  nev: "Tárogatás",
  naplozas: {
    suly: 25,
    datum: "2025-04-14"
  },
  pelda: "A tárogatás az egyik legjobb mellizom gyakorlat."
});

// A lekérdezni kívánt gyakorlat referencia
const gyakorlatRef = ref(database, 'workouts/mell/gyakorlatok/gyakorlat1');

// Adatok lekérése
get(gyakorlatRef).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();  // Az adatok itt lesznek
    // A gyakorlat adatai
    const nev = data.nev;
    const suly = data.naplozas.suly;
    const datum = data.naplozas.datum;
    const pelda = data.pelda;  // Példa adat

    // A HTML-ben való megjelenítés
    document.getElementById('gyakorlat-nev').innerText = "Gyakorlat neve: " + nev;
    document.getElementById('gyakorlat-suly').innerText = "Súly: " + suly + " kg";
    document.getElementById('gyakorlat-datum').innerText = "Dátum: " + datum;
    document.getElementById('gyakorlat-pelda').innerText = "Példa: " + pelda;  // A példa megjelenítése
  } else {
    console.log("Nincs adat!");
  }
}).catch((error) => {
  console.error("Hiba történt az adatok lekérésekor:", error);
});
