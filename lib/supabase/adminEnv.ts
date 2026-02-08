/**
 * Supabase Service Role Environment Configuration Loader
 * Loads and validates Supabase service role credentials from environment variables
 */

export interface SupabaseAdminEnv {
  url: string;
  serviceRoleKey: string;
}

/**
 * Load Supabase service role environment variables
 * @throws Error if required variables are missing
 */
export function loadAdminEnv(): SupabaseAdminEnv {
  const env: Partial<SupabaseAdminEnv> = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  if (!validateAdminEnv(env)) {
    const missingVars = getMissingAdminVariables(env);
    const errorMessage = `Supabase Service Role configuration error: Missing required environment variables: ${missingVars.join(', ')}

Please ensure all required Supabase service role environment variables are set in your .env.local file.
See .env.example for the required variables.

Troubleshooting:
1. Go to Supabase Dashboard > Project Settings > API
2. Find "service_role" key in the "Project API keys" section
3. Add it to your .env.local file as SUPABASE_SERVICE_ROLE_KEY
4. Restart your development server

WARNING: The service role key bypasses Row Level Security (RLS) policies.
NEVER expose this key in client-side code or commit it to version control.`;

    console.error(errorMessage);
    throw new Error(`Missing Supabase service role environment variables: ${missingVars.join(', ')}`);
  }

  return env as SupabaseAdminEnv;
}

/**
 * Validate that all required Supabase service role environment variables are present
 */
export function validateAdminEnv(env: Partial<SupabaseAdminEnv>): env is SupabaseAdminEnv {
  return !!(
    env.url &&
    env.serviceRoleKey
  );
}

/**
 * Get list of missing admin environment variables
 */
function getMissingAdminVariables(env: Partial<SupabaseAdminEnv>): string[] {
  const missing: string[] = [];
  
  if (!env.url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!env.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  
  return missing;
}
