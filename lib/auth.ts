/**
 * Authentication Utilities
 * Session management and authentication helpers for admin panel using Supabase
 */

import { cookies } from 'next/headers';
import { supabase } from './supabase/clientConfig';
import { supabaseAdmin } from './supabase/adminConfig';
import type { UserProfile, UserRole } from '@/types/user';

/**
 * Create session by setting Supabase auth token
 * @param accessToken - Supabase access token from client-side authentication
 * @param refreshToken - Supabase refresh token
 * @returns Success status
 */
export async function createSession(accessToken: string, refreshToken: string): Promise<boolean> {
  try {
    // Verify the token is valid by getting user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Invalid token:', error);
      return false;
    }
    
    // Set auth cookies
    const cookieStore = await cookies();
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    
    cookieStore.set('sb-access-token', accessToken, {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    cookieStore.set('sb-refresh-token', refreshToken, {
      maxAge,
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
 * Verify session and return user info
 * @returns User info if session is valid, null otherwise
 */
export async function verifySession(): Promise<{
  uid: string;
  email: string | undefined;
} | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token');
    
    if (!accessToken?.value) {
      return null;
    }
    
    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken.value);
    
    if (error || !user) {
      return null;
    }
    
    return {
      uid: user.id,
      email: user.email,
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
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
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
 * Require authentication (use in Server Components and Server Actions)
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

/**
 * Get user profile from user_profiles table
 * @param userId - User ID to fetch profile for
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Require specific role(s) for access
 * Use in Server Components and Server Actions to enforce role-based access control
 * @param allowedRoles - Single role or array of allowed roles
 * @returns User session with profile
 * @throws Error if not authenticated or lacks required role
 */
export async function requireRole(
  allowedRoles: UserRole | UserRole[]
): Promise<{
  uid: string;
  email: string | undefined;
  profile: UserProfile;
}> {
  // First verify user is authenticated
  const session = await requireAuth();

  // Get user profile to check role
  const profile = await getUserProfile(session.uid);

  if (!profile) {
    throw new Error('User profile not found');
  }

  // Normalize allowedRoles to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user has required role
  if (!roles.includes(profile.role)) {
    throw new Error(
      `Access denied. Required role: ${roles.join(' or ')}, but user has role: ${profile.role}`
    );
  }

  return {
    ...session,
    profile,
  };
}

/**
 * Check if current user is an admin
 * @returns True if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await verifySession();
    if (!session) return false;

    const profile = await getUserProfile(session.uid);
    return profile?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Check if current user is a retailer
 * @returns True if user is retailer, false otherwise
 */
export async function isRetailer(): Promise<boolean> {
  try {
    const session = await verifySession();
    if (!session) return false;

    const profile = await getUserProfile(session.uid);
    return profile?.role === 'retailer';
  } catch {
    return false;
  }
}

/**
 * Get current user's profile
 * @returns User profile if authenticated, null otherwise
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const session = await verifySession();
    if (!session) return null;

    return await getUserProfile(session.uid);
  } catch {
    return null;
  }
}
