/**
 * Firebase Admin SDK Configuration for Admin Panel
 * Initializes and exports Firebase Admin instances for server-side operations
 * 
 * IMPORTANT: This module should ONLY be imported in server-side code:
 * - API routes (app/api/*)
 * - Server Components
 * - Server Actions
 * 
 * Never import this in client-side code as it contains sensitive credentials
 */

import * as admin from 'firebase-admin';
import { loadAdminEnv } from './adminEnv';

let adminApp: admin.app.App | undefined;

/**
 * Initialize Firebase Admin SDK with configuration from environment variables
 * Uses singleton pattern to prevent multiple initializations
 * 
 * @returns Initialized Firebase Admin App instance
 */
export function initializeAdmin(): admin.app.App {
  // Return existing app if already initialized
  if (adminApp) {
    return adminApp;
  }

  // Check if any admin apps exist
  const existingApps = admin.apps;
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  try {
    const config = loadAdminEnv();
    
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
      projectId: config.projectId,
    });

    console.log('Firebase Admin SDK initialized successfully');
    return adminApp;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Firebase Admin SDK initialization failed:', errorMessage);
    throw new Error(`Firebase Admin SDK initialization failed: ${errorMessage}`);
  }
}

/**
 * Get Admin Firestore instance
 * Initializes Firebase Admin if not already initialized
 */
export function getAdminFirestore(): admin.firestore.Firestore {
  const app = adminApp || initializeAdmin();
  return app.firestore();
}

/**
 * Get Admin Auth instance
 * Initializes Firebase Admin if not already initialized
 */
export function getAdminAuth(): admin.auth.Auth {
  const app = adminApp || initializeAdmin();
  return app.auth();
}

/**
 * Get Admin Storage instance
 * Initializes Firebase Admin if not already initialized
 */
export function getAdminStorage(): admin.storage.Storage {
  const app = adminApp || initializeAdmin();
  return app.storage();
}

/**
 * Get Firebase Admin App instance
 */
export function getAdminApp(): admin.app.App {
  return adminApp || initializeAdmin();
}
