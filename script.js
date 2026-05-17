let submitButton = document.getElementById("addBtn");
let clearAllBtn = document.getElementById("clearAllBtn");
let inputUser = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");
let taskCount = document.getElementById("taskCount");
let errorMsg = document.getElementById("errorMsg");
let emptyState = document.getElementById("emptyState");
let filterBtn = document.querySelectorAll(".filter-btn");

let actifUserTaches = []; // Tableau pour stocker les tâches
let inactifUserTaches = []; // Tableau pour stocker les tâches inactives (si besoin)

let currentFilter = "all";
// Charger les tâches dès le démarrage
chargerTaches();

function taskCounter() {
  const active = actifUserTaches.filter(t => !t.done).length;
  const total = actifUserTaches.length;

  taskCount.textContent = `${active} / ${total} tâches`;
}

function resetInput() {
  inputUser.value = "";
  inputUser.focus();
}

function chargerTaches() {
  const donnees = localStorage.getItem("taches");
  const donneesInactives = localStorage.getItem("tachesInactives");

  if (donnees || donneesInactives) {
    actifUserTaches = JSON.parse(donnees);
    inactifUserTaches = JSON.parse(donneesInactives);
    taskCounter();
    afficherTaches();
  }
}

function sauvegarderTaches() {
  localStorage.setItem("taches", JSON.stringify(actifUserTaches));
  localStorage.setItem("tachesInactives", JSON.stringify(inactifUserTaches));
}

function supprimerTaches() {
  if (actifUserTaches.length === 0) {
    consoleMsg("erreur : il n'y a aucune tâche à supprimer");
  } else {
    actifUserTaches = [];
  }
}

function afficherEmptyState() {
  if (actifUserTaches.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }
}

function consoleMsg(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("show");
  setTimeout(() => {
    errorMsg.classList.remove("show");
  }, 3000);
}

clearAllBtn.addEventListener("click", function () {
  supprimerTaches();
  sauvegarderTaches();
  afficherTaches();
  taskCounter();
  resetInput();
});

function afficherTaches() {
  taskList.textContent = "";

  let tachesFiltrees = actifUserTaches.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  tachesFiltrees.forEach((task) => {
    let li = document.createElement("li");
    li.textContent = task.text;

    let checker = document.createElement("input");
    checker.type = "checkbox";
    checker.checked = task.done;

    li.prepend(checker);
    taskList.appendChild(li);
  });

  afficherEmptyState();
}

submitButton.addEventListener("click", function () {
  const task = inputUser.value.trim();
  if (task !== "") {
    actifUserTaches.push({
      text: task,
      done: false,
    });
    sauvegarderTaches();
    afficherTaches();
    taskCounter();
    resetInput();
  } else {
    consoleMsg("Veuillez entrer une tâche valide.");
  }
});

taskList.addEventListener("click", function (event) {
  if (event.target.type === "checkbox") {
    const li = event.target.closest("li");
    const index = Array.from(taskList.children).indexOf(li);

    actifUserTaches[index].done = event.target.checked;

    sauvegarderTaches();
    afficherTaches();
    taskCounter();
  }
});

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;

    // gestion du bouton actif (visuel)
    filterBtn.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    afficherTaches();
  });
});

console.log(taskCounter);
console.log(localStorage.taches);
console.log(localStorage.taches.length);
console.log(actifUserTaches);