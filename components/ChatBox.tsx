/**
 * ChatBox Component
 * Notion-style chat interface
 */

'use client';

import { useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  initialMessages?: Message[];
}

export function ChatBox({ initialMessages = [] }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (query: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call chat API
      const response = await fetch('/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.answer };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${message}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#1F1F1F] border border-[#2E2E2E] rounded-lg">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 text-[#9B9B9B] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#E9E9E9] mb-2">How can I help you today?</h3>
            <p className="text-sm text-[#9B9B9B]">Ask questions about your notes</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-[#9B9B9B]">
            <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2E2E2E] p-4">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
