/**
 * Supabase Service Role Configuration for Admin Panel
 * Initializes and exports Supabase service role client for server-side operations
 * 
 * IMPORTANT: This module should ONLY be imported in server-side code:
 * - API routes (app/api/*)
 * - Server Components
 * - Server Actions
 * 
 * Never import this in client-side code as it contains sensitive credentials
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadAdminEnv } from './adminEnv';

let adminClient: SupabaseClient | undefined;

/**
 * Initialize Supabase Service Role Client with configuration from environment variables
 * Uses singleton pattern to prevent multiple initializations
 * This client bypasses Row Level Security (RLS) policies
 * 
 * @returns Initialized Supabase Service Role Client instance
 */
export function getSupabaseAdmin(): SupabaseClient {
  // Return existing client if already initialized
  if (adminClient) {
    return adminClient;
  }

  try {
    const config = loadAdminEnv();
    
    adminClient = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('Supabase Service Role Client initialized successfully');
    return adminClient;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Supabase Service Role Client initialization failed:', errorMessage);
    throw new Error(`Supabase Service Role Client initialization failed: ${errorMessage}`);
  }
}

/**
 * Export the Supabase admin client singleton
 * Automatically initializes if not already initialized
 */
export const supabaseAdmin = getSupabaseAdmin();
