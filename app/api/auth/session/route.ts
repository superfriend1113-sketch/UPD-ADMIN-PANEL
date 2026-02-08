/**
 * Session API Route
 * Handles session cookie creation and deletion
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSession, destroySession } from '@/lib/auth';

/**
 * POST /api/auth/session
 * Create session cookie from Supabase access and refresh tokens
 */
export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json();
    
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Access token and refresh token are required' },
        { status: 400 }
      );
    }
    
    const success = await createSession(accessToken, refreshToken);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Destroy session cookie (logout)
 */
export async function DELETE() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
