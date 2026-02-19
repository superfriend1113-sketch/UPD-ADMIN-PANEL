import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Update retailer status to rejected
    const { error } = await supabase
      .from('retailers')
      .update({
        status: 'rejected',
        is_active: false,
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting retailer:', error);
      return NextResponse.json({ error: 'Failed to reject retailer' }, { status: 500 });
    }

    // TODO: Send rejection email to retailer with reason

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in reject route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
