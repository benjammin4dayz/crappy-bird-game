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
    // coffee brain infers that 800 is (GAME_HEIGHT + LOWER_BOUND_LIMIT)
    // and that -170 is an arbitrary UPPER_BOUND_LIMIT
    if (birdBottom > 800 || birdTop < -170) {
      // Bird is out of bounds, end the game
      setGameOver(true);
      setGameStarted(false);
    }
  };

  useEffect(() => {
    collisionCheck();
  }, [bird, gameOver, pipes]);

  useEffect(() => {
    const SINK_RATE = 5; // pixels per second
    const POLL_RATE = 30; // ms
    // speed at which obstacles advance towards actor (perceived as actor velocity)
    //
    const PIPE_VELOCITY = 10; // pixels per second
    const PIPE_GENERATION_RATE = 2000; // ms

    // width is necessary to generate pipes out of frame
    // TODO: migrate value to single source of truth
    //
    const GAME_WIDTH = 600; // px

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
            x: GAME_WIDTH,
            // y=0 is the top of the frame, requires actor to fly outside visible area
            // applies pressure to stay within the upper bound
            y: Math.floor(Math.random() * 300 + bird.height / 2),
          },
        ]);
      }
    }, PIPE_GENERATION_RATE);

    const pipeMove = setInterval(() => {
      if (!gameOver && gameStarted) {
        setPipes((prev) =>
          prev.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_VELOCITY }))
        );
      }
    }, POLL_RATE);

    return () => {
      clearInterval(gravity);
      clearInterval(pipeGenerator);
      clearInterval(pipeMove);
    };
  }, [bird.height, gameOver, gameStarted, roman1266Mode]);

  return {
    bird,
    gameOver,
    gameStarted,
    jump,
    pipes,
    restartGame,
    score,
    setJumpHeight,
    setRoman1266Mode,
  };
};

export default useGameBase;
