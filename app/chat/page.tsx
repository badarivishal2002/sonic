/**
 * Chat Page
 * Dedicated chat interface for querying notes
 * Separated from other areas
 */

'use client';

import { PageHeader } from '@/components/PageHeader';
import { ChatBox } from '@/components/ChatBox';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader title="Chat" />
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-6 p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg">
          <h2 className="text-lg font-semibold text-[#E9E9E9] mb-2">Ask Questions About Your Notes</h2>
          <p className="text-sm text-[#9B9B9B]">
            Use this chat interface to search through and query your notes. Ask questions and get answers based on your note content.
          </p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
}
