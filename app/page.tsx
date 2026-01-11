/**
 * Thinking Surface
 * Main entry point - single unified thinking surface
 * Auto-focused, auto-saving, seamless text and voice input
 */

'use client';

import { useState, useRef } from 'react';
import { ThinkingEditor, ThinkingEditorHandle } from '@/components/ThinkingEditor';
import { VoiceCaptureBar } from '@/components/VoiceCaptureBar';

/**
 * Main Thinking Surface
 * Single unified interface for thinking and planning
 */
export default function ThinkingSurface() {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);
  const editorRef = useRef<ThinkingEditorHandle>(null);

  // Get today's date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top: Context */}
      <div className="px-8 pt-12 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-normal text-gray-900">Today</h1>
        <p className="text-sm text-gray-500 mt-1">{dateString}</p>
      </div>

      {/* Middle: Thinking Editor */}
      <div className="flex-1 overflow-y-auto">
        <ThinkingEditor
          ref={editorRef}
          initialContent={noteContent}
          noteId={currentNoteId || undefined}
          onContentChange={handleContentChange}
          onNoteCreated={handleNoteCreated}
        />

        {/* Summary (if exists) */}
        {summary && showSummary && (
          <div className="px-8 pb-8 pt-4 border-t border-gray-100 mt-8">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
            >
              <span>{showSummary ? '▼' : '▶'}</span>
              <span>Summary</span>
            </button>
            {showSummary && (
              <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
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
