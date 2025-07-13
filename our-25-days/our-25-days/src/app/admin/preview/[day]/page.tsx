'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Block, BlockRenderer, DisplaySettings } from '@/app/components/BlockRenderer';

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  blocks: Block[];
  display_settings: DisplaySettings;
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const day = params.day;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [settings, setSettings] = useState<DisplaySettings>({});
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (day) {
      fetch(`/api/memories/${day}`)
        .then((res) => res.json())
        .then((data) => {
          setMemory(data);
          setSettings(data.display_settings || {});
        });
    }
  }, [day]);

  const handleSettingChange = (key: keyof DisplaySettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleSaveSettings = async () => {
    const payload = {
      day: day,
      settings: settings,
    };

    const response = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showFeedback('Settings saved successfully!');
    } else {
      showFeedback('Failed to save settings.');
    }
  };

  if (!memory) return <div>Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12">
      <div className="w-full max-w-6xl flex gap-8">
        {/* Preview Panel */}
        <div className="w-2/3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10">
          <Link href="/admin" className="text-pink-500 hover:text-pink-700 transition-colors duration-300 font-semibold">
            &larr; Back to Editor
          </Link>
          <div className="mt-4">
            {memory.blocks.map(block => <BlockRenderer key={block.id} block={block} settings={{...memory.display_settings, ...settings}} />)}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-1/3 bg-gray-50/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Customize Display</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Image Size</label>
              <select onChange={(e) => handleSettingChange('imageSize', e.target.value)} value={settings.imageSize || '100%'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Title Font Size</label>
              <input type="text" onChange={(e) => handleSettingChange('titleFontSize', e.target.value)} value={settings.titleFontSize || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 4rem" />
            </div>
            <div>
              <label className="block text-sm font-medium">Paragraph Font Size</label>
              <input type="text" onChange={(e) => handleSettingChange('paragraphFontSize', e.target.value)} value={settings.paragraphFontSize || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 1.25rem" />
            </div>
            <div>
              <label className="block text-sm font-medium">Quote Font Size</label>
              <input type="text" onChange={(e) => handleSettingChange('quoteFontSize', e.target.value)} value={settings.quoteFontSize || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 1.5rem" />
            </div>
            <button onClick={handleSaveSettings} className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Save Settings</button>
          </div>
        </div>
      </div>
      {feedbackMessage && (
          <div className="mt-4 text-center p-2 rounded-md bg-green-100 text-green-800 fixed bottom-4 right-4 shadow-lg">
              {feedbackMessage}
          </div>
      )}
    </main>
  );
} 