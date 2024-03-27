import React, { useEffect } from 'react';

import type { GameObstaclePipe } from '../types';

import useGameBase from '../hooks/useGameBase';
import Bird from '../components/Bird';
import Pipes from '../components/Pipes';

import EasterEgg from '../components/EasterEgg';

import '../App.css';

const Game: React.FC<{ romanMode?: boolean }> = ({ romanMode }) => {
  const { bird, gameOver, gameStarted, jump, pipes, score, setRoman1266Mode } =
    useGameBase();

  useEffect(() => {
    if (romanMode && !gameOver && !gameStarted) {
      setRoman1266Mode(true);
    } else {
      setRoman1266Mode(false);
    }
  }, [romanMode, gameOver, gameStarted, setRoman1266Mode]);

  return (
    <div
      className={`App ${gameOver ? 'game-over' : ''}`}
      onClick={romanMode ? () => {} : jump}
    >
      <h3 style={{ userSelect: 'none' }}>Score: {score}</h3>
      <Bird x={bird.x} y={bird.y} />
      {pipes.map((pipe: GameObstaclePipe, index: number) => (
        <Pipes key={index} x={pipe.x} y={pipe.y} />
      ))}
      {gameOver && !romanMode && (
        <center>
          <div className="game-over-message">
            Game Over!
            <br />
            <p
              style={{
                backgroundColor: 'blue',
                padding: '2px 6px',
                borderRadius: '5px',
              }}
            >
              Click anywhere to Restart
            </p>
          </div>
        </center>
      )}
      {gameOver && romanMode && <EasterEgg />}
    </div>
  );
};

export default Game;
