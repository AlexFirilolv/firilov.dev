'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type BlockType = 'title' | 'paragraph' | 'image' | 'quote' | 'highlight';

interface Block {
  id: string;
  block_type: BlockType;
  content: string;
}

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  blocks: Block[];
}

const BlockRenderer = ({ block }: { block: Block }) => {
    switch (block.block_type) {
      case 'title':
        return <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 my-4" style={{ fontFamily: 'Playfair Display, serif' }}>{block.content}</h1>;
      case 'paragraph':
        return <p className="text-lg sm:text-xl text-gray-700 leading-relaxed my-4">{block.content}</p>;
      case 'image':
        return <img src={block.content} alt="Memory" className="w-full h-auto rounded-xl shadow-lg my-4" />;
      case 'quote':
        return <blockquote className="text-xl italic text-center text-gray-600 border-l-4 border-pink-300 pl-4 my-6">{block.content}</blockquote>;
      case 'highlight':
        return <div className="p-4 bg-pink-100/50 rounded-lg text-pink-800 my-4">{block.content}</div>;
      default:
        return null;
    }
  };
  

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

  if (!memory || !memory.blocks) {
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
        
        {memory.blocks.map(block => <BlockRenderer key={block.id} block={block} />)}

      </div>
    </main>
  );
}
