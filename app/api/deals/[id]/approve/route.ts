/**
 * API Route: Approve Deal
 * Approves a pending deal (clears from flagged inventory)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { notes } = await request.json();

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update deal status to approved
    const { error } = await supabase
      .from('deals')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
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
