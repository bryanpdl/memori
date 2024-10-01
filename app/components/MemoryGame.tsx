'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Tile from './Tile';

interface Tile {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Position {
  x: number;
  y: number;
}

const MemoryGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lastMatchTime, setLastMatchTime] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [mismatchedTiles, setMismatchedTiles] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateTiles = useCallback((level: number) => {
    const pairCount = 2 + level - 1;
    const totalTiles = pairCount * 2;

    const newTiles: Tile[] = [];
    for (let i = 0; i < totalTiles; i++) {
      newTiles.push({
        id: i,
        value: Math.floor(i / 2) + 1,
        isFlipped: false,
        isMatched: false,
      });
    }

    return newTiles.sort(() => Math.random() - 0.5);
  }, []);

  const getStaggeredLayout = (tileCount: number): Position[] => {
    const positions: Position[] = [];
    const radius = Math.ceil(Math.sqrt(tileCount));
    const hexWidth = Math.sqrt(3);
    const hexHeight = 3;
    
    for (let q = -radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        if (positions.length < tileCount) {
          const x = hexWidth * (q + r/2) + (1) * 0.1;
          const y = hexHeight * (3/4 * r) + (1) * 0.1;
          positions.push({ x, y });
        }
      }
    }
    
    // Center the layout
    const centerX = (Math.min(...positions.map(p => p.x)) + Math.max(...positions.map(p => p.x))) / 2;
    const centerY = (Math.min(...positions.map(p => p.y)) + Math.max(...positions.map(p => p.y))) / 2;
    
    return positions.map(p => ({
      x: p.x - centerX,
      y: p.y - centerY
    }));
  };

  const startGame = () => {
    setIsLoading(true);
    const newLevel = isGameOver ? 1 : level;
    const newTiles = generateTiles(newLevel);
    
    // Simulate loading time
    setTimeout(() => {
      setTiles(newTiles);
      setIsGameStarted(true);
      setTimeLeft(newLevel === 1 ? 5 : 5 + (newLevel - 1) * 3);
      setIsGameOver(false);
      setFlippedTiles([]);
      setMatchedPairs(0);
      setScore(0);
      setLastMatchTime(Date.now());
      if (isGameOver) {
        setLevel(1);
        setTotalScore(0);
      }
      setIsLoading(false);
    }, 1000); // Adjust this delay as needed
  };

  const resetGame = useCallback(() => {
    setLevel(1);
    setIsGameStarted(false);
    setIsGameOver(false);
    setTimeLeft(0);
    setTiles([]);
    setFlippedTiles([]);
    setMatchedPairs(0);
    setScore(0);
    setTotalScore(0);
  }, []);

  useEffect(() => {
    if (matchedPairs === tiles.length / 2 && tiles.length > 0) {
      setIsGameStarted(false);
      setTotalScore(prevTotal => prevTotal + score);
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setIsGameOver(false);
      }, 1000);
    }
  }, [matchedPairs, tiles.length, score]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(time => time - 1), 1000);
    } else if (timeLeft === 0 && isGameStarted) {
      setIsGameOver(true);
      setIsGameStarted(false);
      setTotalScore(prevTotal => prevTotal + score);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isGameStarted, score]);

  const handleTileClick = (id: number) => {
    if (flippedTiles.length === 2 || isGameOver) return;
    
    setTiles(prevTiles =>
      prevTiles.map(tile =>
        tile.id === id ? { ...tile, isFlipped: true } : tile
      )
    );

    setFlippedTiles(prev => [...prev, id]);

    if (flippedTiles.length === 1) {
      const [firstId] = flippedTiles;
      const firstTile = tiles.find(tile => tile.id === firstId);
      const secondTile = tiles.find(tile => tile.id === id);

      if (firstTile && secondTile && firstTile.value === secondTile.value) {
        const currentTime = Date.now();
        const timeTaken = (currentTime - lastMatchTime) / 1000; // in seconds
        const baseScore = 100;
        const timeBonus = Math.max(0, 10 - timeTaken) * 10; // 10 points per second under 10 seconds
        const newScore = baseScore + timeBonus;

        setScore(prevScore => prevScore + newScore);
        setMatchedPairs(prev => prev + 1);
        setLastMatchTime(currentTime);

        setTiles(prevTiles =>
          prevTiles.map(tile =>
            tile.id === firstId || tile.id === id
              ? { ...tile, isMatched: true }
              : tile
          )
        );
        setFlippedTiles([]);
      } else {
        setMismatchedTiles([firstId, id]);
        setTimeout(() => {
          setTiles(prevTiles =>
            prevTiles.map(tile =>
              tile.id === firstId || tile.id === id
                ? { ...tile, isFlipped: false }
                : tile
            )
          );
          setFlippedTiles([]);
          setMismatchedTiles([]);
          setScore(prevScore => Math.max(0, prevScore - 20)); // Penalty for mismatch
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatScore = (score: number): string => {
    return score.toFixed(1);
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 relative">
        <div className="text-2xl font-bold">Level: {level}</div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <CircularProgressBar
            percentage={(timeLeft / (5 + (level - 1) * 3)) * 100}
            text={formatTime(timeLeft)}
          />
        </div>
        <div className="text-2xl font-bold">Score: {formatScore(totalScore)}</div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
      {isGameOver && (
          <div className="text-3xl mt-16 text-red-500 mt-4">
            Game Over! Final Score: {formatScore(totalScore)}
          </div>
        )}
        {!isGameStarted && !isLoading && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-12 transition-colors duration-300"
            onClick={startGame}
          >
            {isGameOver ? "Try Again" : `Start Level ${level}`}
          </button>
        )}
        {isLoading && (
          <div className="text-2xl mt-24 text-blue-400">Loading...</div>
        )}
       
        {isGameStarted && (
          <div className="relative mt-96 w-full h-full flex items-center justify-center">
            <div className="honeycomb-grid" style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {getStaggeredLayout(tiles.length).map((position, index) => (
                <div key={tiles[index].id} style={{
                  position: 'absolute',
                  left: `calc(50% + ${position.x} * var(--hex-size) * 0.98)`,
                  top: `calc(50% + ${position.y} * var(--hex-size) * 0.22)`,
                  transform: 'translate(-50%, -50%)',
                }}>
                  <Tile
                    {...tiles[index]}
                    isMismatched={mismatchedTiles.includes(tiles[index].id)}
                    onClick={() => handleTileClick(tiles[index].id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CircularProgressBar: React.FC<{ percentage: number; text: string }> = ({ percentage, text }) => {
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700 stroke-current"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className="text-blue-500 progress-ring__circle stroke-current"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
        {text}
      </span>
    </div>
  );
};

export default MemoryGame;