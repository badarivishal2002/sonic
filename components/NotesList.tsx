/**
 * NotesList Component
 * Notion-style list of notes
 */

'use client';

import { Note } from '@/server/core/types';
import Link from 'next/link';

interface NotesListProps {
  notes: Note[];
  error?: string | null;
}

export function NotesList({ notes, error }: NotesListProps) {
  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-sm text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-[#9B9B9B] mb-4">No notes yet</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
          >
            Create your first note
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <Link
          key={note.id}
          href={`/notes/${note.id}`}
          className="block"
        >
          <div className="p-4 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#9B9B9B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[#E9E9E9] truncate mb-1">
                  {note.title || 'Untitled'}
                </h3>
                {note.summary && (
                  <p className="text-xs text-[#9B9B9B] line-clamp-2 mb-2">{note.summary}</p>
                )}
                {note.content && !note.summary && (
                  <p className="text-xs text-[#9B9B9B] line-clamp-2 mb-2">{note.content}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-[#9B9B9B]">
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{note.type}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
