/**
 * Supabase Client SDK Configuration for Admin Panel
 * Initializes and exports Supabase client instance for browser-based operations
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadClientEnv } from './clientEnv';

let supabaseClient: SupabaseClient | undefined;

/**
 * Initialize Supabase Client SDK with configuration from environment variables
 * Uses singleton pattern to prevent multiple initializations
 */
export function getSupabaseClient(): SupabaseClient {
  // Return existing client if already initialized
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const config = loadClientEnv();
    
    supabaseClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    console.log('Supabase Client SDK initialized successfully');
    return supabaseClient;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Supabase Client SDK initialization failed:', errorMessage);
    throw new Error(`Supabase Client SDK initialization failed: ${errorMessage}`);
  }
}

/**
 * Export the Supabase client singleton
 * Automatically initializes if not already initialized
 */
export const supabase = getSupabaseClient();
