const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startStopBtn = document.getElementById('startStop');
const study25Btn = document.getElementById('study25');
const study60Btn = document.getElementById('study60');
const revisionBtn = document.getElementById('revision');
const breakSection = document.querySelector('.break-section');
const notesEl = document.getElementById('notes');
const saveNotesBtn = document.getElementById('save-notes');
const readNotesBtn = document.getElementById('read-notes');
const fontSlider = document.getElementById('font-size');
const fontValue = document.getElementById('font-value');
const contrastSelect = document.getElementById('contrast');
const alarmSound = document.getElementById('alarm-sound');

let studyTime = 25;
let revisionTime = 5;
let timer;
let isRunning = false;

// Timer 
function updateDisplay(min, sec) {
  minutesEl.textContent = min.toString().padStart(2,'0');
  secondsEl.textContent = sec.toString().padStart(2,'0');
}

function playAlarm() {
  alarmSound.currentTime = 0;
  alarmSound.play();
  minutesEl.parentElement.classList.add('timer-finish');
  setTimeout(() => minutesEl.parentElement.classList.remove('timer-finish'), 5000);
}

function startTimer(duration, callback) {
  let time = duration * 60;
  timer = setInterval(() => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    updateDisplay(min, sec);
    time--;
    if(time < 0) {
      clearInterval(timer);
      playAlarm();
      callback();
    }
  }, 1000);
}

// Timer
startStopBtn.addEventListener('click', () => {
  if(isRunning) {
    clearInterval(timer);
    isRunning = false;
    startStopBtn.textContent = 'Start';
  } else {
    startTimer(studyTime, startBreak);
    isRunning = true;
    startStopBtn.textContent = 'Stop';
  }
});

study25Btn.addEventListener('click', () => studyTime = 25);
study60Btn.addEventListener('click', () => studyTime = 60);
revisionBtn.addEventListener('click', () => {
  studyTime = revisionTime;
  breakSection.classList.add('hidden');
  startTimer(studyTime, () => {});
});

// Break
function startBreak() {
  breakSection.classList.remove('hidden');
  startTimer(5, () => {
    breakSection.classList.add('hidden');
  });
}

// Notes
window.addEventListener('load', () => {
  if(localStorage.getItem('studyNotes')) {
    notesEl.value = localStorage.getItem('studyNotes');
  }
});

saveNotesBtn.addEventListener('click', () => {
  localStorage.setItem('studyNotes', notesEl.value);
  alert('Notes saved successfully!');
});

readNotesBtn.addEventListener('click', () => {
  const text = notesEl.value.trim();
  if (!text) return alert('Please write some notes first.');
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
});

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTaskToDOM(task));

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const task = {
    text: taskInput.value,
    priority: prioritySelect.value,
    id: Date.now()
  };
  tasks.push(task);
  addTaskToDOM(task);
  saveTasks();
  taskForm.reset();
});

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.classList.add(task.priority);
  li.setAttribute('data-id', task.id);
  li.innerHTML = `
    <span>${task.text}</span>
    <button class="delete-btn">✕</button>
  `;
  taskList.appendChild(li);

  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
