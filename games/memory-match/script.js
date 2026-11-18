document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('cardGrid');
    const moveCountEl = document.getElementById('moveCount');
    const timerEl = document.getElementById('timer');
    const pairCountEl = document.getElementById('pairCount');
    const restartBtn = document.getElementById('restartBtn');
    const winOverlay = document.getElementById('winOverlay');
    const winMessage = document.getElementById('winMessage');
    const finalTimeEl = document.getElementById('finalTime');
    const starRatingEl = document.getElementById('starRating');
    const playAgainBtn = document.getElementById('playAgainBtn');

    // 8 Cyber / Hardware Security Icons
    const ICONS = [
        { icon: '💾', name: 'rom' },
        { icon: '⚡', name: 'glitch' },
        { icon: '🔒', name: 'lock' },
        { icon: '💻', name: 'terminal' },
        { icon: '🛡️', name: 'shield' },
        { icon: '📡', name: 'radio' },
        { icon: '🔑', name: 'key' },
        { icon: '⚙️', name: 'chip' }
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = null;
    let secondsElapsed = 0;
    let gameStarted = false;
    let isProcessing = false;

    function formatTime(secs) {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function startTimer() {
        if (gameStarted) return;
        gameStarted = true;
        secondsElapsed = 0;
        clearInterval(timer);
        timer = setInterval(() => {
            secondsElapsed++;
            timerEl.textContent = formatTime(secondsElapsed);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        gameStarted = false;
    }

    function initGame() {
        stopTimer();
        timerEl.textContent = '00:00';
        secondsElapsed = 0;
        moves = 0;
        matchedPairs = 0;
        flippedCards = [];
        isProcessing = false;
        moveCountEl.textContent = '0';
        pairCountEl.textContent = `0/${ICONS.length}`;
        winOverlay.style.display = 'none';

        // Duplicate and shuffle
        const deck = [...ICONS, ...ICONS];
        deck.sort(() => Math.random() - 0.5);

        cardGrid.innerHTML = '';
        cards = [];

        deck.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.name = item.name;

            card.innerHTML = `
                <div class="card-face card-front">{ }</div>
                <div class="card-face card-back">${item.icon}</div>
            `;

            card.addEventListener('click', () => handleCardClick(card));
            cardGrid.appendChild(card);
            cards.push(card);
        });
    }

    function handleCardClick(card) {
        if (isProcessing) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        startTimer();

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            moveCountEl.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        isProcessing = true;
        const [card1, card2] = flippedCards;

        if (card1.dataset.name === card2.dataset.name) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                flippedCards = [];
                isProcessing = false;
                matchedPairs++;
                pairCountEl.textContent = `${matchedPairs}/${ICONS.length}`;

                if (matchedPairs === ICONS.length) {
                    handleVictory();
                }
            }, 300);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                isProcessing = false;
            }, 800);
        }
    }

    function handleVictory() {
        stopTimer();
        const timeFormatted = formatTime(secondsElapsed);
        finalTimeEl.textContent = timeFormatted;

        let rating = '★★★';
        if (moves > 22) rating = '★☆☆';
        else if (moves > 16) rating = '★★☆';

        starRatingEl.textContent = rating;
        winMessage.textContent = `You matched all 8 hardware sectors in ${moves} moves!`;
        winOverlay.style.display = 'flex';
    }

    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    // Initial setup
    initGame();
});
