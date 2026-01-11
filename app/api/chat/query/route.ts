/**
 * API Routes: Chat Query
 * POST /api/chat/query - Query notes via chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatService } from '@/server/modules/ai/chat.service';

/**
 * POST /api/chat/query
 * Query notes and get response
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const answer = await chatService.query(query);

    return NextResponse.json({ answer }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process query';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
