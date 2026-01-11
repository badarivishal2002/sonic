/**
 * Summary Service
 * Real Gemini-based summary generation service
 * Generates concise bullet-point summaries using Gemini
 */

import { config } from '@/server/core/config';
import { GoogleGenAI } from '@google/genai';

/**
 * Service interface
 * Defines the contract for summary generation
 */
export interface ISummaryService {
  summarize(text: string): Promise<string>;
}

/**
 * Summary Service Implementation (Gemini)
 * Uses Gemini API for text summarization
 */
export class SummaryService implements ISummaryService {
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
   * Generate summary from text
   * Uses Gemini to generate 3-5 concise bullet points
   */
  async summarize(text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      return 'No content to summarize.';
    }

    try {
      // Use Gemini for summarization
      const gemini = this.getGeminiClient();

      // Create prompt for summarization
      const prompt = `Summarize the following text in 3-5 concise bullet points. Be factual and only include information present in the text. Do not add any information not in the source text. Format each point with a bullet (•) followed by a space.

Text to summarize:
${text}

Summary:`;

      // Generate summary
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ text: prompt }],
      });

      const summary = response.text || '';

      if (!summary || summary.trim().length === 0) {
        throw new Error('Summary generation returned empty result');
      }

      // Normalize bullet points
      const normalizedSummary = summary
        .trim()
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => {
          // Ensure bullet format
          if (!line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
            return `• ${line}`;
          }
          return line.replace(/^[-*]\s*/, '• ');
        })
        .join('\n');

      return normalizedSummary;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Summary generation failed: ${error.message}`);
      }
      throw new Error('Summary generation failed: Unknown error');
    }
  }
}

// Export singleton instance
export const summaryService = new SummaryService();
