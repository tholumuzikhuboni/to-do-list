// DOM Elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchTask = document.getElementById('searchTask');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const sortPriorityBtn = document.getElementById('sortPriorityBtn');
const sortCreationBtn = document.getElementById('sortCreationBtn');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  updateProgress();
});

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskAction);
searchTask.addEventListener('input', searchTasks);
sortPriorityBtn.addEventListener('click', sortTasksByPriority);
sortCreationBtn.addEventListener('click', sortTasksByCreationDate);

function addTask() {
  const taskName = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (!taskName) {
    showAlert('Task cannot be empty!', 'danger');
    return;
  }

  const task = {
    name: taskName,
    priority: priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  saveTask(task);
  renderTask(task);
  updateProgress();

  taskInput.value = '';
  prioritySelect.value = 'low';
  showAlert('Task added successfully!', 'success');
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(renderTask);
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = `list-group-item priority-${task.priority}`;
  li.dataset.createdAt = task.createdAt;
  li.innerHTML = `
    <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
    <div class="task-actions">
      <button class="btn btn-success btn-sm complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
      <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    </div>
  `;
  taskList.appendChild(li);
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

  li.querySelector('span').classList.toggle('completed');
  button.textContent = task.completed ? 'Undo' : 'Complete';

  updateProgress();
}

function deleteTask(button) {
  const li = button.closest('li');
  const taskName = li.querySelector('span').textContent;

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter((task) => task.name !== taskName);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  li.remove();
  updateProgress();
  showAlert('Task deleted successfully!', 'info');
}

function searchTasks() {
  const query = searchTask.value.toLowerCase();
  const tasks = document.querySelectorAll('#taskList li');

  tasks.forEach((task) => {
    const taskName = task.querySelector('span').textContent.toLowerCase();
    task.style.display = taskName.includes(query) ? '' : 'none';
  });
}

function sortTasksByPriority() {
  const tasks = Array.from(document.querySelectorAll('#taskList li'));

  tasks.sort((a, b) => {
    const priorities = { low: 1, medium: 2, high: 3 };
    return priorities[b.classList[1].split('-')[1]] - priorities[a.classList[1].split('-')[1]];
  });

  tasks.forEach((task) => taskList.appendChild(task));
}

function sortTasksByCreationDate() {
  const tasks = Array.from(document.querySelectorAll('#taskList li'));

  tasks.sort((a, b) => new Date(a.dataset.createdAt) - new Date(b.dataset.createdAt));

  tasks.forEach((task) => taskList.appendChild(task));
}

function updateProgress() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', progress);
  progressLabel.textContent = `Progress: ${progress}%`;
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} mt-3`;
  alertDiv.textContent = message;

  const container = document.querySelector('.container');
  container.prepend(alertDiv);

  setTimeout(() => alertDiv.remove(), 3000);
  }
