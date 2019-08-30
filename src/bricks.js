import { BRICK_ROWS, BRICK_COLS } from './constants';

export function generateBricks () {
  let bricks = [];
  for (let y = 0; y < BRICK_ROWS; y++) {
    for (let x = 0; x < BRICK_COLS; x++) {
      bricks.push({
        x: 13 * x + 6,
        y: 2 * y + 1,
        width: 10,
        height: 1,
        score: 10
      });
    }
  }
  return bricks;
}
