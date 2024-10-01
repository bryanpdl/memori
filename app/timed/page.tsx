import React from 'react';
import Link from 'next/link';
import MemoryGame from '../components/MemoryGame';
import { FaUser } from 'react-icons/fa'; // Import the user icon

export default function TimedMode() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-gray-100">
      <header className="w-full p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
            Memori
          </Link>
          <button 
            className="text-white hover:text-blue-300 transition-colors duration-300 bg-gray-800 p-2 rounded-full"
            aria-label="User Account"
          >
            <FaUser className="text-xl" />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col px-4 w-full max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mt mb-16 text-white text-center">Timed Mode</h2>
        <div className="flex-grow flex flex-col">
          <MemoryGame />
        </div>
      </main>

      <footer className="w-full p-4 mt-12">
        <div className="max-w-5xl mx-auto text-center text-gray-500">
          © 2024 Memori. All rights reserved.
        </div>
      </footer>
    </div>
  );
}