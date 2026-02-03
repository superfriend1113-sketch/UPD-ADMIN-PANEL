/**
 * Firebase Admin SDK Environment Configuration Loader
 * Loads and validates Firebase Admin credentials from environment variables
 */

export interface FirebaseAdminEnv {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Load Firebase Admin environment variables
 * @throws Error if required variables are missing
 */
export function loadAdminEnv(): FirebaseAdminEnv {
  const env: Partial<FirebaseAdminEnv> = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  };

  if (!validateAdminEnv(env)) {
    const missingVars = getMissingAdminVariables(env);
    const errorMessage = `Firebase Admin SDK configuration error: Missing required environment variables: ${missingVars.join(', ')}

Please ensure all required Firebase Admin environment variables are set in your .env.local file.
See .env.example for the required variables.

Troubleshooting:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key" and download the JSON file
3. Extract the values and add them to your .env.local file:
   - FIREBASE_ADMIN_PROJECT_ID (from "project_id")
   - FIREBASE_ADMIN_CLIENT_EMAIL (from "client_email")
   - FIREBASE_ADMIN_PRIVATE_KEY (from "private_key")
4. Restart your development server

Note: The private key should include the full key with -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----`;

    console.error(errorMessage);
    throw new Error(`Missing Firebase Admin environment variables: ${missingVars.join(', ')}`);
  }

  // Process private key to handle escaped newlines
  const privateKey = env.privateKey!.replace(/\\n/g, '\n');

  return {
    ...env,
    privateKey,
  } as FirebaseAdminEnv;
}

/**
 * Validate that all required Firebase Admin environment variables are present
 */
export function validateAdminEnv(env: Partial<FirebaseAdminEnv>): env is FirebaseAdminEnv {
  return !!(
    env.projectId &&
    env.clientEmail &&
    env.privateKey
  );
}

/**
 * Get list of missing admin environment variables
 */
function getMissingAdminVariables(env: Partial<FirebaseAdminEnv>): string[] {
  const missing: string[] = [];
  
  if (!env.projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID');
  if (!env.clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
  if (!env.privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');
  
  return missing;
}
