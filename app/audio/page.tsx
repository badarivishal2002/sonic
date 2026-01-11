/**
 * Audio/Transcription Page
 * Dedicated page for audio recording and transcription
 * Separated from chat and notes
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';

export default function AudioPage() {
  const router = useRouter();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
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

      await processAudio();
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);

    try {
      // Create note first
      const noteResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'voice',
        }),
      });

      if (!noteResponse.ok) {
        throw new Error('Failed to create note');
      }

      const note = await noteResponse.json();
      setCurrentNoteId(note.id);
      onNoteIdChange?.(note.id);

      // Create blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm',
      });

      // Upload audio
      const formData = new FormData();
      formData.append('audio', audioFile);

      const uploadResponse = await fetch(`/api/notes/${note.id}/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Failed to upload audio');
      }

      // Process audio
      const processResponse = await fetch(`/api/notes/${note.id}/process`, {
        method: 'POST',
      });

      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Failed to process audio');
      }

      // Poll for transcript and summary
      await pollForTranscript(note.id);
    } catch (error) {
      console.error('Failed to process audio:', error);
      setIsProcessing(false);
    }
  };

  const pollForTranscript = async (noteId: string, maxAttempts = 20) => {
    let attempts = 0;

    const poll = async (): Promise<void> => {
      attempts++;

      try {
        const noteResponse = await fetch(`/api/notes/${noteId}`);
        if (!noteResponse.ok) {
          return;
        }

        const note = await noteResponse.json();
        if (note.content && note.summary) {
          setTranscript(note.content);
          setSummary(note.summary);
          setIsProcessing(false);
          return;
        }
      } catch (error) {
        console.error('Failed to poll note:', error);
      }

      if (attempts >= maxAttempts) {
        setIsProcessing(false);
        return;
      }

      // Poll again after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return poll();
    };

    return poll();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!currentNoteId || !transcript) return;

    try {
      const response = await fetch(`/api/notes/${currentNoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Voice Note - ${new Date().toLocaleDateString()}`,
        }),
      });

      if (response.ok) {
        router.push(`/notes/${currentNoteId}`);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader title="Audio Transcription" />
      
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Instructions */}
          <div className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg">
            <h2 className="text-lg font-semibold text-[#E9E9E9] mb-2">Record Audio</h2>
            <p className="text-sm text-[#9B9B9B]">
              Click the "Start Recording" button below to begin. Your audio will be automatically transcribed and summarized.
            </p>
          </div>

          {/* Recording Controls */}
          <div className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg">
            {!isRecording && !isProcessing && (
              <button
                onClick={startRecording}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-2xl">🎙</span>
                <span>Start Recording</span>
              </button>
            )}

            {isRecording && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-mono font-bold text-[#E9E9E9]">{formatTime(recordingTime)}</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  <span className="text-xl">⏹</span>
                  <span>Stop Recording</span>
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-3 text-[#9B9B9B]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span>Transcribing…</span>
              </div>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="space-y-4">
              <div className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg">
                <h3 className="text-sm font-semibold text-[#E9E9E9] mb-3">Transcript</h3>
                <div className="text-[#E9E9E9] whitespace-pre-wrap leading-relaxed">
                  {transcript}
                </div>
              </div>

              {summary && (
                <div className="p-6 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg">
                  <h3 className="text-sm font-semibold text-[#E9E9E9] mb-3">Summary</h3>
                  <div className="text-sm text-[#9B9B9B] whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                >
                  Save as Note
                </button>
                <button
                  onClick={() => {
                    setTranscript(null);
                    setSummary(null);
                    setCurrentNoteId(null);
                    audioChunksRef.current = [];
                  }}
                  className="px-6 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] text-[#E9E9E9] text-sm font-medium rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {!transcript && !isProcessing && !isRecording && (
            <div className="text-center py-12 text-[#9B9B9B]">
              <p>No transcript yet. Start recording to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
