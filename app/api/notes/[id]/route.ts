/**
 * API Routes: Notes by ID
 * GET /api/notes/:id - Get a note by ID
 * PATCH /api/notes/:id - Update a note
 * DELETE /api/notes/:id - Delete a note
 */

import { NextRequest } from 'next/server';
import { noteController } from '@/server/modules/notes/note.controller';

/**
 * GET /api/notes/:id
 * Get a note by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return noteController.findById(req, id);
}

/**
 * PATCH /api/notes/:id
 * Update a note
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return noteController.update(req, id);
}

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return noteController.delete(req, id);
}
