/**
 * NotesList Component
 * Displays a list of notes
 * Used in notes list page
 */

import { Note } from '@/server/core/types';
import { NoteCard } from './NoteCard';

interface NotesListProps {
  notes: Note[];
  error?: string | null;
}

export function NotesList({ notes, error }: NotesListProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No notes yet</p>
        <a
          href="/create"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create your first note
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          All Notes ({notes.length})
        </h2>
        <a
          href="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Note
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
