/**
 * Firebase Client SDK Configuration for Admin Panel
 * Initializes and exports Firebase client instances for browser-based operations
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { loadClientEnv } from './clientEnv';

let app: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

/**
 * Initialize Firebase Client SDK with configuration from environment variables
 * Uses singleton pattern to prevent multiple initializations
 */
export function initializeFirebase(): FirebaseApp {
  // Return existing app if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  try {
    const config = loadClientEnv();
    
    app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });

    console.log('Firebase Client SDK initialized successfully');
    return app;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Firebase Client SDK initialization failed:', errorMessage);
    throw new Error(`Firebase Client SDK initialization failed: ${errorMessage}`);
  }
}

/**
 * Get Firestore instance
 * Initializes Firebase if not already initialized
 */
export function getFirestoreInstance(): Firestore {
  if (!firestore) {
    const firebaseApp = app || initializeFirebase();
    firestore = getFirestore(firebaseApp);
  }
  return firestore;
}

/**
 * Get Auth instance
 * Initializes Firebase if not already initialized
 */
export function getAuthInstance(): Auth {
  if (!auth) {
    const firebaseApp = app || initializeFirebase();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

/**
 * Get Storage instance
 * Initializes Firebase if not already initialized
 */
export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    const firebaseApp = app || initializeFirebase();
    storage = getStorage(firebaseApp);
  }
  return storage;
}

/**
 * Get Firebase App instance
 */
export function getFirebaseApp(): FirebaseApp {
  return app || initializeFirebase();
}

// Initialize Firebase on module load (client-side only)
if (typeof window !== 'undefined') {
  initializeFirebase();
}
