/**
 * Thinking Surface (Chat and Notes)
 * Main entry point - unified thinking surface with Notion-style header
 * Auto-focused, auto-saving, seamless text and voice input
 */

'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThinkingEditor, ThinkingEditorHandle } from '@/components/ThinkingEditor';
import { VoiceCaptureBar } from '@/components/VoiceCaptureBar';
import { PageHeader } from '@/components/PageHeader';

function ThinkingSurfaceContent() {
  const searchParams = useSearchParams();
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const editorRef = useRef<ThinkingEditorHandle>(null);

  // Get date from query params or use today
  const getDateString = (): string => {
    const dateParam = searchParams?.get('date');
    if (dateParam) {
      try {
        const date = new Date(dateParam + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        // Fallback to today if invalid date
      }
    }

    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const dateString = getDateString();

  const handleTranscriptComplete = (transcript: string, transcriptSummary: string) => {
    // Insert transcript at cursor position
    if (editorRef.current) {
      editorRef.current.insertText(transcript + '\n\n');
    }

    // Set summary
    setSummary(transcriptSummary);
    setShowSummary(true);
  };

  const handleContentChange = (content: string, noteId: string) => {
    setNoteContent(content);
    setCurrentNoteId(noteId);
  };

  const handleNoteCreated = (noteId: string) => {
    setCurrentNoteId(noteId);
  };

  const handleShare = () => {
    if (currentNoteId) {
      navigator.clipboard.writeText(`${window.location.origin}/notes/${currentNoteId}`);
      // You could show a toast notification here
    }
  };

  const handleDelete = async () => {
    if (currentNoteId && confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`/api/notes/${currentNoteId}`, { method: 'DELETE' });
        setCurrentNoteId(null);
        setNoteContent('');
        setSummary(null);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1F1F1F]">
      <PageHeader
        title={dateString}
        noteId={currentNoteId}
        onShare={currentNoteId ? handleShare : undefined}
        onDelete={currentNoteId ? handleDelete : undefined}
        onStar={() => setIsStarred(!isStarred)}
        isStarred={isStarred}
      />

      {/* Middle: Thinking Editor */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <ThinkingEditor
          ref={editorRef}
          initialContent={noteContent}
          noteId={currentNoteId || undefined}
          onContentChange={handleContentChange}
          onNoteCreated={handleNoteCreated}
        />

        {/* Summary (if exists) */}
        {summary && showSummary && (
          <div className="mt-8 pt-8 border-t border-[#2E2E2E]">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="text-sm font-medium text-[#9B9B9B] hover:text-[#E9E9E9] mb-2 flex items-center gap-1"
            >
              <span>{showSummary ? '▼' : '▶'}</span>
              <span>Summary</span>
            </button>
            {showSummary && (
              <div className="text-sm text-[#9B9B9B] whitespace-pre-wrap leading-relaxed">
                {summary}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Voice Capture Bar */}
      <VoiceCaptureBar
        noteId={currentNoteId}
        onTranscriptComplete={handleTranscriptComplete}
      />

      {/* Spacer for fixed bottom bar */}
      <div className="h-16"></div>
    </div>
  );
}

export default function ThinkingSurface() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-screen bg-[#1F1F1F]">
        <PageHeader title="Loading..." />
      </div>
    }>
      <ThinkingSurfaceContent />
    </Suspense>
  );
}
