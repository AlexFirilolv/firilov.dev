'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type BlockType = 'title' | 'paragraph' | 'image' | 'quote' | 'highlight';

// For local state, dnd requires a string id
interface Block {
  id: string;
  block_type: BlockType;
  content: string;
}

// For data coming from the API
interface ApiBlock {
  block_type: BlockType;
  content: string;
}

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  blocks: ApiBlock[];
}

export default function Admin() {
  const [day, setDay] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    fetch('/api/memories')
      .then((res) => res.json())
      .then((data: Memory[]) => {
        if (Array.isArray(data)) {
          setMemories(data);
          const memoryForDay = data.find((m) => m.day_number === day);
          if (memoryForDay && memoryForDay.blocks.length > 0) {
            setBlocks(memoryForDay.blocks.map(b => ({...b, id: Math.random().toString(36).substr(2, 9)})));
          } else {
            setBlocks([{ id: 'initial-title', block_type: 'title', content: '' }]);
          }
        }
      });
  }, [day]);

  const handleBlockChange = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const handleBlockTypeChange = (id: string, block_type: BlockType) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, block_type, content: '' } : b));
  };

  const addBlock = () => {
    setBlocks([...blocks, { id: Math.random().toString(36).substr(2, 9), block_type: 'paragraph', content: '' }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleFileChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      showFeedback('Uploading image...');
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        handleBlockChange(id, url);
        showFeedback('Image uploaded successfully!');
      } else {
        showFeedback('Failed to upload image.');
      }
    }
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBlocks(items);
  };

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      day: day.toString(),
      blocks: blocks.map((b, index) => ({
        block_type: b.block_type,
        content: b.content,
        sort_order: index,
      })),
    };

    const response = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showFeedback('Memory saved successfully!');
    } else {
      const { error } = await response.json();
      showFeedback(`Failed to save memory: ${error}`);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                Admin Panel
            </h1>
            <div className="mb-6 text-center">
                <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                    Go to Calendar
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day</label>
                  <select
                      id="day"
                      value={day}
                      onChange={(e) => setDay(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                  >
                      {Array.from({ length: 25 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>Day {d}</option>
                      ))}
                  </select>
                </div>
                
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="blocks">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                {blocks.map((block, index) => (
                                    <Draggable key={block.id} draggableId={block.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <select value={block.block_type} onChange={(e) => handleBlockTypeChange(block.id, e.target.value as BlockType)} className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm">
                                                        <option value="title">Title</option>
                                                        <option value="paragraph">Paragraph</option>
                                                        <option value="image">Image</option>
                                                        <option value="quote">Quote</option>
                                                        <option value="highlight">Highlight</option>
                                                    </select>
                                                    <button type="button" onClick={() => removeBlock(block.id)} className="text-red-500 hover:text-red-700">Remove</button>
                                                </div>
                                                {block.block_type === 'image' ? (
                                                  <div>
                                                    <input type="file" onChange={(e) => handleFileChange(block.id, e)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" accept="image/*" />
                                                    {block.content && <img src={block.content} alt="preview" className="mt-2 rounded-md max-h-40" />}
                                                  </div>
                                                ) : (
                                                    <textarea
                                                        value={block.content}
                                                        onChange={(e) => handleBlockChange(block.id, e.target.value)}
                                                        rows={block.block_type === 'title' ? 1 : 4}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <button type="button" onClick={addBlock} className="w-full inline-flex justify-center rounded-md border-2 border-dashed border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                    Add Block
                </button>

                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-pink-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors">
                    Save Memory
                </button>
            </form>
            {feedbackMessage && (
                <div className="mt-4 text-center p-2 rounded-md bg-green-100 text-green-800 fixed bottom-4 right-4 shadow-lg">
                    {feedbackMessage}
                </div>
            )}
        </div>
    </main>
  );
}
