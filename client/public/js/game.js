/* eslint no-unused-vars: ["error", { "vars": "local" }] */

/* ----- Constants ----- */
const dominoSize = 30;
const dominoDot = dominoSize * 0.1;
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

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
  canvas.parent('main-container');
  const dominos = [
    [0, 0],
    [0, 1], [1, 1],
    [0, 2], [1, 2], [2, 2],
    [0, 3], [1, 3], [2, 3], [3, 3],
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];
  const delta = 5;

  clear();
  let x = 10;
  let limInfX = x;
  let limSupX = width;
  let y = 10;
  let limInfY = 2 * y + dominoSize;
  let limSupY = height;
  let dir = 0;
  let horizontal;

  dominos.forEach((piece) => {
    horizontal = dir == 0 || dir == 2;

    // if (piece[0] == piece[1]) {
    //   let drawDir = dir;
    //   switch (dir) {
    //     case 0: case 1:
    //       drawDir += 2;
    //       break;
    //     case 2:
    //       drawDir++;
    //       break;
    //     case 3:
    //       drawDir--;
    //       break;
    //   }
    //
    //   drawDomino(piece, x + dx[drawDir] * dominoSize,
    //     y + dy[drawDir] * dominoSize, !horizontal);
    //   x += dx[dir] * (dominoSize + delta);
    //   y += dy[dir] * (dominoSize + delta);
    // } else {
    //   drawDomino(piece, x, y, horizontal);
    //   x += dx[dir] * (2 * dominoSize + delta);
    //   y += dy[dir] * (2 * dominoSize + delta);
    // }

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

/**
 * Draws using p5
 */
function draw() {
}
