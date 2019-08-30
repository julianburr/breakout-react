import { SPAWN_FREQUENCY, SPAWN_DURATION, WIDTH } from './constants';

export const effects = [
  {
    id: 'massive_paddle',
    positive: true,
    title: 'Massive Paddle',
    duration: Infinity
  },
  {
    id: 'tiny_paddle',
    positive: false,
    title: 'Tiny Paddle',
    duration: Infinity
  },
  {
    id: 'bullet_ball',
    positive: true,
    title: 'Bullet Ball',
    duration: 15000
  },
  {
    id: 'metal_bricks',
    positive: false,
    title: 'Metal Bricks',
    duration: 15000
  },
  {
    id: 'extra_life',
    positive: true,
    title: 'Extra Life',
    duration: 0
  },
  {
    id: 'lost_life',
    positive: false,
    title: 'Lost Life',
    duration: 0
  },
  {
    id: 'rotate_game',
    positive: false,
    title: 'Rotate Game',
    duration: 20000
  },
  {
    id: 'speed_ball',
    positive: false,
    title: 'Speed Ball',
    duration: Infinity
  },
  {
    id: 'ghost_bricks',
    positive: false,
    title: 'Ghost Bricks',
    duration: 15000
  }
];

export function applyEffect (state, effect) {
  switch (effect.id) {
    case 'extra_life':
      return {
        ...state,
        lives: state.lives + 1
      };
    case 'lost_life':
      return {
        ...state,
        lives: state.lives - 1
      };
    case 'tiny_paddle':
      return {
        ...state,
        paddle: {
          ...state.paddle,
          width: state.paddle.width - 2
        }
      };
    case 'massive_paddle':
      return {
        ...state,
        paddle: {
          ...state.paddle,
          width: state.paddle.width + 2
        }
      };
    case 'speed_ball':
      return {
        ...state,
        ball: {
          ...state.ball,
          speed: state.ball.speed * 1.5,
          vx: state.ball.vx * 1.5,
          vy: state.ball.vy * 1.5
        }
      };
    default:
      return state;
  }
}

export function applyEffectEnd (state, effect) {
  switch (effect.id) {
    case 'tiny_paddle':
      return {
        ...state,
        paddle: {
          ...state.paddle,
          width: state.paddle.width + 2
        }
      };
    case 'massive_paddle':
      return {
        ...state,
        paddle: {
          ...state.paddle,
          width: state.paddle.width - 2
        }
      };
    case 'speed_ball':
      return {
        ...state,
        ball: {
          ...state.ball,
          speed: state.ball.speed / 1.5,
          vx: state.ball.vx / 1.5,
          vy: state.ball.vy / 1.5
        }
      };
    default:
      return state;
  }
}

export function spawnEffects (state) {
  if (state.status !== 'active') {
    if (state.activeEffects.length) {
      state.activeEffects.forEach((effect) => {
        state = applyEffectEnd(state, effect);
      });
      return {
        ...state,
        activeEffects: [],
        spawnedEffect: null,
        lastEffectSpawnTime: null
      };
    }
    return state;
  }

  const now = Date.now();

  if (state.activeEffects.length) {
    state.activeEffects.forEach((effect) => {
      const duration = effect.duration === 0 ? 3000 : effect.duration;
      if (now - effect.time > duration) {
        state = applyEffectEnd(state, effect);
        state = {
          ...state,
          activeEffects: state.activeEffects.filter((e) => e !== effect)
        };
      }
    });
  }

  if (state.spawnedEffect) {
    if (now - state.spawnedEffect.time > SPAWN_DURATION) {
      return { ...state, spawnedEffect: null, lastEffectSpawnTime: now };
    } else if (
      state.spawnedEffect.x >= state.paddle.x &&
      state.spawnedEffect.x <= state.paddle.x + state.paddle.width
    ) {
      state = applyEffect(state, state.spawnedEffect);
      return {
        ...state,
        spawnedEffect: null,
        lastEffectSpawnTime: now,
        activeEffects: [
          ...state.activeEffects,
          { ...state.spawnedEffect, time: now }
        ]
      };
    }
    return state;
  }

  if (!state.lastEffectSpawnTime) {
    return { ...state, lastEffectSpawnTime: Date.now() };
  }

  if (now - state.lastEffectSpawnTime > SPAWN_FREQUENCY) {
    const random =
      SPAWN_FREQUENCY + Math.floor(Math.random() * SPAWN_FREQUENCY);
    if (now - state.lastEffectSpawnTime > random) {
      const availableEffects = effects.filter(
        (e) => !state.activeEffects.find((ae) => ae.id === e.id)
      );

      const randomIndex = Math.floor(
        Math.random() * (availableEffects.length - 1)
      );

      let randomX;
      while (
        !randomX ||
        (randomX >= state.paddle.x - 2 &&
          randomX <= state.paddle.x + state.paddle.width + 2)
      ) {
        randomX = Math.floor(Math.random() * (WIDTH - 1));
      }

      return {
        ...state,
        spawnedEffect: {
          ...availableEffects[randomIndex],
          time: now,
          x: randomX
        }
      };
    }
  }

  return state;
}
