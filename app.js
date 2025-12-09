import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzxgiVwirLRqNnLhyhIjPBijLv9kRDI-I",
  authDomain: "esp32-a9f92.firebaseapp.com",
  databaseURL: "https://esp32-a9f92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "esp32-a9f92",
  storageBucket: "esp32-a9f92.appspot.com",
  messagingSenderId: "917386871044",
  appId: "1:917386871044:web:872db9ffa05fb85e7d5051"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Elementos del DOM
const loginDiv = document.getElementById("loginDiv");
const dataDiv = document.getElementById("dataDiv");
const loginError = document.getElementById("loginError");

// LOGIN
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .catch(err => loginError.textContent = "Error: " + err.message);
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth);
});

// Estado de usuario
onAuthStateChanged(auth, user => {
  if (user) {
    loginDiv.style.display = "none";
    dataDiv.style.display = "block";

    const sensoresRef = ref(db, "sensores");
    onValue(sensoresRef, snap => {
      const d = snap.val();
      if (!d) return;

      document.getElementById("temp").textContent = d.temp;
      document.getElementById("tds").textContent = d.tds;
      document.getElementById("ph").textContent = d.ph;
      document.getElementById("ec").textContent = d.ec;
    });

  } else {
    loginDiv.style.display = "block";
    dataDiv.style.display = "none";
  }
});

// --- BOTONES ENCENDER / APAGAR FOCO ---
document.getElementById("btnOn").addEventListener("click", () => {
  fetch("/on")
    .then(() => console.log("Foco encendido"));
});

document.getElementById("btnOff").addEventListener("click", () => {
  fetch("/off")
    .then(() => console.log("Foco apagado"));
});

