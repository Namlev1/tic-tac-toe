const body = document.querySelector('body');
const fields = document.querySelectorAll('.field');
const form = document.querySelector('form');
const newGameBtn = document.querySelector('dialog button');
const dialog = document.querySelector('dialog')
const dialogContent = dialog.children[0]
let character = 'X';

newGameBtn.addEventListener('click', e => {
    dialog.close()
    game.restart();
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let p1Name = form.elements['p1-name'].value;
    let p2Name = form.elements['p2-name'].value;
    console.log(p1Name)
    console.log(p2Name)
    game.namePlayers(p1Name, p2Name)
    form.remove();
    game.start();
})

function disableInput() {
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
        field.style.pointerEvents = 'none';
    });
}

function enableInput() {
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
        field.style.pointerEvents = 'auto';
    });
}

const game = (function () {
    const gameBoard = (function () {
        let board = new Array(3);
        for (let i = 0; i < 3; i++) {
            board[i] = new Array(3).fill('');
        }

        const checkIfWin = (character) => {
            for (let i = 0; i < 3; i++) {
                if (board[i].every(cell => cell === character))
                    return true
                if (board[0][i] === character && board[1][i] === character && board[2][i] === character)
                    return true
            }
            if (board[0][0] === character && board[1][1] === character && board[2][2] === character)
                return true
            if (board[0][2] === character && board[1][1] === character && board[2][0] === character) {
                return true
            }
            return false;
        }

        const put = (character, i, j) => {
            board[i][j] = character;
        }

        const draw = (field, i, j) => {
            field.innerHTML = board[i][j];
        }

        const clear = () => {
            board.forEach(column => column.fill(''))
            const fields = document.querySelectorAll('.field');
            fields.forEach((field) => {
                field.innerHTML = ''
            })
        }

        return {checkIfWin, put, draw, clear}
    })();

    let turnNo = 0;
    let roundNo = 0;

    const player1 = createPlayer();
    const player2 = createPlayer();

    function createPlayer() {
        let name;
        let score = 0;
        const win = () => score++;
        const getScore = () => score;
        const setName = (newName) => {
            name = newName;
        }
        const getName = () => name;
        return {getName, setName, win, getScore};
    }

    function drawWin(winner) {
        const h2 = document.createElement('h2');
        h2.textContent = `${winner.getName()} has won!`;
        body.appendChild(h2);
        const newRoundBtn = createNewRoundBtn()
        newRoundBtn.addEventListener('click', (e) => newRound(e, h2))
        body.appendChild(newRoundBtn);
    }

    function drawDraw() {
        const h2 = document.createElement('h2');
        h2.textContent = 'It\'s a draw';
        body.appendChild(h2);
        const newRoundBtn = createNewRoundBtn()
        newRoundBtn.addEventListener('click', (e) => newRound(e, h2))
        body.appendChild(newRoundBtn);
    }

    function createNewRoundBtn() {
        const btn = document.createElement('button');
        btn.textContent = 'New Round';
        btn.classList.add('start-btn')
        return btn;
    }

    function newRound(e, winText) {
        console.log('new round')
        e.target.remove();
        winText.remove();
        gameBoard.clear();
        enableInput();
        turnNo = 0;
        roundNo++;
    }

    const restart = () => {
        location.reload();
    }

    const namePlayers = (name1, name2) => {
        console.log(name1)
        player1.setName(name1);
        console.log(player1)
        player2.setName(name2);
    }

    const isDraw = () => {
        return turnNo > 8;
    }

    const isGameOver = () => {
        return player1.getScore() >= 3 || player2.getScore() >= 3;
    }

    function start() {
        const mainDiv = document.createElement('div')
        mainDiv.classList.add('main');

        function createSidePanel(player) {
            const sidePanel = document.createElement('div')
            sidePanel.classList.add('side-panel');
            const playerHeader = document.createElement('h2');
            playerHeader.innerText = player.getName();
            sidePanel.appendChild(playerHeader);

            const checkboxDiv = document.createElement('div');
            checkboxDiv.classList.add('win-check-container');
            for (let i = 0; i < 3; i++) {
                const winCheckBox = document.createElement('input')
                winCheckBox.type = 'checkbox';
                winCheckBox.disabled = true;
                winCheckBox.classList.add('win-check');
                checkboxDiv.appendChild(winCheckBox);
            }
            sidePanel.appendChild(checkboxDiv);

            return sidePanel;
        }

        const sideLeft = createSidePanel(player1);
        const sideRight = createSidePanel(player2);

        const gameBoard = document.createElement('div')
        gameBoard.classList.add('gameboard')
        for (let i = 0; i < 9; i++) {
            const field = document.createElement('div');
            field.classList.add('field');
            field.setAttribute('i', String(Math.floor(i / 3)))
            field.setAttribute('j', String(i % 3))
            field.addEventListener("click", fieldEventListener)
            gameBoard.appendChild(field);
        }

        mainDiv.appendChild(sideLeft);
        mainDiv.appendChild(gameBoard);
        mainDiv.appendChild(sideRight);
        body.appendChild(mainDiv)
    }

    function fieldEventListener(e) {
        turnNo++;
        const field = e.target;
        const i = field.getAttribute('i');
        const j = field.getAttribute('j');
        if (field.textContent !== '')
            return
        gameBoard.put(character, i, j);
        gameBoard.draw(field, i, j);
        if (gameBoard.checkIfWin(character)) {
            const winner = character === 'X' ? player1 : player2;
            winner.win();
            refreshPoints();
            if (isGameOver())
                endGame();
            else
                drawWin(winner);
            disableInput();
        }
        if (isDraw()) {
            player1.win();
            player2.win();
            refreshPoints();
            if (isGameOver())
                endGame();
            else
                drawDraw();
            disableInput()
        }
        character = character === 'X' ? 'O' : 'X';
    }

    function refreshPoints() {
        const containers = document.querySelectorAll('.win-check-container');
        if (player1.getScore() > 0)
            containers[0].children[player1.getScore() - 1].checked = true;
        if (player2.getScore() > 0)
            containers[1].children[player2.getScore() - 1].checked = true;
    }

    function endGame(){
        const p1 = dialogContent.children[0]
        const p2 = dialogContent.children[1]
        p1.textContent = 'Game Over!'

        const score1 = player1.getScore();
        const score2 = player2.getScore();
        if (score1 > score2){
            p2.textContent = `${player1.getName()} has won the game.`;
        }
        else if (score1 < score2){
            p2.textContent = `${player2.getName()} has won the game.`;
        }
        else {
            p2.textContent = 'It\'s a draw!';
        }
        dialog.showModal();
    }

    return {namePlayers, start, restart}
})();