/**
 * NoteDetail Component
 * Displays a single note in detail view
 * Used in note detail page
 */

import { Note } from '@/server/core/types';

interface NoteDetailProps {
  note: Note;
  error?: string | null;
}

export function NoteDetail({ note, error }: NoteDetailProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {note.title || `Untitled ${note.type} note`}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
              {note.type}
            </span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {note.summary && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">Summary</h2>
          <div className="text-blue-800 whitespace-pre-wrap">{note.summary}</div>
        </div>
      )}

      {note.content && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Content</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        </div>
      )}

      {!note.content && !note.summary && (
        <div className="text-center py-12 text-gray-500">
          <p>This note has no content yet.</p>
          {note.type === 'voice' && (
            <p className="text-sm mt-2">Audio is being processed...</p>
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <a
          href="/notes"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Notes
        </a>
      </div>
    </div>
  );
}
