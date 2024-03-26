import React, { useState, useEffect } from 'react';
import { GameActorBird, GameObstaclePipe } from '../types';

const defaultActorSettings: GameActorBird = {
  x: 50,
  y: 200,
  width: 50,
  height: 50,
};

const defaultPipeSettings: GameObstaclePipe = {
  x: 0,
  y: 0,
  width: 100,
  height: 600,
};

const useGameBase = () => {
  const [bird, setBird] = useState<GameActorBird>(defaultActorSettings);
  const [jumpHeight, setJumpHeight] = useState<number>(60);
  const [pipes, setPipes] = useState<GameObstaclePipe[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const [roman1266Mode, setRoman1266Mode] = useState<boolean>(false);

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

  const collisionCheck = () => {
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

      if (collision) {
        if (
          birdLeft > pipeLeft &&
          birdRight < pipeRight &&
          birdBottom < pipeBottom
        ) {
          // Bird has crashed through the pipe, increase score
          setScore((prevScore) => prevScore + 1);
        } else {
          // Bird has hit the pipe, end the game
          setGameOver(true);
          setGameStarted(false);
        }
      }
    });

    // Check if bird is out of the screen vertically
    // TODO: determine the source of these arbitrary numbers
    if (birdBottom > 800 || birdTop < -170) {
      // Bird is out of bounds, end the game
      setGameOver(true);
      setGameStarted(false);
    }
  };

  useEffect(() => {
    collisionCheck();
  }, [bird, pipes, gameOver]);

  useEffect(() => {
    // this is used in every loc that the number 5 was referenced
    const SINK_RATE = 5;
    const POLL_RATE = 30;
    const PIPE_GENERATION_RATE = 2000;

    const gravity = setInterval(() => {
      setBird((prevBird) => {
        // invert the gravity as a callback to a friend :)
        const calculation = roman1266Mode
          ? prevBird.y - SINK_RATE
          : prevBird.y + SINK_RATE;
        return { ...prevBird, y: calculation };
      });
      collisionCheck();
    }, POLL_RATE);

    const pipeGenerator = setInterval(() => {
      if (!gameOver && gameStarted) {
        setPipes((prev) => [
          ...prev,
          {
            ...defaultPipeSettings,
            // TODO: determine the source of these arbitrary numbers
            x: 400,
            y: Math.floor(Math.random() * 300),
          },
        ]);
      }
    }, PIPE_GENERATION_RATE);

    const pipeMove = setInterval(() => {
      if (!gameOver && gameStarted) {
        setPipes((prev) =>
          prev.map((pipe) => ({ ...pipe, x: pipe.x - SINK_RATE }))
        );
      }
    }, POLL_RATE);

    return () => {
      clearInterval(gravity);
      clearInterval(pipeGenerator);
      clearInterval(pipeMove);
    };
  }, [gameOver, gameStarted, roman1266Mode]);

  return {
    bird,
    jump,
    pipes,
    gameOver,
    score,
    gameStarted,
    restartGame,
    setJumpHeight,
    setRoman1266Mode,
  };
};

export default useGameBase;
