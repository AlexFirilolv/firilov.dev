'use client';

import { useState, useEffect } from 'react';

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  title: string;
  text_content: string;
  media_url: string;
  media_type: 'image' | 'video' | 'audio';
}

export default function Admin() {
  const [day, setDay] = useState(1);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    fetch('/api/memories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setMemories(data);
            const memoryForDay = data.find((m: Memory) => m.day_number === day);
            if (memoryForDay) {
              setTitle(memoryForDay.title);
              setTextContent(memoryForDay.text_content);
              setIsEditing(true);
            } else {
              setTitle('');
              setTextContent('');
              setIsEditing(false);
            }
        }
      });
  }, [day]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(e.target.files[0]);
    }
  };

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media && !isEditing) {
      showFeedback('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('day', day.toString());
    formData.append('title', title);
    formData.append('textContent', textContent);
    if (media) {
      formData.append('media', media);
    }

    const response = await fetch('/api/memories', {
      method: isEditing ? 'PUT' : 'POST',
      body: formData,
    });

    if (response.ok) {
        showFeedback(`Memory ${isEditing ? 'updated' : 'saved'} successfully!`);
    } else {
        const { error } = await response.json();
        showFeedback(`Failed to ${isEditing ? 'update' : 'save'} memory: ${error}`);
    }
  };

  return (
    <main className="flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                Admin Panel
            </h1>
            <div className="mb-6 text-center">
                <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                    Go to Calendar
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                    Day
                </label>
                <select
                    id="day"
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                >
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                        Day {d}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                />
                </div>
                <div>
                <label htmlFor="textContent" className="block text-sm font-medium text-gray-700">
                    Text Content
                </label>
                <textarea
                    id="textContent"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                />
                </div>
                <div>
                <label htmlFor="media" className="block text-sm font-medium text-gray-700">
                    Media (optional if editing)
                </label>
                <input
                    type="file"
                    id="media"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                </div>
                <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-pink-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                >
                {isEditing ? 'Update Memory' : 'Save New Memory'}
                </button>
            </form>
            {feedbackMessage && (
                <div className="mt-4 text-center p-2 rounded-md bg-green-100 text-green-800">
                    {feedbackMessage}
                </div>
            )}
        </div>
    </main>
  );
}
