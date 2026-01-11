/**
 * Note Detail Page
 * Notion-style note detail view with share functionality
 */

import { noteService } from '@/server/modules/notes/note.service';
import { NoteDetail } from '@/components/NoteDetail';
import { Note } from '@/server/core/types';
import { notFound } from 'next/navigation';
import { NoteDetailPageClient } from '@/components/NoteDetailPageClient';

/**
 * Server Component: Fetches note server-side
 */
export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let note: Note | null = null;
  let error: string | null = null;

  try {
    note = await noteService.getNoteById(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load note';
  }

  if (!note) {
    if (!error) {
      notFound();
    }
    // Error case - return error message
    return (
      <NoteDetailPageClient noteId={id} note={{} as Note} error={error || 'Note not found'} />
    );
  }

  return <NoteDetailPageClient noteId={id} note={note} error={error} />;
}
