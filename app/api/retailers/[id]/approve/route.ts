import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Parse request body for notes (optional)
    let notes = 'Approved by admin review';
    try {
      const body = await request.json();
      if (body.notes) {
        notes = body.notes;
      }
    } catch {
      // Body is optional, use default notes
    }
    
    const supabase = await createClient();

    // Update retailer status to approved
    const { error } = await supabase
      .from('retailers')
      .update({
        status: 'approved',
        is_active: true,
        approval_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error approving retailer:', error);
      return NextResponse.json({ error: 'Failed to approve retailer' }, { status: 500 });
    }

    // TODO: Send approval email to retailer

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in approve route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
