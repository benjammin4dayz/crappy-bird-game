import React from 'react';
import birdImg from '../assets/bird.png';
import type { Position } from '../types';

const Bird: React.FC<Position> = ({ x, y }) => {
  return (
    <img
      src={birdImg}
      alt="bird"
      className="bird"
      style={{
        left: x,
        top: y,
      }}
      draggable={true}
    />
  );
};

export default Bird;
