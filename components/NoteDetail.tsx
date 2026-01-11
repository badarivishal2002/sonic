/**
 * NoteDetail Component
 * Notion-style note detail display
 */

'use client';

import { Note } from '@/server/core/types';

interface NoteDetailProps {
  note: Note;
  error?: string | null;
}

export function NoteDetail({ note, error }: NoteDetailProps) {
  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-sm text-red-400">Error: {error}</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Note Type Badge */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-[#2E2E2E] border border-[#3E3E3E] rounded text-xs text-[#9B9B9B] capitalize">
          {note.type}
        </span>
        <span className="text-xs text-[#9B9B9B]">
          {formatDate(note.created_at)}
        </span>
      </div>

      {/* Content */}
      {note.content ? (
        <div className="prose prose-invert max-w-none">
          <div className="text-[#E9E9E9] whitespace-pre-wrap leading-relaxed">
            {note.content}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-center">
          <p className="text-[#9B9B9B]">No content yet. Processing...</p>
        </div>
      )}

      {/* Summary */}
      {note.summary && (
        <div className="mt-8 pt-8 border-t border-[#2E2E2E]">
          <h3 className="text-sm font-semibold text-[#E9E9E9] mb-3">Summary</h3>
          <div className="text-sm text-[#9B9B9B] whitespace-pre-wrap leading-relaxed">
            {note.summary}
          </div>
        </div>
      )}
    </div>
  );
}
