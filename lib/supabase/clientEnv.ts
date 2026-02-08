/**
 * Supabase Client SDK Environment Configuration Loader
 * Loads and validates Supabase client credentials from environment variables
 */

export interface SupabaseClientEnv {
  url: string;
  anonKey: string;
}

/**
 * Load Supabase client environment variables
 * @throws Error if required variables are missing
 */
export function loadClientEnv(): SupabaseClientEnv {
  const env: Partial<SupabaseClientEnv> = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  if (!validateClientEnv(env)) {
    const missingVars = getMissingClientVariables(env);
    const errorMessage = `Supabase Client SDK configuration error: Missing required environment variables: ${missingVars.join(', ')}

Please ensure all required Supabase client environment variables are set in your .env.local file.
See .env.example for the required variables.

Troubleshooting:
1. Copy .env.example to .env.local
2. Fill in your Supabase credentials from Supabase Dashboard > Project Settings > API
3. Restart your development server`;

    console.error(errorMessage);
    throw new Error(`Missing Supabase client environment variables: ${missingVars.join(', ')}`);
  }

  return env as SupabaseClientEnv;
}

/**
 * Validate that all required Supabase client environment variables are present
 */
export function validateClientEnv(env: Partial<SupabaseClientEnv>): env is SupabaseClientEnv {
  return !!(
    env.url &&
    env.anonKey
  );
}

/**
 * Get list of missing client environment variables
 */
function getMissingClientVariables(env: Partial<SupabaseClientEnv>): string[] {
  const missing: string[] = [];
  
  if (!env.url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!env.anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  return missing;
}
