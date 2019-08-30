export function checkGameStatus (state) {
  if (state.lives <= 0) {
    return { ...state, status: 'gameover', lives: 0, paddle: state.paddle };
  }
  return state;
}
