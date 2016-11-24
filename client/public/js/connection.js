/* eslint no-unused-vars: ["error", { "vars": "local" }] */

const socketServer = 'http://localhost:9000';
const contentServer = 'http://localhost:8080';
const socket = io.connect(socketServer);

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
  let userPatt = new RegExp('[a-zA-Z][a-zA-Z0-9_-]{3,}');
  if (userPatt.test(form['username'].value)) {
    let data = {
      'username': form['username'].value,
    };
    socket.emit('start-game', JSON.stringify(data));
  } else {
    form['username'].focus();
  }
}

socket.on('start-game', (data) => {
  data = JSON.parse(data);
  if (data.response) {
    // can entry
    window.location.replace(`${contentServer}/game`);
  } else {
    // can not
    alert('You can not enter this game');
  }
});
