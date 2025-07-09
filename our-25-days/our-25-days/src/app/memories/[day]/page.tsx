'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function MemoryPage() {
  const params = useParams();
  const day = params.day;
  const [memory, setMemory] = useState<Memory | null>(null);

  useEffect(() => {
    if (day) {
      fetch(`/api/memories/${day}`)
        .then((res) => res.json())
        .then((data) => setMemory(data));
    }
  }, [day]);

  if (!memory) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10">
        <Link href="/" className="text-pink-500 hover:text-pink-700 transition-colors duration-300 font-semibold">
          &larr; Back to Calendar
        </Link>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 my-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          {memory.title}
        </h1>
        <div className="mb-6">
          {memory.media_type === 'image' && (
            <img src={memory.media_url} alt={memory.title} className="w-full h-auto rounded-xl shadow-lg" />
          )}
          {memory.media_type === 'video' && (
            <video src={memory.media_url} controls className="w-full h-auto rounded-xl shadow-lg" />
          )}
          {memory.media_type === 'audio' && (
            <audio src={memory.media_url} controls className="w-full" />
          )}
        </div>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
          {memory.text_content}
        </p>
      </div>
    </main>
  );
}
