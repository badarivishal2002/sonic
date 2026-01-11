/**
 * VoiceCaptureBar Component
 * Fixed bottom voice capture bar
 * Inline, always visible, never disruptive
 * Notion-style dark theme
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceCaptureBarProps {
  noteId: string | null;
  onTranscriptComplete?: (transcript: string, summary: string) => void;
}

export function VoiceCaptureBar({ noteId, onTranscriptComplete }: VoiceCaptureBarProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
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

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      // Process audio if we have a note
      if (noteId && audioChunksRef.current.length > 0) {
        await processAudio();
      } else {
        // Create note first, then process
        await createNoteAndProcess();
      }
    }
  };

  const createNoteAndProcess = async () => {
    try {
      // Create note
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'voice',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const note = await response.json();
      await processAudioWithNote(note.id);
    } catch (error) {
      console.error('Failed to create note:', error);
      setIsProcessing(false);
    }
  };

  const processAudio = async () => {
    if (!noteId) {
      await createNoteAndProcess();
      return;
    }
    await processAudioWithNote(noteId);
  };

  const pollForTranscript = async (currentNoteId: string, maxAttempts = 20) => {
    let attempts = 0;

    const poll = async (): Promise<{ transcript: string; summary: string } | null> => {
      attempts++;

      try {
        const noteResponse = await fetch(`/api/notes/${currentNoteId}`);
        if (!noteResponse.ok) {
          return null;
        }

        const note = await noteResponse.json();
        if (note.content && note.summary) {
          return { transcript: note.content, summary: note.summary };
        }
      } catch (error) {
        console.error('Failed to poll note:', error);
      }

      if (attempts >= maxAttempts) {
        return null;
      }

      // Poll again after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return poll();
    };

    return poll();
  };

  const processAudioWithNote = async (currentNoteId: string) => {
    setIsProcessing(true);

    try {
      // Create blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm',
      });

      // Upload audio
      const formData = new FormData();
      formData.append('audio', audioFile);

      const uploadResponse = await fetch(`/api/notes/${currentNoteId}/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Failed to upload audio');
      }

      // Process audio (async - doesn't wait for completion)
      const processResponse = await fetch(`/api/notes/${currentNoteId}/process`, {
        method: 'POST',
      });

      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Failed to process audio');
      }

      // Poll for transcript and summary
      const result = await pollForTranscript(currentNoteId);
      if (result) {
        onTranscriptComplete?.(result.transcript, result.summary);
      }

      // Reset
      audioChunksRef.current = [];
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to process audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-[#2E2E2E] border-t border-[#3E3E3E] px-6 py-3 flex items-center justify-center gap-4 z-10">
      {!isRecording && !isProcessing && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 text-[#E9E9E9] hover:text-white hover:bg-[#3E3E3E] rounded transition-colors"
        >
          <span className="text-xl">🎙</span>
          <span>Speak</span>
        </button>
      )}

      {isRecording && (
        <>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 text-[#E9E9E9] hover:text-white hover:bg-[#3E3E3E] rounded transition-colors"
          >
            <span className="text-xl">⏹</span>
            <span>Stop</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-[#9B9B9B]">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>
        </>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-[#9B9B9B]">
          <span>⏳</span>
          <span>Transcribing…</span>
        </div>
      )}
    </div>
  );
}
