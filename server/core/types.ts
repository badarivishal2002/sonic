/**
 * Core types
 * Shared types across modules
 */

export type NoteType = 'text' | 'voice';

export type AudioJobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface BaseEntity {
  id: string;
  created_at: string;
}

export interface Note extends BaseEntity {
  type: NoteType;
  title: string | null;
  content: string | null;
  summary: string | null;
}

export interface AudioJob extends BaseEntity {
  note_id: string;
  status: AudioJobStatus;
  audio_path: string;
  updated_at: string;
}

export interface CreateNoteInput {
  type: NoteType;
  title?: string;
  content?: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  summary?: string;
}
