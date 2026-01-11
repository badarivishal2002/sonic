/**
 * NoteEditor Component
 * Form component for creating notes
 * Supports text notes and voice notes (recording + upload)
 * Improved UI for clarity and discoverability
 */

'use client';

import { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { AudioUpload } from './AudioUpload';

interface NoteEditorProps {
  onSave?: (note: any) => void;
  onCancel?: () => void;
}

export function NoteEditor({ onSave, onCancel }: NoteEditorProps) {
  const [noteType, setNoteType] = useState<'text' | 'voice'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdNoteId, setCreatedNoteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: noteType,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const note = await response.json();
      setCreatedNoteId(note.id);
      onSave?.(note);

      // Redirect to note detail page
      if (note.id && noteType === 'text') {
        window.location.href = `/notes/${note.id}`;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAudioUploadComplete = (audioJob: any) => {
    // Audio uploaded and processing started
    // Redirect to note detail page after a short delay
    if (createdNoteId) {
      setTimeout(() => {
        window.location.href = `/notes/${createdNoteId}`;
      }, 2000);
    }
  };

  const handleCreateVoiceNote = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'voice',
          title: title.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const note = await response.json();
      setCreatedNoteId(note.id);
      onSave?.(note);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Note</h1>
      <p className="text-gray-600 mb-8">Create a text note or add voice with recording or upload</p>

      {/* Note Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Note Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-3 px-6 py-4 border-2 rounded-lg cursor-pointer transition-colors flex-1 text-center hover:bg-gray-50">
            <input
              type="radio"
              name="noteType"
              value="text"
              checked={noteType === 'text'}
              onChange={(e) => {
                setNoteType(e.target.value as 'text' | 'voice');
                setCreatedNoteId(null);
                setError(null);
              }}
              className="w-5 h-5 text-blue-600"
            />
            <span className="font-medium text-gray-900">📝 Text Note</span>
          </label>
          <label className="flex items-center gap-3 px-6 py-4 border-2 rounded-lg cursor-pointer transition-colors flex-1 text-center hover:bg-gray-50">
            <input
              type="radio"
              name="noteType"
              value="voice"
              checked={noteType === 'voice'}
              onChange={(e) => {
                setNoteType(e.target.value as 'text' | 'voice');
                setCreatedNoteId(null);
                setError(null);
              }}
              className="w-5 h-5 text-blue-600"
            />
            <span className="font-medium text-gray-900">🎤 Voice Note</span>
          </label>
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-8">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Title (optional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder="Enter note title..."
        />
      </div>

      {/* Text Note Editor */}
      {noteType === 'text' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
              placeholder="Enter your note content..."
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {isSaving ? 'Saving...' : '✓ Save Note'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="px-8 py-4 bg-gray-200 text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Voice Note Editor */}
      {noteType === 'voice' && (
        <div className="space-y-8">
          {!createdNoteId ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Create a voice note placeholder first, then record or upload your audio.
              </p>
              <button
                type="button"
                onClick={handleCreateVoiceNote}
                disabled={isSaving}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                {isSaving ? 'Creating...' : 'Create Voice Note'}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">✓ Voice note created</p>
                <p className="text-xs text-blue-700 mt-1">Now record or upload your audio</p>
              </div>

              {/* Record Audio Section */}
              <div>
                <AudioRecorder
                  noteId={createdNoteId}
                  onUploadComplete={handleAudioUploadComplete}
                  onError={(err) => setError(err)}
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              {/* Upload Audio Section */}
              <div>
                <AudioUpload
                  noteId={createdNoteId}
                  onUploadComplete={handleAudioUploadComplete}
                  onError={(err) => setError(err)}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
