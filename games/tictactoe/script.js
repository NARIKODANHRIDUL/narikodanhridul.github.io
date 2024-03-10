let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let resultDisplay = document.getElementById('result');
let lastMoveIndex = null;

function makeMove(index) {
    if (board[index] === '') {
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;
        lastMoveIndex = index;
        if (checkWin()) {
            resultDisplay.innerText = currentPlayer + ' wins!';
        } else if (board.every(cell => cell !== '')) {
            resultDisplay.innerText = 'It\'s a draw!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            resultDisplay.innerText = '';
        }
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (board[condition[0]] !== '' && board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]]) {
            return true;
        }
    }

    return false;
}

function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = '';
    }
    resultDisplay.innerText = '';
    lastMoveIndex = null;
}

function undoMove() {
    if (lastMoveIndex !== null) {
        board[lastMoveIndex] = '';
        document.getElementsByClassName('cell')[lastMoveIndex].innerText = '';
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        resultDisplay.innerText = '';
        lastMoveIndex = null;
    }
}
