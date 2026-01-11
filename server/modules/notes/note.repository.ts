/**
 * Notes Repository
 * Database access layer for notes
 * Single source of truth for database queries in the notes module
 */

import { createServerSupabaseClient, Database } from '@/server/core/db/client';
import { NoteRow, NoteInsert, NoteUpdate, mapNoteRowToNote } from './note.model';
import { Note } from '@/server/core/types';

type NoteInsertDB = Database['public']['Tables']['notes']['Insert'];
type NoteUpdateDB = Partial<Database['public']['Tables']['notes']['Update']>;

/**
 * Repository interface
 * Defines the contract for note data access
 */
export interface INoteRepository {
  create(data: NoteInsert): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  findAll(): Promise<Note[]>;
  update(id: string, data: NoteUpdate): Promise<Note | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Notes Repository Implementation
 * Handles all database operations for notes
 */
export class NoteRepository implements INoteRepository {
  /**
   * Create a new note
   */
  async create(data: NoteInsert): Promise<Note> {
    const supabase = createServerSupabaseClient();
    
    const insertData: NoteInsertDB = {
      type: data.type,
      title: data.title ?? null,
      content: data.content ?? null,
      summary: data.summary ?? null,
    };
    
    const { data: row, error } = await supabase
      .from('notes')
      // @ts-expect-error - Manual Database types may not match Supabase's exact structure
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }

    if (!row) {
      throw new Error('Failed to create note: No data returned');
    }

    return mapNoteRowToNote(row as NoteRow);
  }

  /**
   * Find a note by ID
   */
  async findById(id: string): Promise<Note | null> {
    const supabase = createServerSupabaseClient();
    
    const { data: row, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to find note: ${error.message}`);
    }

    if (!row) {
      return null;
    }

    return mapNoteRowToNote(row as NoteRow);
  }

  /**
   * Find all notes, ordered by created_at DESC
   */
  async findAll(): Promise<Note[]> {
    const supabase = createServerSupabaseClient();
    
    const { data: rows, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find notes: ${error.message}`);
    }

    if (!rows) {
      return [];
    }

    return rows.map((row) => mapNoteRowToNote(row as NoteRow));
  }

  /**
   * Update a note by ID
   */
  async update(id: string, data: NoteUpdate): Promise<Note | null> {
    const supabase = createServerSupabaseClient();
    
    const updateData: NoteUpdateDB = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.summary !== undefined) updateData.summary = data.summary;
    
    const { data: row, error } = await supabase
      .from('notes')
      // @ts-expect-error - Manual Database types may not match Supabase's exact structure
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to update note: ${error.message}`);
    }

    if (!row) {
      return null;
    }

    return mapNoteRowToNote(row as NoteRow);
  }

  /**
   * Delete a note by ID
   */
  async delete(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }

    return true;
  }
}

// Export singleton instance
export const noteRepository = new NoteRepository();
