import React from 'react';
import type { Position } from '../types';

const Bird: React.FC<Position> = ({ x, y }) => {
  return (
    <img
      src={process.env.PUBLIC_URL + '/crappy-bird-50px.png'}
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
