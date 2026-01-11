/**
 * API Routes: Audio Upload
 * POST /api/notes/:id/audio - Upload audio file for a note
 */

import { NextRequest } from 'next/server';
import { audioController } from '@/server/modules/audio/audio.controller';

/**
 * POST /api/notes/:id/audio
 * Upload audio file for a note
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return audioController.uploadAudio(req, id);
}
