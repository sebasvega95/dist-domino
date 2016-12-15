/* eslint no-unused-vars: ["error", { "vars": "local" }] */

/* ----- Constants ----- */
const dominoSize = 30;
const dominoDot = dominoSize * 0.1;
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
const delta = 5;

/* ----- Global variables ----- */
let x;
let limInfX;
let limSupX;
let y;
let limInfY;
let limSupY;
let dir;
let horizontal;

/* ----- Domino drawing -----*/

/**
 * Determines the dots of a domino piece
 * @param {number} n The value of the piece
 * @param {number} x The horizontal position of the piece
 * @param {number} y The vertical position of the piece
 * @return {object} The dots to draw for the piece
 */
function dotsOfPiece(n, x, y) {
  const topLeft = {x: x + dominoSize / 5, y: y + dominoSize / 3};
  const topCenter = {x: x + dominoSize / 2, y: y + dominoSize / 3};
  const topRight = {x: x + 4 * dominoSize / 5, y: y + dominoSize / 3};
  const middle = {x: x + dominoSize / 2, y: y + dominoSize / 2};
  const bottomLeft = {x: x + dominoSize / 5, y: y + 2 * dominoSize / 3};
  const bottomCenter = {x: x + dominoSize / 2, y: y + 2 * dominoSize / 3};
  const bottomRight = {x: x + 4 * dominoSize / 5, y: y + 2 * dominoSize / 3};
  let dots;

  switch (n) {
    case 0:
      dots = [];
      break;
    case 1:
      dots = [middle];
      break;
    case 2:
      dots = [topLeft, bottomRight];
      break;
    case 3:
      dots = [topLeft, middle, bottomRight];
      break;
    case 4:
      dots = [topLeft, topRight, bottomLeft, bottomRight];
      break;
    case 5:
      dots = [topLeft, topRight, middle, bottomLeft, bottomRight];
      break;
    case 6:
      dots = [
        topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight,
      ];
      break;
  }
  return dots;
}

/**
 * Draws a domino piece
 * @param {array} domino The domino piece's values
 * @param {number} x The horizontal position of the piece
 * @param {number} y The vertical position of the piece
 * @param {bool} horizontal Whether the piece is in horizontal position or not
 */
function drawDomino(domino, x, y, horizontal = true) {
  let x1;
  let y1;
  let x2;
  let y2;

  if (horizontal) {
    x1 = x;
    x2 = x + dominoSize;
    y1 = y2 = y;
  } else {
    x1 = x2 = x;
    y1 = y;
    y2 = y + dominoSize;
  }

  fill(236, 232, 196);
  rect(x1, y1, dominoSize, dominoSize);
  rect(x2, y2, dominoSize, dominoSize);

  let first = dotsOfPiece(domino[0], x1, y1);
  let second = dotsOfPiece(domino[1], x2, y2);

  fill(0);
  first.forEach((dots) => {
    ellipse(dots.x, dots.y, dominoDot);
  });
  second.forEach((dots) => {
    ellipse(dots.x, dots.y, dominoDot);
  });
}

/* ----- P5 stuff ----- */

/**
 * Sets up the p5 environment
 */
function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('canvas-container');
}

/**
 * Draws using p5
 */
function draw() {
  x = 10;
  limInfX = x;
  limSupX = width;
  y = 10;
  limInfY = 2 * y + dominoSize;
  limSupY = height;
  dir = 0;
  horizontal = true;
  let dominos = window.dominos;

  clear();
  if (dominos && dominos instanceof Array) {
    dominos.forEach((piece) => {
      horizontal = dir == 0 || dir == 2;

      drawDomino(piece, x, y, horizontal);
      x += dx[dir] * (2 * dominoSize + delta);
      y += dy[dir] * (2 * dominoSize + delta);

      switch (dir) {
        case 0:
        if (x + 2 * dominoSize >= limSupX) {
          x -= dominoSize + delta;
          limSupX = x + dominoSize / 2;
          y += dominoSize + delta;
          dir++;
        }
        break;
        case 1:
        if (y + 2 * dominoSize >= limSupY) {
          y -= dominoSize + delta;
          limSupY = y + dominoSize / 2;
          x -= 2 * dominoSize + delta;
          dir++;
        }
        break;
        case 2:
        if (x <= limInfX) {
          x += 2 * dominoSize + delta;
          limInfX = x + dominoSize / 2;
          y -= 2 * dominoSize + delta;
          dir++;
        }
        break;
        case 3:
        if (y <= limInfY) {
          y += 2 * dominoSize + delta;
          limInfY = y + dominoSize / 2;
          x += dominoSize + delta;
          dir++;
        }
        break;
      }

      dir %= 4;
    });
  }
}
