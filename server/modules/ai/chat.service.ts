/**
 * Chat Service
 * Notes-aware chat service for querying notes
 * Phase I: Simple relevance matching with deterministic responses
 */

import { noteService } from '@/server/modules/notes/note.service';
import { Note } from '@/server/core/types';

/**
 * Service interface
 * Defines the contract for chat functionality
 */
export interface IChatService {
  query(query: string): Promise<string>;
}

/**
 * Relevance match result
 */
interface RelevantNote {
  note: Note;
  score: number;
  matchedFields: string[];
}

/**
 * Chat Service Implementation
 * Performs simple relevance matching and generates responses
 */
export class ChatService implements IChatService {
  /**
   * Query notes and generate response
   * Phase I: Simple keyword matching with deterministic responses
   * Future: Can be replaced with AI/LLM integration
   */
  async query(userQuery: string): Promise<string> {
    if (!userQuery || userQuery.trim().length === 0) {
      return 'Please ask a question about your notes.';
    }

    // Fetch all notes
    const notes = await noteService.getAllNotes();

    if (notes.length === 0) {
      return 'You don\'t have any notes yet. Create some notes first to search through them.';
    }

    // Find relevant notes using simple keyword matching
    const relevantNotes = this.findRelevantNotes(userQuery, notes);

    if (relevantNotes.length === 0) {
      return `I couldn't find any notes matching "${userQuery}". Try asking about something else, or check your notes list.`;
    }

    // Generate response based on relevant notes
    return this.generateResponse(userQuery, relevantNotes);
  }

  /**
   * Find relevant notes using simple keyword matching
   * Searches in title, summary, and content
   * Prefers summaries over content
   */
  private findRelevantNotes(query: string, notes: Note[]): RelevantNote[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 0);

    const relevantNotes: RelevantNote[] = [];

    for (const note of notes) {
      let score = 0;
      const matchedFields: string[] = [];

      // Search in title (highest weight)
      if (note.title) {
        const titleLower = note.title.toLowerCase();
        const titleMatches = queryWords.filter((word) => titleLower.includes(word));
        if (titleMatches.length > 0) {
          score += titleMatches.length * 3;
          matchedFields.push('title');
        }
      }

      // Search in summary (high weight)
      if (note.summary) {
        const summaryLower = note.summary.toLowerCase();
        const summaryMatches = queryWords.filter((word) => summaryLower.includes(word));
        if (summaryMatches.length > 0) {
          score += summaryMatches.length * 2;
          matchedFields.push('summary');
        }
      }

      // Search in content (lower weight)
      if (note.content) {
        const contentLower = note.content.toLowerCase();
        const contentMatches = queryWords.filter((word) => contentLower.includes(word));
        if (contentMatches.length > 0) {
          score += contentMatches.length;
          matchedFields.push('content');
        }
      }

      // Only include notes with matches
      if (score > 0) {
        relevantNotes.push({ note, score, matchedFields });
      }
    }

    // Sort by score (highest first) and limit to top 5
    return relevantNotes
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Generate deterministic response based on relevant notes
   * Phase I: Simple formatting based on matching notes
   * Never hallucinates - only uses actual note data
   */
  private generateResponse(query: string, relevantNotes: RelevantNote[]): string {
    const count = relevantNotes.length;
    const noteWord = count === 1 ? 'note' : 'notes';

    // Generate response header
    let response = `I found ${count} ${noteWord} related to your query:\n\n`;

    // Add information about each relevant note
    for (let i = 0; i < relevantNotes.length; i++) {
      const { note, matchedFields } = relevantNotes[i];
      const noteTitle = note.title || `Untitled ${note.type} note`;
      const noteDate = new Date(note.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      response += `${i + 1}. **${noteTitle}** (${noteDate}, ${note.type})\n`;

      // Prefer summary over content
      if (note.summary && matchedFields.includes('summary')) {
        response += `   Summary: ${note.summary}\n`;
      } else if (note.content && matchedFields.includes('content')) {
        // Show first 200 characters of content
        const contentPreview = note.content.length > 200
          ? note.content.substring(0, 200) + '...'
          : note.content;
        response += `   Content: ${contentPreview}\n`;
      }

      response += '\n';
    }

    return response.trim();
  }
}

// Export singleton instance
export const chatService = new ChatService();
