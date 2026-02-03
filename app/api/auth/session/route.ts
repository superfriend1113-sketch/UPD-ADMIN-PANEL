/**
 * Session API Route
 * Handles session cookie creation and deletion
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSession, destroySession } from '@/lib/auth';

/**
 * POST /api/auth/session
 * Create session cookie from Firebase ID token
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    const success = await createSession(idToken);
    
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
