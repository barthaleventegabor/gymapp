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

// Funkciók rögzítéshez
function recordExercise(exerciseName, inputId, containerId, buttonId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  
  // Ellenőrizd, hogy az elem létezik, mielőtt hozzáadod az eseménykezelőt
  if (button && input) {
    button.addEventListener('click', function() {
      const weight = input.value; // Az űrlapból beírt súly
      const date = new Date().toLocaleDateString(); // A mai dátum

      if (weight !== "") {
        const newPostKey = push(ref(database, exerciseName)).key; // Új kulcs generálása
        set(ref(database, exerciseName + '/' + newPostKey), {
          date: date,
          weight: weight
        }).then(() => {
          addExerciseToTable(containerId, date, weight, newPostKey); // Hozzáadjuk a táblázathoz
          input.value = ''; // Űrlap törlése
        }).catch((error) => {
          console.error("Hiba történt az adat rögzítése során: ", error);
        });
      }
    });
  } else {
    console.error(`Nem található elem: ${buttonId} vagy ${inputId}`);
  }
}

// Funkció a gyakorlatok megjelenítéséhez a táblázatban
function addExerciseToTable(containerId, date, weight, key) {
  const gyakorlatokDiv = document.getElementById(containerId);
  
  // Ellenőrizzük, hogy létezik-e a containerId
  if (gyakorlatokDiv) {
    const newGyakorlat = document.createElement('div');
    newGyakorlat.classList.add('gyakorlat');
    newGyakorlat.dataset.key = key;

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
      deleteExercise(containerId, key, newGyakorlat); // Törlés
    });

    newGyakorlat.appendChild(dateDiv);
    newGyakorlat.appendChild(weightDiv);
    newGyakorlat.appendChild(deleteButton);

    gyakorlatokDiv.insertBefore(newGyakorlat, gyakorlatokDiv.firstChild); // Az új gyakorlatot a lista elejére helyezzük
  } else {
    console.error(`Nem található a containerId: ${containerId}`);
  }
}

// Funkció a gyakorlat törlésére Firebase-ből és a DOM-ból
function deleteExercise(containerId, key, gyakorlatDiv) {
  const exerciseName = containerId; // A containerId azonosítója lesz az exerciseName
  const gyakorlatRef = ref(database, exerciseName + '/' + key);

  // Az adat törlése Firebase-ből
  remove(gyakorlatRef).then(() => {
    gyakorlatDiv.remove(); // Ha sikerült törölni, eltávolítjuk a DOM-ból
  }).catch((error) => {
    console.error("Hiba történt a törlés során: ", error);
  });
}

// Az oldal betöltésekor minden adat lekérése a Firebase-ből
window.onload = function() {
  // Mell Gyakorlatok
  fetchExerciseData('inclinedumbbellpress', 'incline-dumbbell-press');
  fetchExerciseData('gepesnyomas', 'machine-press');
  fetchExerciseData('flatarogatas', 'fly-press');

  // Hát Gyakorlatok
  fetchExerciseData('latpull', 'lat-pull');
  fetchExerciseData('rowingmachine', 'rowing-machine');
  fetchExerciseData('singlelatpull', 'single-lat-pull');

  // Bicepsz Gyakorlatok
  fetchExerciseData('onearmcurl', 'one-arm-curl');
  fetchExerciseData('scottcurl', 'scott-curl');

  // Tricepsz Gyakorlatok
  fetchExerciseData('skullcrusher', 'skull-crusher');
  fetchExerciseData('latpulldown', 'lat-pulldown');

  // Váll Gyakorlatok
  fetchExerciseData('machinepress', 'machine-press-shoulder');
  fetchExerciseData('lateralraise', 'lateral-raise');
};

// Funkció a gyakorlatok adatainak lekérésére
function fetchExerciseData(exerciseName, containerId) {
  const dbRef = ref(database, exerciseName);
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const exercises = snapshot.val();
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
recordExercise('latpull', 'latpullsuly', 'lat-pull', 'sendlatpull');
recordExercise('rowingmachine', 'rowingmachineweight', 'rowing-machine', 'sendrowingmachine');
recordExercise('singlelatpull', 'singlelatpullsuly', 'single-lat-pull', 'sendsinglelatpull');
recordExercise('onearmcurl', 'onearmcurlsuly', 'one-arm-curl', 'sendonearmcurl');
recordExercise('scottcurl', 'scottcurlsuly', 'scott-curl', 'sendscottcurl');
recordExercise('skullcrusher', 'skullcurlsuly', 'skull-crusher', 'sendskullcrusher');
recordExercise('latpulldown', 'latpulldownsuly', 'lat-pulldown', 'sendlatpulldown');
recordExercise('machinepress', 'machinepresssuly', 'machine-press-shoulder', 'sendmachinepressshoulder');
recordExercise('lateralraise', 'lateralraisesuly', 'lateral-raise', 'sendlateralraise');
