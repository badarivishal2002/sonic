/**
 * Note Detail Page
 * Server-side rendered note detail view
 */

import { noteService } from '@/server/modules/notes/note.service';
import { NoteDetail } from '@/components/NoteDetail';
import { Note } from '@/server/core/types';
import { notFound } from 'next/navigation';

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
    return <NoteDetail note={{} as Note} error={error || 'Note not found'} />;
  }

  return <NoteDetail note={note} error={error} />;
}
