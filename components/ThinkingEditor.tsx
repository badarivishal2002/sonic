/**
 * ThinkingEditor Component
 * Main thinking surface - auto-saving text editor
 * Auto-focused, always saving, no buttons or modes
 */

'use client';

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ThinkingEditorHandle {
  insertText: (text: string) => void;
}

interface ThinkingEditorProps {
  initialContent?: string;
  noteId?: string;
  onContentChange?: (content: string, noteId: string) => void;
  onNoteCreated?: (noteId: string) => void;
}

export const ThinkingEditor = forwardRef<ThinkingEditorHandle, ThinkingEditorProps>(
  ({ initialContent = '', noteId: initialNoteId, onContentChange, onNoteCreated }, ref) => {
    const [content, setContent] = useState(initialContent);
    const [noteId, setNoteId] = useState<string | null>(initialNoteId || null);
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync noteId prop changes
    useEffect(() => {
      if (initialNoteId && initialNoteId !== noteId) {
        setNoteId(initialNoteId);
      }
    }, [initialNoteId]);

    // Expose insertText method via ref
    useImperativeHandle(ref, () => ({
      insertText: (text: string) => {
        insertTextAtCursor(text);
      },
    }));

    // Auto-focus on mount
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, []);

    // Auto-save logic
    useEffect(() => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Only save if there's content
      if (!content.trim() && !noteId) {
        return;
      }

      // Debounce save by 1 second
      saveTimeoutRef.current = setTimeout(async () => {
        await saveContent(content);
      }, 1000);

      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
      };
    }, [content, noteId]);

    const insertTextAtCursor = (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;
      const newText = currentText.substring(0, start) + text + currentText.substring(end);

      setContent(newText);
      textarea.focus();

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    };

    const saveContent = async (text: string) => {
      setIsSaving(true);

      try {
        if (noteId) {
          // Update existing note
          const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: text.trim() || undefined,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save note');
          }

          onContentChange?.(text, noteId);
        } else if (text.trim()) {
          // Create new note
          const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'text',
              content: text.trim(),
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create note');
          }

          const note = await response.json();
          setNoteId(note.id);
          onNoteCreated?.(note.id);
          onContentChange?.(text, note.id);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="What's on your mind?"
          className="flex-1 w-full resize-none border-0 outline-none text-lg leading-relaxed p-8 bg-transparent placeholder:text-gray-400 focus:ring-0"
          style={{ minHeight: '400px' }}
        />
        {isSaving && (
          <div className="px-8 pb-4 text-xs text-gray-400">Saving...</div>
        )}
      </div>
    );
  }
);

ThinkingEditor.displayName = 'ThinkingEditor';
