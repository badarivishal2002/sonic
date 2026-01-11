/**
 * Audio Repository
 * Database access layer for audio_jobs
 * Single source of truth for database queries in the audio module
 */

import { createServerSupabaseClient, Database } from '@/server/core/db/client';
import {
  AudioJobRow,
  AudioJobInsert,
  AudioJobUpdate,
  mapAudioJobRowToAudioJob,
} from './audio.model';
import { AudioJob } from '@/server/core/types';

type AudioJobInsertDB = Database['public']['Tables']['audio_jobs']['Insert'];
type AudioJobUpdateDB = Partial<Database['public']['Tables']['audio_jobs']['Update']>;

/**
 * Repository interface
 * Defines the contract for audio job data access
 */
export interface IAudioRepository {
  create(data: AudioJobInsert): Promise<AudioJob>;
  findById(id: string): Promise<AudioJob | null>;
  findByNoteId(noteId: string): Promise<AudioJob | null>;
  update(id: string, data: AudioJobUpdate): Promise<AudioJob | null>;
  updateStatus(id: string, status: AudioJob['status']): Promise<AudioJob | null>;
}

/**
 * Audio Repository Implementation
 * Handles all database operations for audio_jobs
 */
export class AudioRepository implements IAudioRepository {
  /**
   * Create a new audio job
   */
  async create(data: AudioJobInsert): Promise<AudioJob> {
    const supabase = createServerSupabaseClient();

    const insertData: AudioJobInsertDB = {
      note_id: data.note_id,
      status: data.status || 'pending',
      audio_path: data.audio_path,
    };

    const { data: row, error } = await supabase
      .from('audio_jobs')
      // @ts-expect-error - Manual Database types may not match Supabase's exact structure
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create audio job: ${error.message}`);
    }

    if (!row) {
      throw new Error('Failed to create audio job: No data returned');
    }

    return mapAudioJobRowToAudioJob(row as AudioJobRow);
  }

  /**
   * Find an audio job by ID
   */
  async findById(id: string): Promise<AudioJob | null> {
    const supabase = createServerSupabaseClient();

    const { data: row, error } = await supabase
      .from('audio_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find audio job: ${error.message}`);
    }

    if (!row) {
      return null;
    }

    return mapAudioJobRowToAudioJob(row as AudioJobRow);
  }

  /**
   * Find an audio job by note ID (returns latest)
   */
  async findByNoteId(noteId: string): Promise<AudioJob | null> {
    const supabase = createServerSupabaseClient();

    const { data: rows, error } = await supabase
      .from('audio_jobs')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(`Failed to find audio job: ${error.message}`);
    }

    if (!rows || rows.length === 0) {
      return null;
    }

    return mapAudioJobRowToAudioJob(rows[0] as AudioJobRow);
  }

  /**
   * Update an audio job by ID
   */
  async update(id: string, data: AudioJobUpdate): Promise<AudioJob | null> {
    const supabase = createServerSupabaseClient();

    const updateData: AudioJobUpdateDB = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.audio_path !== undefined) updateData.audio_path = data.audio_path;
    updateData.updated_at = new Date().toISOString();

    const { data: row, error } = await supabase
      .from('audio_jobs')
      // @ts-expect-error - Manual Database types may not match Supabase's exact structure
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to update audio job: ${error.message}`);
    }

    if (!row) {
      return null;
    }

    return mapAudioJobRowToAudioJob(row as AudioJobRow);
  }

  /**
   * Update audio job status
   */
  async updateStatus(id: string, status: AudioJob['status']): Promise<AudioJob | null> {
    return this.update(id, { status });
  }
}

// Export singleton instance
export const audioRepository = new AudioRepository();
