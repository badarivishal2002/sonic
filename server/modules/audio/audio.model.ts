/**
 * Audio Model
 * Database model definitions for the audio module
 * All database-related types and interfaces
 */

import { AudioJob, AudioJobStatus } from '@/server/core/types';

export interface AudioJobRow {
  id: string;
  note_id: string;
  status: AudioJobStatus;
  audio_path: string;
  created_at: string;
  updated_at: string;
}

export interface AudioJobInsert {
  note_id: string;
  status?: AudioJobStatus;
  audio_path: string;
}

export interface AudioJobUpdate {
  status?: AudioJobStatus;
  audio_path?: string;
  updated_at?: string;
}

/**
 * Maps database row to domain model
 */
export function mapAudioJobRowToAudioJob(row: AudioJobRow): AudioJob {
  return {
    id: row.id,
    note_id: row.note_id,
    status: row.status,
    audio_path: row.audio_path,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Maps insert input to database insert format
 */
export function mapInsertToAudioJobInsert(input: AudioJobInsert): AudioJobInsert {
  return {
    note_id: input.note_id,
    status: input.status || 'pending',
    audio_path: input.audio_path,
  };
}

/**
 * Maps update input to database update format
 */
export function mapUpdateToAudioJobUpdate(input: AudioJobUpdate): AudioJobUpdate {
  const update: AudioJobUpdate = {};
  if (input.status !== undefined) update.status = input.status;
  if (input.audio_path !== undefined) update.audio_path = input.audio_path;
  update.updated_at = new Date().toISOString();
  return update;
}
