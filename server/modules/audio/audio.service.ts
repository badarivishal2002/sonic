/**
 * Audio Service
 * Business logic layer for audio operations
 * No direct database access - uses repository
 */

import { audioRepository, IAudioRepository } from './audio.repository';
import { AudioJob, AudioJobStatus } from '@/server/core/types';
import { noteService } from '@/server/modules/notes/note.service';
import { createServerSupabaseClient } from '@/server/core/db/client';
import { config } from '@/server/core/config';

/**
 * Service interface
 * Defines the contract for audio business logic
 */
export interface IAudioService {
  uploadAudio(noteId: string, file: File): Promise<AudioJob>;
  getAudioJobById(id: string): Promise<AudioJob | null>;
  getAudioJobByNoteId(noteId: string): Promise<AudioJob | null>;
  updateAudioJobStatus(id: string, status: AudioJobStatus): Promise<AudioJob | null>;
}

/**
 * Audio Service Implementation
 * Contains all business logic for audio operations
 */
export class AudioService implements IAudioService {
  constructor(private repository: IAudioRepository = audioRepository) {}

  /**
   * Upload audio file to Supabase Storage and create audio job
   */
  async uploadAudio(noteId: string, file: File): Promise<AudioJob> {
    if (!noteId) {
      throw new Error('Note ID is required');
    }

    if (!file) {
      throw new Error('Audio file is required');
    }

    // Verify note exists
    const note = await noteService.getNoteById(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    // Upload to Supabase Storage
    const supabase = createServerSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${noteId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(config.storage.audioBucket)
      .upload(filePath, file, {
        contentType: file.type || 'audio/webm',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload audio: ${uploadError.message}`);
    }

    if (!uploadData?.path) {
      throw new Error('Failed to upload audio: No path returned');
    }

    // Create audio job with pending status
    const audioJob = await this.repository.create({
      note_id: noteId,
      status: 'pending',
      audio_path: uploadData.path,
    });

    return audioJob;
  }

  /**
   * Get audio job by ID
   */
  async getAudioJobById(id: string): Promise<AudioJob | null> {
    if (!id) {
      throw new Error('Audio job ID is required');
    }

    return this.repository.findById(id);
  }

  /**
   * Get audio job by note ID
   */
  async getAudioJobByNoteId(noteId: string): Promise<AudioJob | null> {
    if (!noteId) {
      throw new Error('Note ID is required');
    }

    return this.repository.findByNoteId(noteId);
  }

  /**
   * Update audio job status
   */
  async updateAudioJobStatus(id: string, status: AudioJobStatus): Promise<AudioJob | null> {
    if (!id) {
      throw new Error('Audio job ID is required');
    }

    return this.repository.updateStatus(id, status);
  }
}

// Export singleton instance
export const audioService = new AudioService();
