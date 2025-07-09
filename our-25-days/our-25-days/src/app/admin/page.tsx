'use client';

import { useState } from 'react';

export default function Admin() {
  const [day, setDay] = useState(1);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('day', day.toString());
    formData.append('title', title);
    formData.append('textContent', textContent);
    formData.append('media', media);

    const response = await fetch('/api/memories', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Memory saved successfully!');
    } else {
      alert('Failed to save memory.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">
            Day
          </label>
          <select
            id="day"
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700">
            Media
          </label>
          <input
            type="file"
            id="media"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </form>
    </div>
  );
}
