import { useState, useEffect, useCallback } from 'react';
import type { GameActorBird, GameObstaclePipe } from '../types';

const defaultActorSettings: GameActorBird = {
  x: 50,
  y: 200,
  width: 50,
  height: 50,
  velocity: 10,
  weight: 5,
};

const defaultPipeSettings: GameObstaclePipe = {
  x: 0,
  y: 0,
  width: 100,
  height: 600,
};

const useGameBase = ({
  gameWidth = 600,
  gameHeight = 600,
  updateRate = 30,
} = {}) => {
  const [bird, setBird] = useState<GameActorBird>(defaultActorSettings);
  const [jumpHeight, setJumpHeight] = useState<number>(60);
  const [pipeFrequency, setPipeFrequency] = useState<number>(1500);
  const [pipes, setPipes] = useState<GameObstaclePipe[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const restartGame = () => {
    setBird(defaultActorSettings);
    setPipes([]);
    setGameOver(false);
    setGameStarted(true);
    setScore(0);
  };

  const jump = () => {
    if (!gameOver && gameStarted) {
      setBird({ ...bird, y: bird.y - jumpHeight });
    } else if (!gameOver && !gameStarted) {
      setGameStarted(true);
    } else {
      restartGame();
    }
  };

  const collisionCheck = useCallback(() => {
    const birdTop = bird.y;
    const birdBottom = bird.y + bird.height;
    const birdLeft = bird.x;
    const birdRight = bird.x + bird.width;

    pipes.forEach((pipe) => {
      const pipeTop = pipe.y;
      const pipeBottom = pipe.y + pipe.height;
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipe.width;

      const collision =
        birdRight > pipeLeft &&
        birdLeft < pipeRight &&
        birdBottom > pipeTop &&
        birdTop < pipeBottom;

      const pass =
        birdLeft > pipeLeft && birdRight < pipeRight && birdBottom < pipeBottom;

      if (collision) {
        setGameOver(true);
        setGameStarted(false);
      } else if (pass && !pipe.scored) {
        setScore((prevScore) => prevScore + 1);
        setPipes((prevPipes) =>
          prevPipes.map((p) =>
            p.x === pipe.x && p.y === pipe.y ? { ...p, scored: true } : p
          )
        );
      }
    });

    // Check if bird is out of the screen vertically
    const bounds = { top: -170, bottom: 200 };
    if (birdBottom > gameHeight + bounds.bottom || birdTop < bounds.top) {
      // Bird is out of bounds, end the game
      setGameOver(true);
      setGameStarted(false);
    }
  }, [bird, gameHeight, pipes]);

  useEffect(() => {
    collisionCheck();
  }, [collisionCheck]);

  useEffect(() => {
    const gravity = setInterval(() => {
      setBird((prevBird) => {
        return { ...prevBird, y: prevBird.y + bird.weight };
      });
    }, updateRate);

    const pipeGenerator = setInterval(() => {
      if (!gameOver && gameStarted) {
        setPipes((prev) => [
          ...prev,
          {
            ...defaultPipeSettings,
            x: gameWidth,
            // y=0 is the top of the frame, requires actor to fly outside visible area
            // applies pressure to stay within the upper bound
            y: Math.floor(Math.random() * 300 + bird.height / 2),
          },
        ]);
      }
    }, pipeFrequency);

    const pipeMove = setInterval(() => {
      if (!gameOver && gameStarted) {
        setPipes((prev) =>
          prev.map((pipe) => ({ ...pipe, x: pipe.x - bird.velocity }))
        );
      }
    }, updateRate);

    const difficultyScaling = setInterval(() => {
      // scuffed log scaling
      const decreaseBy = Math.log(score + 1) * 2;
      if (!gameOver && gameStarted) {
        setPipeFrequency((prev) => Math.max(prev - decreaseBy, 300));
      }
    }, pipeFrequency);

    return () => {
      clearInterval(gravity);
      clearInterval(pipeGenerator);
      clearInterval(pipeMove);
      clearInterval(difficultyScaling);
    };
  }, [
    bird.height,
    bird.velocity,
    bird.weight,
    gameOver,
    gameStarted,
    gameWidth,
    pipeFrequency,
    updateRate,
    score,
  ]);

  return {
    bird,
    gameOver,
    gameStarted,
    jump,
    pipes,
    restartGame,
    score,
    setJumpHeight,
  };
};

export default useGameBase;
