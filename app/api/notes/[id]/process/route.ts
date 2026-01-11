/**
 * API Routes: Audio Processing
 * POST /api/notes/:id/process - Process audio for a note (transcribe and generate summary)
 */

import { NextRequest } from 'next/server';
import { audioController } from '@/server/modules/audio/audio.controller';

/**
 * POST /api/notes/:id/process
 * Process audio for a note
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return audioController.processAudio(req, id);
}
