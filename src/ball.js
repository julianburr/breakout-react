import { COLLISION_STEPS, BRICK_ROWS, WIDTH, HEIGHT } from './constants';
import { generateBricks } from './bricks';

export function calculateCollisions (state) {
  if (state.status !== 'active') {
    return state;
  }

  let status = state.status;
  let lives = state.lives;
  let score = state.score;

  let x = state.ball.x + state.ball.vx / COLLISION_STEPS;
  let vx = state.ball.vx;
  if (vx > 0) {
    if (x > WIDTH - 1) {
      vx = -vx;
      x = WIDTH - 1 + vx / COLLISION_STEPS;
    }
  } else {
    if (x < 0) {
      vx = -vx;
      x = 0 + vx / COLLISION_STEPS;
    }
  }

  let y = state.ball.y + state.ball.vy / COLLISION_STEPS;
  let vy = state.ball.vy;
  if (vy > 0) {
    if (y > HEIGHT - 1) {
      vy = 0;
      vx = 0;
      y = HEIGHT;
      status = 'waiting';
      lives -= 1;
    } else if (
      Math.round(y) === HEIGHT - 1 &&
      x >= state.paddle.x &&
      x <= state.paddle.x + state.paddle.width
    ) {
      // hits the paddle
      const center = state.paddle.x + (state.paddle.width - 1) / 2;
      const offCenter = center - Math.round(x);
      if (Math.abs(offCenter) > 0) {
        vx = -state.ball.speed * offCenter * 0.2;
      }

      vy =
        Math.sqrt(Math.pow(state.ball.speed, 2) - Math.pow(vx, 2)) *
        (vy < 0 ? 1 : -1);

      y = state.ball.y + vy / COLLISION_STEPS;
      x = state.ball.x + vx / COLLISION_STEPS;
    }
  } else {
    if (y < 0) {
      vy = -vy;
      y = state.ball.y + vy / COLLISION_STEPS;
      x = state.ball.x + vx / COLLISION_STEPS;
    }
  }

  let bricks = state.bricks;
  const brickIndex = bricks.findIndex(
    (brick) =>
      x >= brick.x &&
      x < brick.x + brick.width &&
      y >= brick.y &&
      y < brick.y + brick.height &&
      brick.status !== 'hit'
  );

  if (brickIndex !== -1) {
    const hasGhostBricks = state.activeEffects.find(
      (effect) => effect.id === 'ghost_bricks'
    );

    if (!hasGhostBricks) {
      const hasBulletBall = state.activeEffects.find(
        (effect) => effect.id === 'bullet_ball'
      );
      if (!hasBulletBall) {
        vy = -vy;
        y = state.ball.y + vy / COLLISION_STEPS;
        x = state.ball.x + vx / COLLISION_STEPS;
      }
      const hasMetalBricks = state.activeEffects.find(
        (effect) => effect.id === 'metal_bricks'
      );
      if (!hasMetalBricks || hasBulletBall) {
        bricks = [ ...state.bricks ];
        bricks[brickIndex].status = 'hit';
        score += bricks[brickIndex].score;
      }
    }
  }

  if (!bricks.find((brick) => brick.status !== 'hit')) {
    if (state.ball.y > (BRICK_ROWS + 1) * 2) {
      bricks = generateBricks();
    }
  }

  return {
    ...state,
    bricks,
    lives,
    score,
    status,
    ball: { ...state.ball, x, vx, y, vy }
  };
}
