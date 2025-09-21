const headerText="NeuroStudy Dashboard";
const headerTitle=document.getElementById("header-title");
let index=0;
const typingSound=new Audio("typing.mp3"); 
function typeHeader(){
  if(index<headerText.length){
    headerTitle.textContent+=headerText[index];
    if(typingSound){ typingSound.currentTime=0; typingSound.play().catch(e=>{}); }
    index++; setTimeout(typeHeader,120);
  }
}
window.addEventListener('DOMContentLoaded',typeHeader);

const taskForm=document.getElementById('task-form');
const taskInput=document.getElementById('task-input');
const taskList=document.getElementById('task-list');
const prioritySelect=document.getElementById('priority');
let tasks=JSON.parse(localStorage.getItem('tasks'))||[];
function saveTasks(){localStorage.setItem('tasks',JSON.stringify(tasks));}
function renderTasks(){
  taskList.innerHTML='';
  tasks.forEach((task,index)=>{
    const li=document.createElement('li');
    li.textContent=task.text;
    li.classList.add(task.priority);
    li.setAttribute('draggable',true);
    li.dataset.index=index;
    const removeBtn=document.createElement('button'); removeBtn.textContent='Remove';
    removeBtn.addEventListener('click',()=>{tasks.splice(index,1); saveTasks(); renderTasks();});
    li.appendChild(removeBtn); taskList.appendChild(li);
  });
}
taskList.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',e.target.dataset.index));
taskList.addEventListener('dragover',e=>e.preventDefault());
taskList.addEventListener('drop',e=>{
  e.preventDefault();
  const draggedIndex=e.dataTransfer.getData('text/plain');
  const targetIndex=e.target.dataset.index;
  if(draggedIndex===targetIndex) return;
  const draggedTask=tasks[draggedIndex];
  tasks.splice(draggedIndex,1);
  tasks.splice(targetIndex,0,draggedTask);
  saveTasks(); renderTasks();
});
taskForm.addEventListener('submit',e=>{
  e.preventDefault();
  const text=taskInput.value.trim();
  if(!text) return;
  tasks.push({text,priority:prioritySelect.value});
  saveTasks(); renderTasks();
  taskInput.value='';
});
renderTasks();

/* ---------- Study Notes ---------- */
const readNotesBtn=document.getElementById('read-notes');
const studyNotes=document.getElementById('study-notes');
readNotesBtn.addEventListener('click',()=>{
  const text=studyNotes.value.trim();
  if(!text) return;
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.rate=1;
  speechSynthesis.speak(utterance);
});

const toggleFocusBtn=document.getElementById('toggle-focus');
const fontSizeInput=document.getElementById('font-size');
const contrastSelect=document.getElementById('contrast');
if(localStorage.getItem('darkMode')==='true') document.body.classList.add('focus-mode');
toggleFocusBtn.addEventListener('click',()=>{
  document.body.classList.toggle('focus-mode');
  localStorage.setItem('darkMode',document.body.classList.contains('focus-mode'));
});

// Font size
fontSizeInput.value=localStorage.getItem('fontSize')||18;
document.body.style.fontSize=fontSizeInput.value+'px';
fontSizeInput.addEventListener('input',()=>{
  document.body.style.fontSize=fontSizeInput.value+'px';
  localStorage.setItem('fontSize',fontSizeInput.value);
});

// Contrast
contrastSelect = document.getElementById('contrast');

// Apply contrast mode based on saved preference
if(localStorage.getItem('contrast') === 'light'){
  document.body.classList.add('light-contrast');
} else {
  document.body.classList.remove('light-contrast');
}

// Change background contrast dynamically
contrastSelect.addEventListener('change', () => {
  if(contrastSelect.value === 'light'){
    document.body.classList.add('light-contrast');
  } else {
    document.body.classList.remove('light-contrast');
  }

  localStorage.setItem('contrast', contrastSelect.value);
});


/* ---------- Timer ---------- */
let timerInterval;
let timerSeconds=25*60;
const timerDisplay=document.getElementById('timer-display');
const startBtn=document.getElementById('start-timer');
const resetBtn=document.getElementById('reset-timer');
const alarmSound=new Audio("alarm.mp3");

function updateTimer(){
  const minutes=Math.floor(timerSeconds/60);
  const seconds=timerSeconds%60;
  timerDisplay.textContent=`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}
startBtn.addEventListener('click',()=>{
  if(timerInterval) return;
  timerInterval=setInterval(()=>{
    if(timerSeconds<=0){
      clearInterval(timerInterval); timerInterval=null; alarmSound.play().catch(e=>{}); alert("Time's up! Take a break!"); timerSeconds=25*60; updateTimer();
    } else { timerSeconds--; updateTimer(); }
  },1000);
});
resetBtn.addEventListener('click',()=>{
  clearInterval(timerInterval); timerInterval=null; timerSeconds=25*60; updateTimer();
});
updateTimer();