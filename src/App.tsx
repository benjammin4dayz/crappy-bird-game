import React, { useState } from 'react';

import Game from './views/Game';
import './App.css';

function App() {
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [romanMode, setRomanMode] = useState<boolean>(false);

  return (
    <div
      style={{
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '10%',
      }}
    >
      <header style={{ fontFamily: 'Comic Sans MS', color: '#f3f3f3' }}>
        <h1>Crappy Bird Game</h1>
        <sub>
          Recreated by Jam [
          <a
            href="https://www.geeksforgeeks.org/flappy-bird-game-using-react-js/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guide
          </a>
          ] [
          <a
            href="https://github.com/benjammin4dayz/crappy-bird-game"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
          ]
        </sub>
        <section>
          <h2>How to Play</h2>
          <ul>
            <li>Click in the game window to fly</li>
            <li>Try to avoid the pipes</li>
            <li>Score as many points as you can</li>
          </ul>
        </section>
        <section>
          <h3>Extras</h3>
          <div>
            <label>Roman1266 Mode</label>
            <input
              type="checkbox"
              disabled={gameReady}
              title={
                gameReady
                  ? 'Stop or restart the game to change this option'
                  : 'Who needs gravity anyway?'
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setRomanMode(true);
                } else {
                  setRomanMode(false);
                }
              }}
            />
          </div>
        </section>
        <section style={{ margin: '15em 0' }}>{/* placeholder */}</section>
        <button
          style={{ width: '100%' }}
          onClick={() => setGameReady(!gameReady)}
        >
          {gameReady ? 'Change Settings' : 'Start Game'}
        </button>
      </header>
      {gameReady && (
        <div>
          <Game romanMode={romanMode ? true : false} />
        </div>
      )}
    </div>
  );
}

export default App;
