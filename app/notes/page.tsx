/**
 * Notes List Page
 * Server-side rendered list of all notes
 */

import { noteService } from '@/server/modules/notes/note.service';
import { NotesList } from '@/components/NotesList';
import { Note } from '@/server/core/types';

/**
 * Server Component: Fetches notes server-side
 */
export default async function NotesPage() {
  let notes: Note[] = [];
  let error: string | null = null;

  try {
    notes = await noteService.getAllNotes();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load notes';
    notes = [];
  }

  return <NotesList notes={notes} error={error} />;
}
