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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline">
        &larr; Back to calendar
      </Link>
      <h1 className="text-4xl font-bold my-4">{memory.title}</h1>
      <div className="mb-4">
        {memory.media_type === 'image' && (
          <img src={memory.media_url} alt={memory.title} className="max-w-full rounded-lg" />
        )}
        {memory.media_type === 'video' && (
          <video src={memory.media_url} controls className="max-w-full rounded-lg" />
        )}
        {memory.media_type === 'audio' && <audio src={memory.media_url} controls />}
      </div>
      <p className="text-lg">{memory.text_content}</p>
    </div>
  );
}
