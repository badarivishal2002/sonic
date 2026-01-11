/**
 * Notes Controller
 * HTTP request/response handling for notes
 * Orchestrates service calls and formats responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { noteService, INoteService } from './note.service';
import { CreateNoteInput, UpdateNoteInput } from '@/server/core/types';

/**
 * Controller interface
 * Defines the contract for HTTP handlers
 */
export interface INoteController {
  create(req: NextRequest): Promise<NextResponse>;
  findAll(req: NextRequest): Promise<NextResponse>;
  findById(req: NextRequest, id: string): Promise<NextResponse>;
  update(req: NextRequest, id: string): Promise<NextResponse>;
  delete(req: NextRequest, id: string): Promise<NextResponse>;
}

/**
 * Notes Controller Implementation
 * Handles HTTP requests and responses
 */
export class NoteController implements INoteController {
  constructor(private service: INoteService = noteService) {}

  /**
   * POST /api/notes
   * Create a new note
   */
  async create(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const input: CreateNoteInput = {
        type: body.type,
        title: body.title,
        content: body.content,
      };

      const note = await this.service.createNote(input);

      return NextResponse.json(note, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create note';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }
  }

  /**
   * GET /api/notes
   * Get all notes
   */
  async findAll(req: NextRequest): Promise<NextResponse> {
    try {
      const notes = await this.service.getAllNotes();
      return NextResponse.json(notes, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notes';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/notes/:id
   * Get a note by ID
   */
  async findById(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      const note = await this.service.getNoteById(id);

      if (!note) {
        return NextResponse.json(
          { error: 'Note not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(note, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch note';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  }

  /**
   * PATCH /api/notes/:id
   * Update a note
   */
  async update(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      const input: UpdateNoteInput = {
        title: body.title,
        content: body.content,
        summary: body.summary,
      };

      const note = await this.service.updateNote(id, input);

      if (!note) {
        return NextResponse.json(
          { error: 'Note not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(note, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update note';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }
  }

  /**
   * DELETE /api/notes/:id
   * Delete a note
   */
  async delete(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      await this.service.deleteNote(id);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete note';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  }
}

// Export singleton instance
export const noteController = new NoteController();
