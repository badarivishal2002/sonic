/**
 * Audio Controller
 * HTTP request/response handling for audio operations
 * Orchestrates service calls and formats responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { audioService, IAudioService } from './audio.service';
import { processAudioJob } from '@/server/jobs/audioProcessor';

/**
 * Controller interface
 * Defines the contract for HTTP handlers
 */
export interface IAudioController {
  uploadAudio(req: NextRequest, noteId: string): Promise<NextResponse>;
  processAudio(req: NextRequest, noteId: string): Promise<NextResponse>;
}

/**
 * Audio Controller Implementation
 * Handles HTTP requests and responses
 */
export class AudioController implements IAudioController {
  constructor(private service: IAudioService = audioService) {}

  /**
   * POST /api/notes/:id/audio
   * Upload audio file for a note
   */
  async uploadAudio(req: NextRequest, noteId: string): Promise<NextResponse> {
    try {
      if (!noteId) {
        return NextResponse.json(
          { error: 'Note ID is required' },
          { status: 400 }
        );
      }

      const formData = await req.formData();
      const file = formData.get('audio') as File;

      if (!file) {
        return NextResponse.json(
          { error: 'Audio file is required' },
          { status: 400 }
        );
      }

      const audioJob = await this.service.uploadAudio(noteId, file);

      return NextResponse.json(audioJob, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload audio';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }
  }

  /**
   * POST /api/notes/:id/process
   * Process audio for a note (transcribe and generate summary)
   */
  async processAudio(req: NextRequest, noteId: string): Promise<NextResponse> {
    try {
      if (!noteId) {
        return NextResponse.json(
          { error: 'Note ID is required' },
          { status: 400 }
        );
      }

      // Get audio job for this note
      const audioJob = await this.service.getAudioJobByNoteId(noteId);

      if (!audioJob) {
        return NextResponse.json(
          { error: 'No audio job found for this note' },
          { status: 404 }
        );
      }

      // Process audio job
      await processAudioJob(audioJob.id);

      // Get updated audio job
      const updatedAudioJob = await this.service.getAudioJobById(audioJob.id);

      return NextResponse.json(
        { 
          message: 'Audio processing started',
          audioJob: updatedAudioJob 
        },
        { status: 200 }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process audio';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  }
}

// Export singleton instance
export const audioController = new AudioController();
