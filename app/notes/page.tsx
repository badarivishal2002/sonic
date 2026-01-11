/**
 * Notes List Page
 * Notion-style notes listing page with "New Note" button
 */

import { noteService } from '@/server/modules/notes/note.service';
import { NotesList } from '@/components/NotesList';
import { PageHeader } from '@/components/PageHeader';
import { Note } from '@/server/core/types';
import Link from 'next/link';

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
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader title="Notes" />
      
      <div className="px-8 py-8">
        {/* New Note Button */}
        <div className="mb-6 flex justify-end">
          <Link
            href="/notes/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
          >
            + New Note
          </Link>
        </div>

        <NotesList notes={notes} error={error} />
      </div>
    </div>
  );
}
