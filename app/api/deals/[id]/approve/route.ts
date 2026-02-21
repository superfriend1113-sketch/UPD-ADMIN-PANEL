/**
 * API Route: Approve Deal
 * Approves a pending deal (clears from flagged inventory)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/adminConfig';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { notes } = await request.json();

    // Get current user for audit trail (using regular auth)
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      userId = user?.id;
    }

    // Update deal status to approved using admin client (bypasses RLS)
    const { error } = await supabaseAdmin
      .from('deals')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: userId,
        is_active: true,
      })
      .eq('id', id);

    if (error) {
      console.error('Error approving deal:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Deal approved successfully' 
    });
  } catch (error) {
    console.error('Error in approve route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
