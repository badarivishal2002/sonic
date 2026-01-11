/**
 * Notes Service
 * Business logic layer for notes
 * No direct database access - uses repository
 */

import { noteRepository, INoteRepository } from './note.repository';
import { mapCreateInputToInsert, mapUpdateInputToUpdate } from './note.model';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/server/core/types';

/**
 * Service interface
 * Defines the contract for note business logic
 */
export interface INoteService {
  createNote(input: CreateNoteInput): Promise<Note>;
  getNoteById(id: string): Promise<Note | null>;
  getAllNotes(): Promise<Note[]>;
  updateNote(id: string, input: UpdateNoteInput): Promise<Note | null>;
  deleteNote(id: string): Promise<boolean>;
}

/**
 * Notes Service Implementation
 * Contains all business logic for notes
 */
export class NoteService implements INoteService {
  constructor(private repository: INoteRepository = noteRepository) {}

  /**
   * Create a new note
   * Business logic: validates input and creates note via repository
   */
  async createNote(input: CreateNoteInput): Promise<Note> {
    // Validate input
    if (!input.type || (input.type !== 'text' && input.type !== 'voice')) {
      throw new Error('Invalid note type. Must be "text" or "voice"');
    }

    // Transform input to repository format
    const insertData = mapCreateInputToInsert(input);

    // Create via repository
    return this.repository.create(insertData);
  }

  /**
   * Get a note by ID
   */
  async getNoteById(id: string): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return this.repository.findById(id);
  }

  /**
   * Get all notes
   */
  async getAllNotes(): Promise<Note[]> {
    return this.repository.findAll();
  }

  /**
   * Update a note
   */
  async updateNote(id: string, input: UpdateNoteInput): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    // Transform input to repository format
    const updateData = mapUpdateInputToUpdate(input);

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return this.getNoteById(id);
    }

    return this.repository.update(id, updateData);
  }

  /**
   * Delete a note
   */
  async deleteNote(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return this.repository.delete(id);
  }
}

// Export singleton instance
export const noteService = new NoteService();
