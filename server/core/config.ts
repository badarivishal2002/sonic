/**
 * Core configuration
 * Centralized configuration management
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  storage: {
    audioBucket: 'audio',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
} as const;

// Validate required environment variables
if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
