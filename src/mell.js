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

// Funkció a gyakorlatok adatainak rögzítésére
function recordExercise(exerciseName, inputId, containerId, buttonId) {
  document.getElementById(buttonId).addEventListener('click', function() {
    const weight = document.getElementById(inputId).value; // Az űrlapból beírt súly
    const date = new Date().toLocaleDateString(); // A mai dátum

    if (weight !== "") {
      const newPostKey = push(ref(database, exerciseName)).key; // Új kulcs generálása
      set(ref(database, exerciseName + '/' + newPostKey), {
        date: date,
        weight: weight
      }).then(() => {
        addExerciseToTable(containerId, date, weight, newPostKey); // Hozzáadjuk a táblázathoz
        document.getElementById(inputId).value = ''; // Űrlap törlése
      }).catch((error) => {
        console.error("Hiba történt az adat rögzítése során: ", error);
      });
    }
  });
}

// Funkció, ami hozzáadja a gyakorlatot a táblázathoz
function addExerciseToTable(containerId, date, weight, key) {
  const gyakorlatokDiv = document.getElementById(containerId);

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
    deleteExercise(containerId, key, newGyakorlat); // A gomb megnyomásakor törölni fogjuk az adatot
  });

  newGyakorlat.appendChild(dateDiv);
  newGyakorlat.appendChild(weightDiv);
  newGyakorlat.appendChild(deleteButton);

  // Új gyakorlatot a lista legelső helyére rakjuk
  gyakorlatokDiv.insertBefore(newGyakorlat, gyakorlatokDiv.firstChild); // Új elem az elejére kerül
}

// Funkció a gyakorlat törlésére Firebase-ből és a DOM-ból
function deleteExercise(containerId, key, gyakorlatDiv) {
  const exerciseName = containerId; // A containerId azonosítója lesz az exerciseName
  const gyakorlatRef = ref(database, exerciseName + '/' + key);

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
  // Incline Dumbbell Press
  fetchExerciseData('inclinedumbbellpress', 'incline-dumbbell-press');

  // Gépes Nyomás
  fetchExerciseData('gepesnyomas', 'machine-press');

  // Tárogatás
  fetchExerciseData('flatarogatas', 'fly-press');
};

// Funkció a gyakorlatok adatainak lekérésére
function fetchExerciseData(exerciseName, containerId) {
  const dbRef = ref(database, exerciseName);
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const exercises = snapshot.val();
      // A legújabb adatokat először jelenítjük meg
      const sortedExercises = Object.keys(exercises).sort((a, b) => new Date(exercises[b].date) - new Date(exercises[a].date));
      
      sortedExercises.forEach((key) => {
        const date = exercises[key].date;
        const weight = exercises[key].weight;
        addExerciseToTable(containerId, date, weight, key);
      });
    }
  }).catch((error) => {
    console.error("Hiba történt az adatok betöltése során: ", error);
  });
}

// Rögzítés az összes gyakorlatra
recordExercise('inclinedumbbellpress', 'inclinedbsuly', 'incline-dumbbell-press', 'sendincdb');
recordExercise('gepesnyomas', 'machinepresssuly', 'machine-press', 'sendmachinepress');
recordExercise('flatarogatas', 'flatarogatsuly', 'fly-press', 'sendflatarogat');
