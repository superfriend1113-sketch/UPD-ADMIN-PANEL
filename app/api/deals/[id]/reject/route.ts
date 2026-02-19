/**
 * API Route: Reject Deal
 * Rejects a pending deal from flagged inventory
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update deal status to rejected
    const { error } = await supabase
      .from('deals')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        is_active: false,
      })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting deal:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Deal rejected successfully' 
    });
  } catch (error) {
    console.error('Error in reject route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
