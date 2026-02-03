/**
 * Authentication Utilities
 * Session management and authentication helpers for admin panel
 */

import { cookies } from 'next/headers';
import { getAdminAuth } from './firebase/adminConfig';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

/**
 * Create session cookie from Firebase ID token
 * @param idToken - Firebase ID token from client-side authentication
 * @returns Success status
 */
export async function createSession(idToken: string): Promise<boolean> {
  try {
    const auth = getAdminAuth();
    
    // Verify the ID token and create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });
    
    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_DURATION / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
}

/**
 * Verify session cookie and return user info
 * @returns User info if session is valid, null otherwise
 */
export async function verifySession(): Promise<{
  uid: string;
  email: string | undefined;
} | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    const auth = getAdminAuth();
    
    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie.value, true);
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

/**
 * Destroy session cookie (logout)
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error('Error destroying session:', error);
  }
}

/**
 * Check if user is authenticated
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await verifySession();
  return session !== null;
}

/**
 * Require authentication (use in Server Components)
 * Throws error if not authenticated
 */
export async function requireAuth(): Promise<{
  uid: string;
  email: string | undefined;
}> {
  const session = await verifySession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}
