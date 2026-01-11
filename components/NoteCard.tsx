/**
 * NoteCard Component
 * Displays a single note in a card format
 * Used in notes list
 */

import Link from 'next/link';
import { Note } from '@/server/core/types';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link
      href={`/notes/${note.id}`}
      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {note.title || `Untitled ${note.type} note`}
        </h3>
        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 whitespace-nowrap ml-2">
          {note.type}
        </span>
      </div>

      {note.content && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {note.content}
        </p>
      )}

      {note.summary && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <span className="font-medium">Summary: </span>
          {note.summary}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        {formattedDate}
      </div>
    </Link>
  );
}
