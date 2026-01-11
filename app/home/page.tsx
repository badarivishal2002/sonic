/**
 * Home Dashboard
 * Notion-style home page with recently visited, learn, and upcoming events
 */

'use client';

import { PageHeader } from '@/components/PageHeader';
import { useEffect, useState } from 'react';
import { Note } from '@/server/core/types';
import Link from 'next/link';

export default function HomePage() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Fetch recent notes
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        // Get last 4 notes
        setRecentNotes(data.slice(0, 4));
      })
      .catch(err => console.error('Failed to fetch notes:', err));
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader title="Home" />
      
      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Greeting */}
        <h1 className="text-4xl font-bold text-[#E9E9E9] mb-8">{greeting}</h1>

        {/* Recently Visited */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-[#E9E9E9]">Recently visited</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="flex-shrink-0 w-64 p-4 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <svg className="w-5 h-5 text-[#9B9B9B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#E9E9E9] truncate">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-[#9B9B9B] mt-1">{formatDate(note.created_at)}</p>
                    </div>
                  </div>
                  {note.summary && (
                    <p className="text-xs text-[#9B9B9B] line-clamp-2 mt-2">{note.summary}</p>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-sm text-[#9B9B9B]">No recent notes</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-[#E9E9E9] mb-4">Quick actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <Link
              href="/"
              className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium text-[#E9E9E9]">New Note</span>
              </div>
              <p className="text-xs text-[#9B9B9B]">Start writing</p>
            </Link>
            <Link
              href="/chat"
              className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium text-[#E9E9E9]">Chat</span>
              </div>
              <p className="text-xs text-[#9B9B9B]">Ask questions</p>
            </Link>
            <Link
              href="/meetings"
              className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-[#E9E9E9]">Meetings</span>
              </div>
              <p className="text-xs text-[#9B9B9B]">View meetings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
