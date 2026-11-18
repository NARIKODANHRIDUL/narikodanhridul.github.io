class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('2048_best') || '0');
        this.won = false;
        this.over = false;

        this.boardContainer = document.getElementById('boardContainer');
        this.tileContainer = document.getElementById('tileContainer');
        this.scoreEl = document.getElementById('score');
        this.bestScoreEl = document.getElementById('bestScore');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.overlay = document.getElementById('gameOverOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMsg = document.getElementById('overlayMsg');
        this.overlayRestartBtn = document.getElementById('overlayRestartBtn');

        this.bestScoreEl.textContent = this.bestScore;

        this.initEvents();
        this.initTouch();
        this.restart();
    }

    restart() {
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.score = 0;
        this.won = false;
        this.over = false;
        this.updateScore(0);
        this.overlay.style.display = 'none';

        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length === 0) return false;
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
        return true;
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreEl.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreEl.textContent = this.bestScore;
            localStorage.setItem('2048_best', this.bestScore);
        }
    }

    render() {
        this.tileContainer.innerHTML = '';
        const gap = 10;
        const containerWidth = this.tileContainer.clientWidth;
        const tileSize = (containerWidth - (gap * (this.size - 1))) / this.size;

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const val = this.board[r][c];
                if (val > 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${val > 2048 ? 'super' : val}`;
                    tile.style.width = `${tileSize}px`;
                    tile.style.height = `${tileSize}px`;
                    tile.style.top = `${r * (tileSize + gap)}px`;
                    tile.style.left = `${c * (tileSize + gap)}px`;

                    const inner = document.createElement('div');
                    inner.className = 'tile-inner';
                    inner.textContent = val;
                    tile.appendChild(inner);

                    this.tileContainer.appendChild(tile);
                }
            }
        }
    }

    move(direction) {
        if (this.over) return;

        let moved = false;
        let scoreGain = 0;

        // Helper to slide and merge a single row
        const slide = (row) => {
            let arr = row.filter(val => val !== 0);
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    scoreGain += arr[i];
                    if (arr[i] === 2048 && !this.won) {
                        this.won = true;
                        setTimeout(() => this.showWin(), 300);
                    }
                    arr[i + 1] = 0;
                }
            }
            arr = arr.filter(val => val !== 0);
            while (arr.length < this.size) arr.push(0);
            return arr;
        };

        if (direction === 'left') {
            for (let r = 0; r < this.size; r++) {
                const oldRow = [...this.board[r]];
                const newRow = slide(oldRow);
                if (newRow.some((val, idx) => val !== oldRow[idx])) moved = true;
                this.board[r] = newRow;
            }
        } else if (direction === 'right') {
            for (let r = 0; r < this.size; r++) {
                const oldRow = [...this.board[r]].reverse();
                const newRow = slide(oldRow).reverse();
                if (newRow.some((val, idx) => val !== this.board[r][idx])) moved = true;
                this.board[r] = newRow;
            }
        } else if (direction === 'up') {
            for (let c = 0; c < this.size; c++) {
                const oldCol = [this.board[0][c], this.board[1][c], this.board[2][c], this.board[3][c]];
                const newCol = slide(oldCol);
                if (newCol.some((val, idx) => val !== oldCol[idx])) moved = true;
                for (let r = 0; r < this.size; r++) this.board[r][c] = newCol[r];
            }
        } else if (direction === 'down') {
            for (let c = 0; c < this.size; c++) {
                const oldCol = [this.board[3][c], this.board[2][c], this.board[1][c], this.board[0][c]];
                const newCol = slide(oldCol).reverse();
                if (newCol.some((val, idx) => val !== this.board[idx][c])) moved = true;
                for (let r = 0; r < this.size; r++) this.board[r][c] = newCol[r];
            }
        }

        if (moved) {
            this.updateScore(scoreGain);
            this.addRandomTile();
            this.render();

            if (this.checkGameOver()) {
                this.over = true;
                setTimeout(() => this.showGameOver(), 300);
            }
        }
    }

    checkGameOver() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] === 0) return false;
                if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) return false;
                if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) return false;
            }
        }
        return true;
    }

    showGameOver() {
        this.overlayTitle.textContent = 'Game Over!';
        this.overlayMsg.textContent = `Final Score: ${this.score}`;
        this.overlayRestartBtn.textContent = 'Try Again';
        this.overlay.style.display = 'flex';
    }

    showWin() {
        this.overlayTitle.textContent = '2048 Reached!';
        this.overlayMsg.textContent = `You beat the game with ${this.score} points! Keep playing for higher scores.`;
        this.overlayRestartBtn.textContent = 'Keep Playing';
        this.overlay.style.display = 'flex';
        this.overlayRestartBtn.onclick = () => {
            this.overlay.style.display = 'none';
        };
    }

    initEvents() {
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') this.move('left');
            else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') this.move('right');
            else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') this.move('up');
            else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') this.move('down');
        });

        this.newGameBtn.addEventListener('click', () => this.restart());
        this.overlayRestartBtn.addEventListener('click', () => this.restart());

        document.getElementById('btnUp').addEventListener('click', () => this.move('up'));
        document.getElementById('btnDown').addEventListener('click', () => this.move('down'));
        document.getElementById('btnLeft').addEventListener('click', () => this.move('left'));
        document.getElementById('btnRight').addEventListener('click', () => this.move('right'));

        window.addEventListener('resize', () => this.render());
    }

    initTouch() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.boardContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        this.boardContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (Math.max(absDx, absDy) > 25) {
                if (absDx > absDy) {
                    this.move(dx > 0 ? 'right' : 'left');
                } else {
                    this.move(dy > 0 ? 'down' : 'up');
                }
            }
        }, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
