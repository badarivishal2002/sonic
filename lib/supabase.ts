/**
 * Supabase Client (Frontend)
 * Client-side Supabase instance for browser usage
 */

import { createSupabaseClient } from '@/server/core/db/client';

export const supabase = createSupabaseClient();
