'use server';

/**
 * Retailer Server Actions
 */

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '../supabase/adminConfig';
import { validateRetailer, isSlugUnique, generateSlug } from '../validations';
import { requireRole } from '../auth';
import type { ActionResult, Retailer } from '../types';

export async function createRetailer(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole('admin');
    
    const retailerData: Partial<Retailer> = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      logoUrl: formData.get('logoUrl') as string,
      websiteUrl: formData.get('websiteUrl') as string,
      commission: formData.get('commission') as string,
      isActive: formData.get('isActive') === 'true',
    };
    
    const affiliateId = formData.get('affiliateId') as string;
    if (affiliateId) retailerData.affiliateId = affiliateId;
    
    const validation = validateRetailer(retailerData);
    if (!validation.isValid) {
      return { success: false, message: 'Validation failed', errors: validation.errors };
    }
    
    const slugUnique = await isSlugUnique(retailerData.slug!, 'retailers');
    if (!slugUnique) {
      return { success: false, message: 'Validation failed', errors: { slug: 'This slug is already in use' } };
    }
    
    const { uid } = await requireRole('admin');
    
    const { error } = await supabaseAdmin
      .from('retailers')
      .insert({
        name: retailerData.name,
        slug: retailerData.slug,
        logo_url: retailerData.logoUrl,
        website_url: retailerData.websiteUrl,
        commission: retailerData.commission,
        affiliate_id: retailerData.affiliateId || null,
        is_active: retailerData.isActive,
        deal_count: 0,
        // Admin-created retailers are automatically approved
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: uid,
      });
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, message: error.message || 'Failed to create retailer' };
    }
    
    revalidatePath('/retailers');
    revalidatePath('/deals');
    
    return { success: true, message: 'Retailer created successfully' };
  } catch (error) {
    console.error('Error creating retailer:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create retailer' };
  }
}

export async function updateRetailer(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireRole('admin');
    
    const retailerData: Partial<Retailer> = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      logoUrl: formData.get('logoUrl') as string,
      websiteUrl: formData.get('websiteUrl') as string,
      commission: formData.get('commission') as string,
      isActive: formData.get('isActive') === 'true',
    };
    
    const affiliateId = formData.get('affiliateId') as string;
    if (affiliateId) retailerData.affiliateId = affiliateId;
    
    const validation = validateRetailer(retailerData);
    if (!validation.isValid) {
      return { success: false, message: 'Validation failed', errors: validation.errors };
    }
    
    const slugUnique = await isSlugUnique(retailerData.slug!, 'retailers', id);
    if (!slugUnique) {
      return { success: false, message: 'Validation failed', errors: { slug: 'This slug is already in use' } };
    }
    
    const { error } = await supabaseAdmin
      .from('retailers')
      .update({
        name: retailerData.name,
        slug: retailerData.slug,
        logo_url: retailerData.logoUrl,
        website_url: retailerData.websiteUrl,
        commission: retailerData.commission,
        affiliate_id: retailerData.affiliateId || null,
        is_active: retailerData.isActive,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return { success: false, message: 'Retailer not found' };
      }
      return { success: false, message: error.message || 'Failed to update retailer' };
    }
    
    revalidatePath('/retailers');
    revalidatePath('/deals');
    
    return { success: true, message: 'Retailer updated successfully' };
  } catch (error) {
    console.error('Error updating retailer:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to update retailer' };
  }
}

export async function deleteRetailer(id: string): Promise<ActionResult> {
  try {
    await requireRole('admin');
    
    // First check if retailer has deals
    const { data: retailer, error: fetchError } = await supabaseAdmin
      .from('retailers')
      .select('deal_count')
      .eq('id', id)
      .single();
    
    if (fetchError || !retailer) {
      return { success: false, message: 'Retailer not found' };
    }
    
    const dealCount = retailer.deal_count || 0;
    if (dealCount > 0) {
      return { success: false, message: `Cannot delete retailer with ${dealCount} associated deal(s)` };
    }
    
    const { error } = await supabaseAdmin
      .from('retailers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, message: error.message || 'Failed to delete retailer' };
    }
    
    revalidatePath('/retailers');
    revalidatePath('/deals');
    
    return { success: true, message: 'Retailer deleted successfully' };
  } catch (error) {
    console.error('Error deleting retailer:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to delete retailer' };
  }
}

export async function getRetailers(): Promise<Retailer[]> {
  try {
    await requireRole('admin');
    
    const { data, error } = await supabaseAdmin
      .from('retailers')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    return (data || []).map(ret => ({
      id: ret.id,
      name: ret.name,
      slug: ret.slug,
      logoUrl: ret.logo_url,
      websiteUrl: ret.website_url,
      affiliateId: ret.affiliate_id,
      isActive: ret.is_active,
      dealCount: ret.deal_count,
      commission: ret.commission,
      createdAt: new Date(ret.created_at),
      updatedAt: new Date(ret.updated_at),
    })) as Retailer[];
  } catch (error) {
    console.error('Error fetching retailers:', error);
    return [];
  }
}

export async function getRetailer(id: string): Promise<Retailer | null> {
  try {
    await requireRole('admin');
    
    const { data, error } = await supabaseAdmin
      .from('retailers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      affiliateId: data.affiliate_id,
      isActive: data.is_active,
      dealCount: data.deal_count,
      commission: data.commission,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    } as Retailer;
  } catch (error) {
    console.error('Error fetching retailer:', error);
    return null;
  }
}

/**
 * Approve a pending retailer
 */
export async function approveRetailer(id: string): Promise<ActionResult> {
  try {
    const { uid } = await requireRole('admin');

    // First, get the retailer to find the associated user_id
    const { data: retailer, error: fetchError } = await supabaseAdmin
      .from('retailers')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !retailer) {
      return {
        success: false,
        message: 'Retailer not found',
      };
    }

    // Update retailer status to approved and activate the account
    const { error: retailerError } = await supabaseAdmin
      .from('retailers')
      .update({
        status: 'approved',
        is_active: true,
        approved_at: new Date().toISOString(),
        approved_by: uid,
        rejection_reason: null,
      })
      .eq('id', id);

    if (retailerError) {
      console.error('Supabase error updating retailer:', retailerError);
      return {
        success: false,
        message: retailerError.message || 'Failed to approve retailer',
      };
    }

    // Update user_profiles with approval status
    if (retailer.user_id) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          retailer_status: 'approved',
          rejection_reason: null,
          rejection_date: null,
        })
        .eq('id', retailer.user_id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        // Don't fail the whole operation if profile update fails
      }
    }

    revalidatePath('/retailers');
    revalidatePath('/retailers/pending');

    return {
      success: true,
      message: 'Retailer approved successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error approving retailer:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Reject a pending retailer
 */
export async function rejectRetailer(id: string, reason: string): Promise<ActionResult> {
  try {
    const { uid } = await requireRole('admin');

    if (!reason || reason.trim().length === 0) {
      return {
        success: false,
        message: 'Rejection reason is required',
      };
    }

    // First, get the retailer to find the associated user_id
    const { data: retailer, error: fetchError } = await supabaseAdmin
      .from('retailers')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !retailer) {
      return {
        success: false,
        message: 'Retailer not found',
      };
    }

    // Update retailer status to rejected
    const { error: retailerError } = await supabaseAdmin
      .from('retailers')
      .update({
        status: 'rejected',
        approved_at: null,
        approved_by: uid,
        rejection_reason: reason,
      })
      .eq('id', id);

    if (retailerError) {
      console.error('Supabase error updating retailer:', retailerError);
      return {
        success: false,
        message: retailerError.message || 'Failed to reject retailer',
      };
    }

    // Update user_profiles with rejection information
    if (retailer.user_id) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          retailer_status: 'rejected',
          rejection_reason: reason,
          rejection_date: new Date().toISOString(),
        })
        .eq('id', retailer.user_id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        // Don't fail the whole operation if profile update fails
      }
    }

    revalidatePath('/retailers');
    revalidatePath('/retailers/pending');

    return {
      success: true,
      message: 'Retailer rejected',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error rejecting retailer:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Get all pending retailers (awaiting approval)
 */
export async function getPendingRetailers(): Promise<Retailer[]> {
  try {
    await requireRole('admin');

    const { data, error } = await supabaseAdmin
      .from('retailers')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logo_url,
      websiteUrl: row.website_url,
      affiliateId: row.affiliate_id,
      isActive: row.is_active,
      dealCount: row.deal_count,
      commission: row.commission,
      userId: row.user_id,
      status: row.status,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by,
      rejectionReason: row.rejection_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching pending retailers:', error);
    return [];
  }
}
