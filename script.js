const body = document.querySelector('body');
const fields = document.querySelectorAll('.field');
const form = document.querySelector('form');
let character = 'X';

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

function drawWin(character) {
    const h2 = document.createElement('h2');
    h2.textContent = `${character} has won!`;
    body.appendChild(h2);
}

function drawDraw() {
    const h2 = document.createElement('h2');
    h2.textContent = 'It\'s a draw';
    body.appendChild(h2);
}

function disableInput() {
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
        field.style.pointerEvents = 'none';
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
            console.log(`Putting ${character} into ${i} ${j}`)
            board[i][j] = character;
        }

        const draw = (field, i, j) => {
            field.innerHTML = board[i][j];
        }

        return {checkIfWin, put, draw}
    })();

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

    const namePlayers = (name1, name2) => {
        console.log(name1)
        player1.setName(name1);
        console.log(player1)
        player2.setName(name2);
    }

    const isDraw = () => {
        return roundNo === 9;
    }

    function start() {
        const mainDiv = document.createElement('div')
        mainDiv.classList.add('main');
        console.log(player1)
        console.log(player2)

        function createSidePanel(player) {
            const sidePanel = document.createElement('div')
            sidePanel.classList.add('side-panel');
            const playerHeader = document.createElement('h2');
            playerHeader.innerText = player.getName();
            sidePanel.appendChild(playerHeader);
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
        const field = e.target;
        const i = field.getAttribute('i');
        const j = field.getAttribute('j');
        roundNo++;
        if (field.textContent !== '')
            return
        gameBoard.put(character, i, j);
        gameBoard.draw(field, i, j);
        if (gameBoard.checkIfWin(character)) {
            drawWin(character);
            disableInput();
        }
        if (isDraw()) {
            drawDraw();
            disableInput()
        }
        character = character === 'X' ? 'O' : 'X';
    }

    return {namePlayers, start}
})();