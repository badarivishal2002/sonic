/**
 * NoteCreator Component
 * Dedicated component for creating new notes
 * Supports text notes with title
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from './PageHeader';

export function NoteCreator() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const note = await response.json();
      // Redirect to note detail page
      router.push(`/notes/${note.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/notes');
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader title="New Note" />
      
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#9B9B9B] mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#E9E9E9] placeholder-[#9B9B9B] focus:outline-none focus:border-[#4E4E4E]"
              placeholder="Enter note title..."
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-[#9B9B9B] mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#E9E9E9] placeholder-[#9B9B9B] focus:outline-none focus:border-[#4E4E4E] resize-none"
              placeholder="Write your note content..."
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-sm text-red-400">Error: {error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving || !content.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
            >
              {isSaving ? 'Creating...' : 'Create Note'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] text-[#E9E9E9] text-sm font-medium rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
