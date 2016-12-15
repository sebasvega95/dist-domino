/* eslint no-unused-vars: ["error", { "vars": "local" }] */

const socketServer = 'http://localhost:9000';
const contentServer = 'http://localhost:8080';
const socket = io.connect(socketServer);
let gameMessage = '';
let playerPieces = [];
let token;

/**
 * Adds two numbers together.
 * @param {object} evt The event of submit
 * @return {boolean} return false to prevent form submit
 */
function preventSubmit(evt) {
  console.log(evt);
  evt.preventDefault();
  return false;
}

/**
 * Emit start-game before a player can enter the game
 */
function startGame() {
  let form = document.getElementById('startForm');
  let userPatt = /[a-zA-Z][a-zA-Z0-9_-]{3,}/;
  if (userPatt.test(form['username'].value)) {
    let data = {'username': form['username'].value};
    console.log(data);
    socket.emit('start_game', JSON.stringify(data));
  } else {
    form['username'].focus();
  }
}

socket.on('connect', () => {
  console.log('Connected');
  // if (localStorage.token) {
  //   let load = {'token': localStorage.token};
  //   console.log('Logged in');
  //   socket.emit('back', JSON.stringify(load));
  // } else if (window.location.toString() !== `${contentServer}/`) {
  //   window.location.replace(`${contentServer}/`);
  // }
});

socket.on('disconnect', () => {
  console.log('Disconnected');
  $('#main-container').empty();
  $('#main-container').load('/resources/login.html');
});

// socket.on('back', (data) => {
//   data = JSON.parse(data);
//   console.log(data);
//   if (data.response) {
//     if (window.location.toString() !== `${contentServer}/game`)
//       window.location.replace(`${contentServer}/game`);
//   } else {
//     localStorage.removeItem('token');
//     if (window.location.toString() !== `${contentServer}/`)
//       window.location.replace(`${contentServer}/`);
//   }
// });

socket.on('start_game', (data) => {
  data = JSON.parse(data);
  console.log(data);
  if (data.response) {
    // can enter
    token = data.token;
    $('#main-container').empty();
    $('#main-container').load('/resources/game.html');
    // localStorage.token = data.token;
    // window.location.replace(`${contentServer}/game`);
  } else {
    // can't enter
    alert(data.message);
  }
});


/**
 * Generate de unicode of domino piece.
 * @param {integer} num Num of domino piece
 * @return {string} return the unicode
 */
function unicodeDomino(num) {
  num = parseInt(num, 7);
  let code = 0x1F031 + num;
  return `&#x${code.toString(16)};`;
}

socket.on('update_game', (data) => {
  data = JSON.parse(data);
  console.log('Update_data:');
  console.log(data);

  dominos = data.board;
  playerPieces = data.pieces;

  $('#header').html(`It's ${data.turnName}'s turn`);
  $('#pieces-container').empty();
  playerPieces.forEach((p) => {
    let pieceUnicode = unicodeDomino(`${p[0]}${p[1]}`);
    let pieceA = $.parseHTML(`
      <li style="font-size: 5em;" class="collection-item">${pieceUnicode}</li>
    `);
    $('#pieces-container').append(pieceA);
  });
});
