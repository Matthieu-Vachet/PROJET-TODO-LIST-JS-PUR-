// Sélection des éléments
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const errorMsg = document.getElementById('errorMsg');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAllBtn = document.getElementById('clearAllBtn');

// État de l'app
let tasks = [];
let currentFilter = 'all';

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();
  attachEventListeners();
});

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
  // Ajouter une tâche avec le bouton
  addBtn.addEventListener('click', addTask);
  
  // Ajouter une tâche avec ENTER
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // Focus automatique
  taskInput.focus();

  // Filtres
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Tout supprimer
  clearAllBtn.addEventListener('click', () => {
    if (tasks.length > 0 && confirm('Es-tu sûr ? 🤔')) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });
}

// ============================================
// MAIN FUNCTIONS
// ============================================

function addTask() {
  const text = taskInput.value.trim();

  // Validation
  if (text === '') {
    showError('La tâche ne peut pas être vide ! 🚫');
    taskInput.classList.add('error-shake');
    setTimeout(() => taskInput.classList.remove('error-shake'), 300);
    return;
  }

  // Créer la tâche
  const task = {
    id: Date.now(),
    text: text,
    done: false,
    createdAt: new Date().toLocaleDateString('fr-FR')
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
  clearError();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  taskList.innerHTML = '';

  // Filtrer les tâches
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.done);
  } else if (currentFilter === 'done') {
    filteredTasks = tasks.filter(t => t.done);
  }

  // Afficher les tâches
  if (filteredTasks.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filteredTasks.forEach(task => {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });
  }

  updateCounter();
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item glass rounded-lg p-4 flex items-center gap-3 list-item ${task.done ? 'task-done' : ''}`;
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.className = 'w-5 h-5 accent-cyan-400 cursor-pointer';
  checkbox.addEventListener('change', () => toggleTask(task.id));

  // Texte de la tâche
  const span = document.createElement('span');
  span.className = 'task-text flex-1 text-white text-sm md:text-base cursor-pointer';
  span.textContent = task.text;
  span.addEventListener('click', () => toggleTask(task.id));

  // Bouton supprimer
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'text-red-400/60 hover:text-red-400 transition-colors duration-200 flex-shrink-0';
  deleteBtn.innerHTML = '❌';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

function updateCounter() {
  const activeTasks = tasks.filter(t => !t.done).length;
  const total = tasks.length;
  
  if (activeTasks === 0) {
    taskCount.textContent = total === 0 ? '0 tâche' : 'Toutes terminées ! ✅';
  } else if (activeTasks === 1) {
    taskCount.textContent = `1 tâche restante`;
  } else {
    taskCount.textContent = `${activeTasks} tâches restantes`;
  }
}

// ============================================
// ERROR HANDLING
// ============================================

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.opacity = '1';
}

function clearError() {
  errorMsg.style.opacity = '0';
}

// ============================================
// STORAGE (localStorage)
// ============================================

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}
