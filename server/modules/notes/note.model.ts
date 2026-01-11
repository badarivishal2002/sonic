/**
 * Notes Model
 * Database model definitions for the notes module
 * All database-related types and interfaces
 */

import { Note, NoteType, CreateNoteInput, UpdateNoteInput } from '@/server/core/types';

export interface NoteRow {
  id: string;
  type: NoteType;
  title: string | null;
  content: string | null;
  summary: string | null;
  created_at: string;
}

export interface NoteInsert {
  type: NoteType;
  title?: string | null;
  content?: string | null;
  summary?: string | null;
}

export interface NoteUpdate {
  title?: string | null;
  content?: string | null;
  summary?: string | null;
}

/**
 * Maps database row to domain model
 */
export function mapNoteRowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    content: row.content,
    summary: row.summary,
    created_at: row.created_at,
  };
}

/**
 * Maps create input to database insert format
 */
export function mapCreateInputToInsert(input: CreateNoteInput): NoteInsert {
  return {
    type: input.type,
    title: input.title || null,
    content: input.content || null,
    summary: null,
  };
}

/**
 * Maps update input to database update format
 */
export function mapUpdateInputToUpdate(input: UpdateNoteInput): NoteUpdate {
  const update: NoteUpdate = {};
  if (input.title !== undefined) update.title = input.title;
  if (input.content !== undefined) update.content = input.content;
  if (input.summary !== undefined) update.summary = input.summary;
  return update;
}
