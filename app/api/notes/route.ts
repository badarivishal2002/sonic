/**
 * API Routes: Notes
 * POST /api/notes - Create a note
 * GET /api/notes - Get all notes
 */

import { NextRequest } from 'next/server';
import { noteController } from '@/server/modules/notes/note.controller';

/**
 * POST /api/notes
 * Create a new note
 */
export async function POST(req: NextRequest) {
  return noteController.create(req);
}

/**
 * GET /api/notes
 * Get all notes
 */
export async function GET(req: NextRequest) {
  return noteController.findAll(req);
}
