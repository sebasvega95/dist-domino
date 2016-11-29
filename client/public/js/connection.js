/* eslint no-unused-vars: ["error", { "vars": "local" }] */

const socketServer = 'http://localhost:9000';
const contentServer = 'http://localhost:8080';
const socket = io.connect(socketServer);
let gameMessage = '';

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
  if (localStorage.token) {
    let load = {'token': localStorage.token};
    console.log('Logged in');
    socket.emit('back', JSON.stringify(load));
  } else if (window.location.toString() !== `${contentServer}/`) {
    window.location.replace(`${contentServer}/`);
  }
});

socket.on('back', (data) => {
  data = JSON.parse(data);
  console.log(data);
  if (data.response) {
    if (window.location.toString() !== `${contentServer}/game`)
      window.location.replace(`${contentServer}/game`);
  } else {
    localStorage.removeItem('token');
    if (window.location.toString() !== `${contentServer}/`)
      window.location.replace(`${contentServer}/`);
  }
});

socket.on('start_game', (data) => {
  data = JSON.parse(data);
  console.log(data);
  if (data.response) {
    // can enter
    localStorage.token = data.token;
    window.location.replace(`${contentServer}/game`);
  } else {
    // can't enter
    alert(data.message);
  }
});

socket.on('update_num_players', (data) => {
  data = JSON.parse(data);
  console.log(data);
  gameMessage = data.message;
});
