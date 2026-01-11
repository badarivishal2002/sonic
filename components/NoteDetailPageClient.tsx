/**
 * NoteDetailPageClient Component
 * Client component wrapper for note detail page with actions
 */

'use client';

import { Note } from '@/server/core/types';
import { NoteDetail } from './NoteDetail';
import { PageHeader } from './PageHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NoteDetailPageClientProps {
  noteId: string;
  note: Note;
  error?: string | null;
}

export function NoteDetailPageClient({ noteId, note, error }: NoteDetailPageClientProps) {
  const router = useRouter();
  const [isStarred, setIsStarred] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
        router.push('/notes');
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleShare = () => {
    // Share functionality handled by PageHeader
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader 
        title={note.title || 'Untitled'} 
        noteId={noteId}
        onShare={handleShare}
        onDelete={handleDelete}
        onStar={() => setIsStarred(!isStarred)}
        isStarred={isStarred}
      />
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <NoteDetail note={note} error={error} />
      </div>
    </div>
  );
}
