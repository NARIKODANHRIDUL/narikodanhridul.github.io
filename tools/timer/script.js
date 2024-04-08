let timerInterval;
let totalSeconds = 0;
let inputBuffer = "";
let timerStarted = false;

const timerDisplay = document.getElementById("timer");
const startPauseButton = document.getElementById("startPause");
const addMinuteButton = document.getElementById("addMinute");
const body = document.body;
var audio = document.getElementById("myAudio");

function playAudio() {
  audio.play();
}

function pauseAudio() {
    audio.pause();
  }

  function addOneminute(){
    totalSeconds += 60;
        updateTimer();
        timerStarted = true;
        pauseAudio();
        body.classList.remove("red-flash");
  }

  function startPause(){
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startPauseButton.textContent = "Resume";
    } else {
        startTimer();
        startPauseButton.textContent = "Pause";
    }
  }
function updateTimer() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
function handleInput(e) {
    if (e.key === "Backspace") {
        inputBuffer = inputBuffer.slice(0, -1);
    } else if (/^\d$/.test(e.key)) { 
        inputBuffer += e.key;
    } else {
        return; 
    }

    while (inputBuffer.length < 6) {
        inputBuffer = "0" + inputBuffer;
    }
    const parsedHours = parseInt(inputBuffer.slice(-6, -4));
    const parsedMinutes = parseInt(inputBuffer.slice(-4, -2));
    const parsedSeconds = parseInt(inputBuffer.slice(-2));
    if (!isNaN(parsedHours) && !isNaN(parsedMinutes) && !isNaN(parsedSeconds)) {
        totalSeconds = parsedHours * 3600 + parsedMinutes * 60 + parsedSeconds;
        updateTimer();
        timerStarted = true;
    }
}


document.addEventListener("keydown", function(event) {
    if(event.key=== " ") { 
        event.preventDefault(); 
        startPause();
    } else if(event.key.toUpperCase() === "A") {
        addOneminute();
    } else if(event.key.toUpperCase() === "R") {
        resetTimer();
    }
});
function startTimer() {
    if (!timerStarted) return;
    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            body.classList.add("red-flash");
            playAudio();
        }
    }, 1000);
}

function resetTimer() {
    totalSeconds = 0;
    inputBuffer = "";
    updateTimer();
    body.classList.remove("red-flash");
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startPauseButton.textContent = "Start";
    }
    pauseAudio();
}

document.addEventListener("keydown", handleInput);
startPauseButton.addEventListener("click", () => {startPause();});
addMinuteButton.addEventListener("click", () => {    addOneminute(); });
document.getElementById("reset").addEventListener("click", resetTimer);

function formatInput() {
    const inputs = document.querySelectorAll('.time-input');
    let hours = 0, minutes = 0, seconds = 0;

    inputs.forEach(input => {
        let value = parseInt(input.value);
        if (isNaN(value)) value = 0;
        else value = Math.min(Math.max(value, 0), 99);

        const id = input.id;
        if (id === 'hours') hours = value;
        else if (id === 'minutes') minutes = value;
        else if (id === 'seconds') seconds = value;

        const formattedValue = value.toString().padStart(2, '0');
        input.value = formattedValue;

    });

    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    updateTimer();
    timerStarted = true;
}
