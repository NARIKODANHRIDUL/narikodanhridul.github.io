let timer;
let timeLeft;
let isRunning = false;
let flashingInterval;

const timerDisplay = document.querySelector('.timer');
const controlBtn = document.getElementById('controlBtn');
const addMinuteBtn = document.getElementById('addMinuteBtn');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');

controlBtn.addEventListener('click', toggleTimer);
addMinuteBtn.addEventListener('click', addMinute);

function toggleTimer() {
  if (!isRunning) {

    startTimer();
  } else {
    pauseResumeTimer();
  }
}

function startTimer() {
  if (!hoursInput.value && !minutesInput.value && !secondsInput.value) return;
  isRunning = true;
  timeLeft = (parseInt(hoursInput.value) * 3600 || 0) + (parseInt(minutesInput.value) * 60 || 0) + (parseInt(secondsInput.value) || 0);
  clearInputs();
  controlBtn.textContent = 'Pause';
  clearInterval(flashingInterval);
  flashingInterval = null;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    timer=null; 
    document.body.style.backgroundColor = 'red';
    flashingInterval = setInterval(flashBackground, 500);
    return;
  }

  let hours = Math.floor(timeLeft / 3600);
  let minutes = Math.floor((timeLeft % 3600) / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  timeLeft--;
}

function pauseResumeTimer() {
    if (!isRunning) {
        controlBtn.textContent = 'Pause';
        isRunning = true;
        // Calculate remaining time based on displayed time
        let [hoursStr, minutesStr, secondsStr] = timerDisplay.textContent.split(':');
        timeLeft = (parseInt(hoursStr.value) * 3600 || 0) + (parseInt(minutesStr.value) * 60 || 0) + (parseInt(secondsStr.value) || 0);
        timer = setInterval(updateTimer, 1000);
    } else {
        clearInterval(timer);
        isRunning = false;
        controlBtn.textContent = 'Resume';    
    }
  }
  

function addMinute() {
  if (!isRunning) {
    minutesInput.value = parseInt(minutesInput.value) + 1;
  } else {
    timeLeft += 60;
  }
}

function flashBackground() {
  document.body.style.backgroundColor = document.body.style.backgroundColor === 'red' ? '#f0f0f0' : 'red';
}

function clearInputs() {
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
}

// Monitor input fields for changes
hoursInput.addEventListener('input', updateControlBtn);
minutesInput.addEventListener('input', updateControlBtn);
secondsInput.addEventListener('input', updateControlBtn);

function updateControlBtn() {
  if (isRunning && (hoursInput.value || minutesInput.value || secondsInput.value)) {
    controlBtn.textContent = 'Pause';
  } else if (!isRunning && (hoursInput.value || minutesInput.value || secondsInput.value)) {
    controlBtn.textContent = 'Start';
  } else if (!isRunning && !(hoursInput.value || minutesInput.value || secondsInput.value)) {
    controlBtn.textContent = 'Start';
  } else if (isRunning && !(hoursInput.value || minutesInput.value || secondsInput.value)) {
    controlBtn.textContent = 'Resume';
  }
}
