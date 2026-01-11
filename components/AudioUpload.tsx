/**
 * AudioUpload Component
 * Client-side audio file upload for voice notes
 * Allows users to select and upload audio files - Improved UI with clear file picker and progress
 */

'use client';

import { useState, useRef } from 'react';

interface AudioUploadProps {
  noteId: string;
  onUploadComplete?: (audioJob: any) => void;
  onError?: (error: string) => void;
}

export function AudioUpload({ noteId, onUploadComplete, onError }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        const message = 'Please select an audio file (mp3, wav, m4a, etc.)';
        setError(message);
        onError?.(message);
        return;
      }
      setSelectedFile(file);
    }
  };

  /**
   * Upload and process audio file
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      const message = 'Please select an audio file';
      setError(message);
      onError?.(message);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload audio
      const formData = new FormData();
      formData.append('audio', selectedFile);

      const uploadResponse = await fetch(`/api/notes/${noteId}/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Failed to upload audio');
      }

      const audioJob = await uploadResponse.json();
      onUploadComplete?.(audioJob);

      // Process audio
      setIsProcessing(true);
      const processResponse = await fetch(`/api/notes/${noteId}/process`, {
        method: 'POST',
      });

      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Failed to process audio');
      }

      // Reset
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload/process audio';
      setError(message);
      onError?.(message);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  /**
   * Clear selected file
   */
  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isDisabled = isUploading || isProcessing;

  return (
    <div className="border border-gray-300 rounded-lg bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Audio File</h3>

      {/* File Input */}
      <div className="mb-4">
        <label className="block">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={isDisabled}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          Supported formats: MP3, WAV, M4A, OGG, WEBM
        </p>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'audio file'}
              </p>
            </div>
            {!isDisabled && (
              <button
                onClick={handleClear}
                className="ml-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
                title="Remove file"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isDisabled}
        className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {isUploading
          ? '⏳ Uploading...'
          : isProcessing
          ? '⏳ Processing...'
          : '✓ Upload & Process'}
      </button>

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Processing audio...</p>
          <p className="text-xs text-blue-700 mt-1">Transcribing and generating summary</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-900">Error</p>
          <p className="text-xs text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}
