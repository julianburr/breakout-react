import React, { Fragment, useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { WIDTH, HEIGHT } from './constants';

function App () {
  let map = [];

  const score = useSelector((state) => state.score);
  const lives = useSelector((state) => state.lives);

  const status = useSelector((state) => state.status);
  const paddle = useSelector((state) => state.paddle);
  const ball = useSelector((state) => state.ball);
  const activeEffects = useSelector((state) => state.activeEffects);
  const spawnedEffect = useSelector((state) => state.spawnedEffect);

  if (status === 'waiting') {
    _.set(map, [ HEIGHT - 2, paddle.x + 2 ], '@');
  } else if (status === 'active') {
    _.set(map, [ Math.round(ball.y), Math.round(ball.x) ], '@');
  }

  for (let i = 0; i < paddle.width; i++) {
    _.set(map, [ HEIGHT - 1, paddle.x + i ], '▀');
  }

  const bricks = useSelector((state) => state.bricks);
  bricks.forEach((brick) => {
    for (let y = brick.y; y < brick.y + brick.height; y++) {
      for (let x = brick.x; x < brick.x + brick.width; x++) {
        if (brick.status !== 'hit') {
          _.set(map, [ y, x ], '█');
        }
      }
    }
  });

  if (spawnedEffect) {
    _.set(
      map,
      [ HEIGHT - 1, spawnedEffect.x ],
      <span style={{ fontWeight: 900 }}>?</span>
    );
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const i = setInterval(() => dispatch({ type: '@@game/FRAME' }), 16);

    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowLeft':
          dispatch({ type: '@@key/LEFT' });
          break;
        case 'ArrowRight':
          dispatch({ type: '@@key/RIGHT' });
          break;
        case 'Space':
          dispatch({ type: '@@key/SPACE' });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(i);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hasRotateGame = activeEffects.find(
    (effect) => effect.id === 'rotate_game'
  );

  const now = Date.now();

  return (
    <div
      style={{
        display: 'flex',
        fontFamily: 'Monaco, monospace',
        lineHeight: '1'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, .05)',
          float: 'left'
        }}
      >
        {Array.from(new Array(HEIGHT)).map((__, row) => (
          <div
            key={`row-${row}`}
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            {Array.from(new Array(WIDTH)).map(
              (__, cell) =>
                hasRotateGame
                  ? _.get(map, [ HEIGHT - 1 - row, WIDTH - 1 - cell ], '·')
                  : _.get(map, [ row, cell ], '·')
            )}
          </div>
        ))}
      </div>
      <div>
        {Array.from(new Array(18)).map(() => <span>·</span>)}
        <br />&nbsp;<br />
        Score: {score}
        <br />
        Lives: {lives}
        <br />&nbsp;<br />
        {status === 'gameover' ? (
          'Game Over'
        ) : (
          activeEffects.map((effect) => {
            const durationLeft =
              effect.duration === Infinity
                ? null
                : effect.duration - (now - effect.time);
            const percent =
              effect.duration === Infinity || effect.duration === 0
                ? 18
                : Math.floor(18 * (durationLeft / effect.duration));
            const [ ...chars ] = effect.title;
            return (
              <Fragment>
                {Array.from(new Array(18)).map((__, i) => {
                  const fill = i <= percent;
                  return (
                    <span
                      style={{
                        background: fill
                          ? effect.positive ? 'green' : 'red'
                          : 'none',
                        color: fill ? 'white' : 'black'
                      }}
                    >
                      {chars[i] || '·'}
                    </span>
                  );
                })}
                <br />
              </Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
