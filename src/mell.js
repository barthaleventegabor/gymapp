import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getDatabase, ref, set, get, push, remove } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";

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

// Az "Rögzítés" gomb eseménykezelője
document.getElementById('sendincdb').addEventListener('click', function() {
  const weight = document.getElementById('inclinedbsuly').value; // Az űrlapból beírt súly
  const date = new Date().toLocaleDateString(); // A mai dátum

  if (weight !== "") {
    // Adat rögzítése Firebase-ben
    const newPostKey = push(ref(database, 'gyakorlatok')).key; // Új kulcs generálása
    set(ref(database, 'gyakorlatok/' + newPostKey), {
      date: date,
      weight: weight
    }).then(() => {
      // Az új adat hozzáadása után frissítjük a táblázatot
      addGyakorlatToTable(date, weight, newPostKey); // Hozzáadjuk a key-t is a funkcióhoz
      document.getElementById('inclinedbsuly').value = ''; // Űrlap törlése
    }).catch((error) => {
      console.error("Hiba történt az adat rögzítése során: ", error);
    });
  }
});

// Funkció, ami hozzáadja a gyakorlatot a táblázathoz
function addGyakorlatToTable(date, weight, key) {
  const gyakorlatokDiv = document.querySelector('.gyakorlatok');

  const newGyakorlat = document.createElement('div');
  newGyakorlat.classList.add('gyakorlat');
  newGyakorlat.dataset.key = key; // Az adat key hozzáadása a div-hez

  const dateDiv = document.createElement('div');
  dateDiv.classList.add('gyakorlatdata');
  dateDiv.textContent = date;

  const weightDiv = document.createElement('div');
  weightDiv.classList.add('gyakorlatdata');
  weightDiv.textContent = weight;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('torlo');
  deleteButton.textContent = 'Törlés';
  deleteButton.addEventListener('click', function() {
    deleteGyakorlat(key, newGyakorlat); // A gomb megnyomásakor törölni fogjuk az adatot
  });

  newGyakorlat.appendChild(dateDiv);
  newGyakorlat.appendChild(weightDiv);
  newGyakorlat.appendChild(deleteButton);

  gyakorlatokDiv.appendChild(newGyakorlat); // Az új gyakorlatot a lista végére helyezi
}

// Funkció a gyakorlat törlésére Firebase-ből és a DOM-ból
function deleteGyakorlat(key, gyakorlatDiv) {
  const gyakorlatRef = ref(database, 'gyakorlatok/' + key);

  // Az adat törlése Firebase-ből
  remove(gyakorlatRef).then(() => {
    // Ha sikerült törölni, eltávolítjuk a DOM-ból
    gyakorlatDiv.remove();
  }).catch((error) => {
    console.error("Hiba történt a törlés során: ", error);
  });
}

// Az oldal betöltésekor minden adat lekérése a Firebase-ből
window.onload = function() {
  const dbRef = ref(database, 'gyakorlatok');
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const gyakorlatok = snapshot.val();
      for (const key in gyakorlatok) {
        const date = gyakorlatok[key].date;
        const weight = gyakorlatok[key].weight;
        addGyakorlatToTable(date, weight, key); // Az adatokat hozzáadjuk a táblázathoz
      }
    }
  }).catch((error) => {
    console.error("Hiba történt az adatok betöltése során: ", error);
  });
};
