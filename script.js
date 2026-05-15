let submitButton = document.getElementById("addBtn");
let inputUser = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");

let tachesUser = []; // Tableau pour stocker les tâches


function resetInput() {
  inputUser.value = "";
  inputUser.focus();
}

function chargerTaches() {
  const donnees = localStorage.getItem("taches");
  if (donnees) {
    tachesUser = JSON.parse(donnees);
    afficherTaches();
  }
}

function sauvegarderTaches() {
  localStorage.setItem("taches", JSON.stringify(tachesUser));
}

function afficherTaches() {
  taskList.textContent = "";
  tachesUser.forEach((task) => {
    let li = document.createElement("li");
    li.textContent = task;
    li.classList.add("text-white", "text-lg", "mb-2");
    taskList.appendChild(li);
  });
}
submitButton.addEventListener("click", function () {
  const task = inputUser.value.trim();
  if (task !== "") {
    tachesUser.push(task);
    sauvegarderTaches();
    afficherTaches();
    resetInput();
  }
});

chargerTaches()
