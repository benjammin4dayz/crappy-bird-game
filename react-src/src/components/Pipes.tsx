import React from 'react';
import pipeImg from '../assets/pipe.png';
import type { Position } from '../types';

const Pipes: React.FC<Position> = ({ x, y }) => {
  return (
    <img
      src={pipeImg}
      alt="pipe"
      className="pipe"
      style={{
        left: x,
        top: y,
      }}
      draggable={true}
    />
  );
};

export default Pipes;
