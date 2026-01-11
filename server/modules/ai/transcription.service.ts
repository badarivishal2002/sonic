/**
 * Transcription Service
 * Real Gemini-based transcription service
 * Downloads audio from Supabase Storage and transcribes using Gemini
 */

import { createServerSupabaseClient } from '@/server/core/db/client';
import { config } from '@/server/core/config';
import { GoogleGenAI } from '@google/genai';

/**
 * Service interface
 * Defines the contract for transcription
 */
export interface ITranscriptionService {
  transcribe(audioPath: string): Promise<string>;
}

/**
 * Transcription Service Implementation (Gemini)
 * Uses Gemini API for speech-to-text transcription
 */
export class TranscriptionService implements ITranscriptionService {
  private gemini: GoogleGenAI | null = null;

  /**
   * Initialize Gemini client
   * Lazy initialization to avoid errors if API key is missing
   */
  private getGeminiClient(): GoogleGenAI {
    if (!this.gemini) {
      if (!config.gemini.apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
      }
      this.gemini = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    }
    return this.gemini;
  }

  /**
   * Transcribe audio file
   * Downloads audio from Supabase Storage and transcribes using Gemini
   */
  async transcribe(audioPath: string): Promise<string> {
    if (!audioPath) {
      throw new Error('Audio path is required');
    }

    try {
      // Download audio from Supabase Storage
      const supabase = createServerSupabaseClient();
      const { data: audioData, error: downloadError } = await supabase.storage
        .from(config.storage.audioBucket)
        .download(audioPath);

      if (downloadError) {
        throw new Error(`Failed to download audio: ${downloadError.message}`);
      }

      if (!audioData) {
        throw new Error('Failed to download audio: No data returned');
      }

      // Convert audio to buffer
      const arrayBuffer = await audioData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert to base64 for Gemini API
      const base64Audio = buffer.toString('base64');

      // Get audio mime type
      const mimeType = audioData.type || 'audio/webm';

      // Use Gemini for transcription
      const gemini = this.getGeminiClient();

      // Create prompt for transcription
      const prompt = 'Transcribe this audio file. Return only the transcript text, without any additional commentary or formatting.';

      // Generate content with audio
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { text: prompt },
          {
            inlineData: {
              data: base64Audio,
              mimeType: mimeType,
            },
          },
        ],
      });

      const transcript = response.text || '';

      if (!transcript || transcript.trim().length === 0) {
        throw new Error('Transcription returned empty result');
      }

      // Normalize whitespace
      return transcript.trim().replace(/\s+/g, ' ');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Transcription failed: ${error.message}`);
      }
      throw new Error('Transcription failed: Unknown error');
    }
  }
}

// Export singleton instance
export const transcriptionService = new TranscriptionService();
