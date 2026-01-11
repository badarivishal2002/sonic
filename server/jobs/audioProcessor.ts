/**
 * Audio Processor Job
 * Skeleton for audio processing workflow
 * Phase I: Stubbed implementation
 */

import { audioService } from '@/server/modules/audio/audio.service';
import { noteService } from '@/server/modules/notes/note.service';
import { transcriptionService } from '@/server/modules/ai/transcription.service';
import { summaryService } from '@/server/modules/ai/summary.service';

/**
 * Process audio job
 * Transcribes audio and generates summary, then updates note
 * Phase I: Synchronous processing (future: background job queue)
 */
export async function processAudioJob(jobId: string): Promise<void> {
  try {
    // Get audio job
    const audioJob = await audioService.getAudioJobById(jobId);
    if (!audioJob) {
      throw new Error(`Audio job not found: ${jobId}`);
    }

    // Update status to processing
    await audioService.updateAudioJobStatus(jobId, 'processing');

    try {
      // Get note
      const note = await noteService.getNoteById(audioJob.note_id);
      if (!note) {
        throw new Error(`Note not found: ${audioJob.note_id}`);
      }

      // Transcribe audio
      const transcript = await transcriptionService.transcribe(audioJob.audio_path);

      // Generate summary
      const summary = await summaryService.summarize(transcript);

      // Update note with transcript and summary
      await noteService.updateNote(audioJob.note_id, {
        content: transcript,
        summary: summary,
      });

      // Update audio job status to done
      await audioService.updateAudioJobStatus(jobId, 'done');
    } catch (error) {
      // Update audio job status to failed
      await audioService.updateAudioJobStatus(jobId, 'failed');
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to process audio job: ${message}`);
  }
}
