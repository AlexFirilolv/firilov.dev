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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Our 25 Days
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
          const memory = memories.find((m) => m.day_number === day);
          const isReleased = memory ? new Date(memory.release_date) <= today : false;

          return (
            <Link
              key={day}
              href={isReleased ? `/memories/${day}` : ''}
              className={`group rounded-lg border border-transparent px-5 py-4 transition-colors ${
                isReleased
                  ? 'hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
                  : 'cursor-not-allowed'
              }`}
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                Day {day}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {isReleased ? memory?.title : 'Awaiting release...'}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
