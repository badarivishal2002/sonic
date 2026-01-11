/**
 * Chat Page
 * Global chat interface for querying notes
 */

'use client';

import { ChatBox } from '@/components/ChatBox';

/**
 * Chat Page Component
 * Client component that renders the chat interface
 */
export default function ChatPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ height: '600px' }}>
      <ChatBox />
    </div>
  );
}
