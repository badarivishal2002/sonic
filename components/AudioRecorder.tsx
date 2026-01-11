/**
 * AudioRecorder Component
 * Client-side audio recorder for voice notes
 * Uses MediaRecorder API - Improved UI with bigger buttons and clearer states
 */

'use client';

import { useState, useRef } from 'react';

interface AudioRecorderProps {
  noteId: string;
  onUploadComplete?: (audioJob: any) => void;
  onError?: (error: string) => void;
}

export function AudioRecorder({ noteId, onUploadComplete, onError }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start recording audio
   */
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start recording. Please allow microphone access.';
      setError(message);
      onError?.(message);
    }
  };

  /**
   * Stop recording audio
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  /**
   * Upload and process audio
   */
  const uploadAndProcess = async () => {
    if (audioChunksRef.current.length === 0) {
      const message = 'No audio recorded';
      setError(message);
      onError?.(message);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm',
      });

      // Upload audio
      const formData = new FormData();
      formData.append('audio', audioFile);

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
      audioChunksRef.current = [];
      setRecordingTime(0);
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
   * Format recording time (seconds to MM:SS)
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Cancel recording
   */
  const cancelRecording = () => {
    stopRecording();
    audioChunksRef.current = [];
    setRecordingTime(0);
    setError(null);
  };

  const hasRecordedAudio = audioChunksRef.current.length > 0 && !isRecording;
  const isDisabled = isUploading || isProcessing;

  return (
    <div className="border border-gray-300 rounded-lg bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Voice</h3>

      {/* Recording State */}
      {isRecording && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-2xl font-mono font-bold text-gray-900">{formatTime(recordingTime)}</span>
          </div>
          <button
            onClick={stopRecording}
            className="w-full px-6 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            ⏹ Stop Recording
          </button>
          <p className="text-center text-sm text-gray-600">Recording in progress...</p>
        </div>
      )}

      {/* Idle State - Start Recording */}
      {!isRecording && !hasRecordedAudio && (
        <div className="space-y-4">
          <button
            onClick={startRecording}
            disabled={isDisabled}
            className="w-full px-6 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            🎤 Start Recording
          </button>
          <p className="text-center text-sm text-gray-600">Click to start recording your voice</p>
        </div>
      )}

      {/* Recorded Audio - Upload */}
      {hasRecordedAudio && !isRecording && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">Recording Complete</p>
            <p className="text-xs text-gray-500">Duration: {formatTime(recordingTime)}</p>
          </div>
          <button
            onClick={uploadAndProcess}
            disabled={isDisabled}
            className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {isUploading
              ? '⏳ Uploading...'
              : isProcessing
              ? '⏳ Processing...'
              : '✓ Upload & Process'}
          </button>
          <button
            onClick={cancelRecording}
            disabled={isDisabled}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel & Record Again
          </button>
        </div>
      )}

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
