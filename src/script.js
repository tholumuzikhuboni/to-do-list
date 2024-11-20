// DOM Elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchTask = document.getElementById('searchTask');
const sortTasks = document.getElementById('sortTasks');
const progressBar = document.getElementById('progressBar');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskAction);
searchTask.addEventListener('input', searchTasks);
sortTasks.addEventListener('change', sortTaskList);

function addTask() {
  const taskName = taskInput.value.trim();
  const priority = prioritySelect.value;
  const creationDate = new Date().toISOString();

  if (!taskName) {
    alert('Task cannot be empty!');
    return;
  }

  const task = {
    name: taskName,
    priority: priority,
    creationDate: creationDate,
    completed: false,
  };
  saveTask(task);
  renderTasks();

  taskInput.value = '';
  prioritySelect.value = 'low';
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}

function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';

  // Sort tasks before rendering
  sortTasksAndRender(tasks);

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `list-group-item priority-${task.priority}`;
    li.innerHTML = `
      <div>
        <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
      </div>
      <div class="task-actions">
        <button class="btn btn-success btn-sm complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
}

function handleTaskAction(e) {
  if (e.target.classList.contains('complete-btn')) {
    toggleCompleteTask(e.target);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteTask(e.target);
  }
}

function toggleCompleteTask(button) {
  const li = button.closest('li');
  const taskName = li.querySelector('span').textContent;

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find((task) => task.name === taskName);
  task.completed = !task.completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
}

function deleteTask(button) {
  const li = button.closest('li');
  const taskName = li.querySelector('span').textContent;

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter((task) => task.name !== taskName);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  renderTasks();
}

function searchTasks() {
  const query = searchTask.value.toLowerCase();
  const tasks = document.querySelectorAll('#taskList li');

  tasks.forEach((task) => {
    const taskName = task.querySelector('span').textContent.toLowerCase();
    task.style.display = taskName.includes(query) ? '' : 'none';
  });
}

function sortTaskList() {
  renderTasks();
}

function sortTasksAndRender(tasks) {
  const sortBy = sortTasks.value;

  if (sortBy === 'priority') {
    tasks.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
  } else if (sortBy === 'creationDate') {
    tasks.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
  }
}

function updateProgress() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${Math.round(progress)}%`;
}
