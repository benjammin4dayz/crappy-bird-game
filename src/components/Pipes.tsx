import React from 'react';
import type { Position } from '../types';

const Pipes: React.FC<Position> = ({ x, y }) => {
  return (
    <img
      src={process.env.PUBLIC_URL + '/pipe.png'}
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
