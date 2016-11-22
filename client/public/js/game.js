/* eslint no-unused-vars: ["error", { "vars": "local" }] */

/* ----- Constants ----- */
const dominoSize = 45;
const dominoDot = dominoSize * 0.1;

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
 */
function drawDomino(domino, x, y = height/2) {
  rect(x, y, dominoSize, dominoSize);
  rect(x + dominoSize, y, dominoSize, dominoSize);

  let first = dotsOfPiece(domino[0], x, y);
  let second = dotsOfPiece(domino[1], x + dominoSize, y);

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
  createCanvas(600, 400);
}

/**
 * Draws using p5
 */
function draw() {
  const dominos = [[1, 2], [3, 4], [5, 6]];
  const delta = 5;

  clear();
  let x = 10;
  dominos.forEach((piece) => {
    drawDomino(piece, x);
    x += 2 * dominoSize + delta;
  });
}
