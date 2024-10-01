'use client';

import React from 'react';
import Link from 'next/link';
import { FaClock, FaBrain, FaBolt, FaTrophy } from 'react-icons/fa';

interface GameMode {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

const gameModes: GameMode[] = [
  {
    name: 'Timed Mode',
    description: 'Race against the clock to match all pairs!',
    path: '/timed',
    icon: <FaClock className="text-2xl mb-2" />,
    color: 'text-yellow-400',
  },
  {
    name: 'Classic Mode',
    description: 'Test your memory at your own pace.',
    path: '/classic',
    icon: <FaBrain className="text-2xl mb-2" />,
    color: 'text-green-400',
  },
  
];

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-gray-100">
      <header className="w-full p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400">Memori</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">
            Sign In
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 w-full max-w-5xl mx-auto">
        <div className="text-center mb-12 w-full">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Welcome to Memori
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Challenge your memory and reflexes with our exciting game modes. How far can you go?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {gameModes.map((mode, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className={`${mode.color} mb-4`}>
                  {mode.icon}
                </div>
                <h3 className={`text-2xl font-semibold mb-2 ${mode.color}`}>{mode.name}</h3>
                <p className="text-gray-400 mb-4">{mode.description}</p>
                <Link href={mode.path} className="block w-full">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300">
                    Play Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full p-4 mt-12">
        <div className="max-w-5xl mx-auto text-center text-gray-500">
          © 2024 Memori. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;