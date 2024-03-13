let timerInterval;
        let totalSeconds = 0;
        let inputBuffer = "";

        // Add a new button for reset
        const resetButton = document.getElementById("reset");

        const timerDisplay = document.getElementById("timer");
        const startPauseButton = document.getElementById("startPause");
        const addMinuteButton = document.getElementById("addMinute");
        const body = document.body;
        document.body.classList.remove("red-flash");

        function updateTimer() {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        function handleInput(e) {
    if (e.key === "Backspace") {
        inputBuffer = inputBuffer.slice(0, -1);
    } else {
        inputBuffer += e.key;
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
    }
}
timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        body.classList.add("red-flash");
    }
}, 1000);
        
        // Reset function
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
}


        // Event listener for reset button
        resetButton.addEventListener("click", resetTimer);


        document.addEventListener("keydown", handleInput);

        startPauseButton.addEventListener("click", () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                startPauseButton.textContent = "Resume";
            } else {
                timerInterval = setInterval(() => {
                    if (totalSeconds > 0) {
                        totalSeconds--;
                        updateTimer();
                    } else {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        body.classList.add("red-flash");
                    }
                }, 1000);
                startPauseButton.textContent = "Pause";
            }
        });

        addMinuteButton.addEventListener("click", () => {
            totalSeconds += 60;
            updateTimer();
        });
