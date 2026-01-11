/**
 * Supabase client
 * Single source of truth for database connections
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

// Database types (can be generated from Supabase)
export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          type: 'text' | 'voice';
          title: string | null;
          content: string | null;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'text' | 'voice';
          title?: string | null;
          content?: string | null;
          summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'text' | 'voice';
          title?: string | null;
          content?: string | null;
          summary?: string | null;
          created_at?: string;
        };
      };
      audio_jobs: {
        Row: {
          id: string;
          note_id: string;
          status: 'pending' | 'processing' | 'done' | 'failed';
          audio_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          status?: 'pending' | 'processing' | 'done' | 'failed';
          audio_path: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          status?: 'pending' | 'processing' | 'done' | 'failed';
          audio_path?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Client-side Supabase client (for browser)
export function createSupabaseClient() {
  return createClient<Database>(
    config.supabase.url,
    config.supabase.anonKey
  );
}

// Server-side Supabase client (for API routes and server components)
export function createServerSupabaseClient() {
  return createClient<Database>(
    config.supabase.url,
    config.supabase.serviceRoleKey || config.supabase.anonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
