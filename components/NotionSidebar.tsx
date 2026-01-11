/**
 * NotionSidebar Component
 * Notion-style sidebar with workspace, navigation, and pages list
 * Includes notes listing in Private section
 */

'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Note } from '@/server/core/types';

function NotionSidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  // Fetch notes for sidebar
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data.slice(0, 10)); // Show last 10 notes
        setIsLoadingNotes(false);
      })
      .catch(err => {
        console.error('Failed to fetch notes:', err);
        setIsLoadingNotes(false);
      });
  }, []);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    if (href === '/home') return pathname === '/home';
    if (href === '/meetings') return pathname === '/meetings';
    if (href === '/chat') return pathname === '/chat';
    if (href === '/notes') return pathname === '/notes';
    if (href === '/audio') return pathname === '/audio';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#191919] text-[#E9E9E9] flex flex-col min-h-screen border-r border-[#2E2E2E]">
      {/* Workspace Header */}
      <div className="p-3 border-b border-[#2E2E2E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
              B
            </div>
            <span className="text-sm font-medium truncate">Badarivishal V Katti</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-[#2E2E2E] rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-1 hover:bg-[#2E2E2E] rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-[#2E2E2E]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded text-sm text-[#E9E9E9] placeholder-[#9B9B9B] focus:outline-none focus:border-[#4E4E4E]"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-2 space-y-1 border-b border-[#2E2E2E]">
        <Link
          href="/home"
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
            isActive('/home') ? 'bg-[#2E2E2E]' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>
        <Link
          href="/meetings"
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
            isActive('/meetings') ? 'bg-[#2E2E2E]' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Meetings</span>
        </Link>
        <Link
          href="/chat"
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
            isActive('/chat') ? 'bg-[#2E2E2E]' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Chat</span>
        </Link>
        <Link
          href="/notes"
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
            isActive('/notes') ? 'bg-[#2E2E2E]' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Notes</span>
        </Link>
        <Link
          href="/audio"
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
            isActive('/audio') ? 'bg-[#2E2E2E]' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span>Audio</span>
        </Link>
        <Link
          href="/"
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
            isActive('/') && !isActive('/home') ? 'bg-[#2E2E2E]' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Chat and Notes</span>
        </Link>
      </nav>

      {/* Private Pages Section */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <div className="text-xs font-semibold text-[#9B9B9B] uppercase tracking-wide">
            Private
          </div>
          <Link
            href="/notes/new"
            className="p-1 hover:bg-[#2E2E2E] rounded"
            title="New Note"
          >
            <svg className="w-4 h-4 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
        <div className="space-y-0.5">
          {isLoadingNotes ? (
            <div className="px-2 py-1.5 text-xs text-[#9B9B9B]">Loading...</div>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#2E2E2E] transition-colors ${
                  pathname === `/notes/${note.id}` ? 'bg-[#2E2E2E]' : ''
                }`}
              >
                <svg className="w-4 h-4 text-[#9B9B9B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate text-[#E9E9E9]">
                  {note.title || 'Untitled'}
                </span>
              </Link>
            ))
          ) : (
            <div className="px-2 py-1.5 text-xs text-[#9B9B9B]">No notes yet</div>
          )}
        </div>
      </div>

      {/* Shared Section */}
      <div className="p-2 border-t border-[#2E2E2E]">
        <div className="px-2 py-1 text-xs font-semibold text-[#9B9B9B] uppercase tracking-wide">
          Shared
        </div>
        <div className="mt-1">
          <button className="w-full px-2 py-1.5 text-sm text-[#E9E9E9] hover:bg-[#2E2E2E] rounded text-left">
            + Start collaborating
          </button>
        </div>
      </div>

      {/* Help */}
      <div className="p-2 border-t border-[#2E2E2E]">
        <button className="p-2 hover:bg-[#2E2E2E] rounded">
          <svg className="w-4 h-4 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export function NotionSidebar() {
  return (
    <Suspense fallback={
      <aside className="w-64 bg-[#191919] min-h-screen border-r border-[#2E2E2E]"></aside>
    }>
      <NotionSidebarContent />
    </Suspense>
  );
}
