const fields = document.querySelectorAll('.field');

function createPlayer(name) {
    let score = 0;
    const win = () => score++;
    const getScore = () => score;
    return {name, win, getScore};
}

const game = (function () {
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

    const draw = () => {
        fields[0].innerHTML = board[0][0];
        fields[1].innerHTML = board[0][1];
        fields[2].innerHTML = board[0][2];
        fields[3].innerHTML = board[1][0];
        fields[4].innerHTML = board[1][1];
        fields[5].innerHTML = board[1][2];
        fields[6].innerHTML = board[2][0];
        fields[7].innerHTML = board[2][1];
        fields[8].innerHTML = board[2][2];
    }

    return {checkIfWin, put, draw}
})();


function getUserInput() {
    let field = prompt('Select a field')
    field = field.split(' ')
    return {
        i: field[0],
        j: field[1]
    }
}

let character = 'X';
do {
    character = character === 'X' ? 'O' : 'X';
    game.draw()
    let {i, j} = getUserInput();
    console.log(i + ' ' + j)
    game.put(character, i, j)

} while (!game.checkIfWin(character));
console.log(`Player ${character} won or a draw`)