/**
 * ChatMessage Component
 * Notion-style chat message display
 */

'use client';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-[#2E2E2E] text-[#E9E9E9] border border-[#3E3E3E]'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
