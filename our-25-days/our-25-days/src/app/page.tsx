'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  title: string;
  text_content: string;
  media_url: string;
  media_type: 'image' | 'video' | 'audio';
}

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    fetch('/api/memories')
      .then((res) => res.json())
      .then((data) => setMemories(data));
  }, []);

  const today = new Date();

  return (
    <main className="flex min-h-screen flex-col items-center p-12 font-sans">
      <header className="w-full max-w-5xl text-center mb-12">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Dancing Script, cursive' }}>
          Our 25 Days of Summer
        </h1>
        <p className="text-xl text-white/90 mt-4">A collection of our most cherished memories.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
          const memory = memories.find((m) => m.day_number === day);
          const isReleased = memory ? new Date(memory.release_date) <= today : false;

          return (
            <Link
              key={day}
              href={isReleased ? `/memories/${day}` : '#'}
              className={`group aspect-square flex flex-col justify-center items-center p-4 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 ${
                isReleased
                  ? 'bg-white/70 hover:bg-white/90 backdrop-blur-md'
                  : 'bg-white/30 backdrop-blur-sm cursor-not-allowed'
              }`}
            >
              <h2 className="text-4xl font-bold text-pink-500" style={{ fontFamily: 'Dancing Script, cursive' }}>
                Day {day}
              </h2>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {isReleased ? memory?.title : 'Locked'}
              </p>
              {!isReleased && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}