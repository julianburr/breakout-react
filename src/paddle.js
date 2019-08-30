import { WIDTH } from './constants';

export function movePaddle (state) {
  if (state.paddle.direction === 'left') {
    return {
      ...state,
      paddle: {
        ...state.paddle,
        x: state.paddle.x > 0 ? state.paddle.x - 1 : 0,
        direction: null
      }
    };
  }

  if (state.paddle.direction === 'right') {
    return {
      ...state,
      paddle: {
        ...state.paddle,
        x:
          state.paddle.x < WIDTH - state.paddle.width
            ? state.paddle.x + 1
            : WIDTH - state.paddle.width,
        direction: null
      }
    };
  }

  return state;
}
