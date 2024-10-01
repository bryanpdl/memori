'use client';

import React from 'react';

interface TileProps {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatched: boolean;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = React.memo(({ value, isFlipped, isMatched, isMismatched, onClick }) => {
  return (
    <div className="hexagon-wrapper">
      <div
        className={`hexagon flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 no-select
          ${isFlipped ? 'flipped' : ''}
          ${isMatched ? 'matched opacity-50 animate-pulse' : ''}
          ${isMismatched ? 'mismatched animate-shake' : ''}
        `}
        onClick={!isFlipped && !isMatched ? onClick : undefined}
      >
        <div className="flipper">
          <div className="front">
            <span className="question-mark opacity-0 group-hover:opacity-100 transition-opacity duration-300">?</span>
          </div>
          <div className="back">
            <span>{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

Tile.displayName = 'Tile';

export default Tile;