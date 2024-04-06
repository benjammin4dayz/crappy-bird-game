import useGameBase from './hooks/useGameBase';
import Bird from './components/Bird';
import Pipes from './components/Pipes';
import type { GameObstaclePipe } from './types';
import './App.css';

function App() {
  const { bird, gameOver, jump, pipes, score } = useGameBase();

  return (
    <div className={`App ${gameOver ? 'game-over' : ''}`} onClick={jump}>
      <h3 style={{ userSelect: 'none' }}>Score: {score}</h3>
      <Bird x={bird.x} y={bird.y} />
      {pipes.map((pipe: GameObstaclePipe, index: number) => (
        <Pipes key={index} x={pipe.x} y={pipe.y} />
      ))}
      {gameOver && (
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
    </div>
  );
}

export default App;
