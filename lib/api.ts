/**
 * API Client
 * Frontend API utilities for making requests
 */

import { Note, CreateNoteInput, UpdateNoteInput } from '@/server/core/types';

const API_BASE = '/api';

/**
 * Fetch all notes
 */
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch(`${API_BASE}/notes`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }

  return response.json();
}

/**
 * Fetch a note by ID
 */
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Note not found');
    }
    throw new Error('Failed to fetch note');
  }

  return response.json();
}

/**
 * Create a new note
 */
export async function createNote(input: CreateNoteInput): Promise<Note> {
  const response = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create note');
  }

  return response.json();
}

/**
 * Update a note
 */
export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update note');
  }

  return response.json();
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
}
