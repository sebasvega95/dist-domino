/* eslint no-unused-vars: ["error", { "vars": "local" }] */

const socketServer = 'http://localhost:9000';
const contentServer = 'http://localhost:8080';
const socket = io.connect(socketServer);
let gameMessage = '';
let playerPieces = [];
let token;
let gameStarted = false;

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
  $('#loginButton').removeAttr('disabled');
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
  window.dominos = [];
  $('#loginButton').prop('disabled', true);
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
    $('#main-container').load('/resources/game.html', () => {
      console.log('yay');
      // $.getScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/p5.min.js', () => {
      //   $.getScript('js/game.js');
      // });
    });
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

function checkBoard(p, dir) {
  if (window.dominos.length === 0) {
    if (p.toString() === '6,6')
      return '';
    return 'disabled';
  }

  let act;
  let comp;
  if (dir === 'head') {
    act = window.dominos[0][0];
    comp = 1;
  } else {
    act = window.dominos[window.dominos.length - 1][1];
    comp = 0;
  }

  if (p[comp] === act)
    return '';

  p.reverse();
  if (p[comp] === act)
    return '';

  p.reverse();
  return 'disabled';
}

function move(p, dir) {
  let data = {
    side: dir,
    pieceSelected: p,
    token: token,
  };

  socket.emit('move', JSON.stringify(data));
}

socket.on('update_game', (data) => {
  data = JSON.parse(data);
  console.log('Update_data:');
  console.log(data);

  window.dominos = data.board;
  playerPieces = data.pieces;
  setTimeout(() => {
    $('#header').html(`It's ${data.turnName}'s turn`);
    $('#pieces-container').empty();
    playerPieces.forEach((p) => {
      let pieceUnicode = unicodeDomino(`${p[0]}${p[1]}`);
      let canHead = checkBoard(p, 'head');
      let canTail = checkBoard(p, 'tail');

      if (token !== data.turnToken)
        canHead = canTail = 'disabled';

      let pieceA = $.parseHTML(`
        <li
          style="font-size: 3.5em;"
          class="collection-item">
          ${pieceUnicode}
          <a class="waves-effect waves-light btn" onclick="move([${p}], 'head')"
            ${canHead} style="font-size: 1em;">
            Head
          </a>
          <a class="waves-effect waves-light btn" onclick="move([${p}], 'tail')"
            ${canTail} style="font-size: 1em;">
            Tail
          </a>
        </li>
      `);
      $('#pieces-container').append(pieceA);
    });
    gameStarted = true;
  }, gameStarted ? 50 : 1000);
});
