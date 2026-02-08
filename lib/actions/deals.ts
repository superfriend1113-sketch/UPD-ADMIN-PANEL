'use server';

/**
 * Deal Server Actions
 * CRUD operations and status management for deals
 */

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '../supabase/adminConfig';
import { validateDeal, calculateSavingsPercentage, generateSlug } from '../validations';
import { requireRole } from '../auth';
import type { ActionResult, Deal } from '../types';

/**
 * Helper to convert Date or string to ISO string
 */
function toISOString(date: Date | string | null | undefined): string | null | undefined {
  if (!date) return date as null | undefined;
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/**
 * Create a new deal
 */
export async function createDeal(formData: FormData): Promise<ActionResult> {
  try {
    // Require admin authentication
    const { uid, profile } = await requireRole('admin');
    
    // Extract form data
    const dealData: Partial<Deal> = {
      productName: formData.get('productName') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      dealUrl: formData.get('dealUrl') as string,
      category: formData.get('category') as string,
      retailer: formData.get('retailer') as string,
      price: parseInt(formData.get('price') as string) || 0,
      originalPrice: parseInt(formData.get('originalPrice') as string) || 0,
      expirationDate: new Date(formData.get('expirationDate') as string),
      slug: formData.get('slug') as string || generateSlug(formData.get('productName') as string),
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      metaDescription: formData.get('metaDescription') as string || undefined,
    };
    
    // Calculate savings percentage
    dealData.savingsPercentage = calculateSavingsPercentage(
      dealData.originalPrice!,
      dealData.price!
    );
    
    // Validate deal data
    const validation = validateDeal(dealData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }
    
    // Create deal in Supabase
    const { data, error } = await supabaseAdmin
      .from('deals')
      .insert({
        product_name: dealData.productName,
        description: dealData.description,
        image_url: dealData.imageUrl,
        deal_url: dealData.dealUrl,
        category: dealData.category,
        retailer: dealData.retailer,
        price: dealData.price,
        original_price: dealData.originalPrice,
        savings_percentage: dealData.savingsPercentage,
        expiration_date: toISOString(dealData.expirationDate),
        slug: dealData.slug,
        is_active: dealData.isActive,
        is_featured: dealData.isFeatured,
        meta_description: dealData.metaDescription,
        created_by: uid,
        view_count: 0,
        click_count: 0,
        // Admin-created deals are automatically approved
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: uid,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create deal',
      };
    }
    
    // Revalidate pages
    revalidatePath('/deals');
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Deal created successfully',
      data: { id: data.id },
    };
  } catch (error) {
    console.error('Error creating deal:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create deal',
    };
  }
}

/**
 * Update an existing deal
 */
export async function updateDeal(id: string, formData: FormData): Promise<ActionResult> {
  try {
    // Require admin authentication
    await requireRole('admin');
    
    // Extract form data
    const dealData: Partial<Deal> = {
      productName: formData.get('productName') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      dealUrl: formData.get('dealUrl') as string,
      category: formData.get('category') as string,
      retailer: formData.get('retailer') as string,
      price: parseInt(formData.get('price') as string) || 0,
      originalPrice: parseInt(formData.get('originalPrice') as string) || 0,
      expirationDate: new Date(formData.get('expirationDate') as string),
      slug: formData.get('slug') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      metaDescription: formData.get('metaDescription') as string || undefined,
    };
    
    // Calculate savings percentage
    dealData.savingsPercentage = calculateSavingsPercentage(
      dealData.originalPrice!,
      dealData.price!
    );
    
    // Validate deal data
    const validation = validateDeal(dealData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }
    
    // Update deal in Supabase
    const { error } = await supabaseAdmin
      .from('deals')
      .update({
        product_name: dealData.productName,
        description: dealData.description,
        image_url: dealData.imageUrl,
        deal_url: dealData.dealUrl,
        category: dealData.category,
        retailer: dealData.retailer,
        price: dealData.price,
        original_price: dealData.originalPrice,
        savings_percentage: dealData.savingsPercentage,
        expiration_date: toISOString(dealData.expirationDate),
        slug: dealData.slug,
        is_active: dealData.isActive,
        is_featured: dealData.isFeatured,
        meta_description: dealData.metaDescription,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return {
          success: false,
          message: 'Deal not found',
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to update deal',
      };
    }
    
    // Revalidate pages
    revalidatePath('/deals');
    revalidatePath(`/deals/${id}`);
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Deal updated successfully',
    };
  } catch (error) {
    console.error('Error updating deal:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update deal',
    };
  }
}

/**
 * Delete a deal
 */
export async function deleteDeal(id: string): Promise<ActionResult> {
  try {
    // Require admin authentication
    await requireRole('admin');
    
    // Delete deal from Supabase
    const { error } = await supabaseAdmin
      .from('deals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete deal',
      };
    }
    
    // Revalidate pages
    revalidatePath('/deals');
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Deal deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting deal:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete deal',
    };
  }
}

/**
 * Toggle deal status (isActive or isFeatured)
 */
export async function toggleDealStatus(
  id: string,
  field: 'isActive' | 'isFeatured'
): Promise<ActionResult> {
  try {
    // Require admin authentication
    await requireRole('admin');
    
    // Get current deal
    const { data: deal, error: fetchError } = await supabaseAdmin
      .from('deals')
      .select('is_active, is_featured')
      .eq('id', id)
      .single();
    
    if (fetchError || !deal) {
      return {
        success: false,
        message: 'Deal not found',
      };
    }
    
    const currentValue = field === 'isActive' ? deal.is_active : deal.is_featured;
    const dbField = field === 'isActive' ? 'is_active' : 'is_featured';
    
    // Toggle the field
    const { error } = await supabaseAdmin
      .from('deals')
      .update({ [dbField]: !currentValue })
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update deal status',
      };
    }
    
    // Revalidate pages
    revalidatePath('/deals');
    revalidatePath('/');
    
    return {
      success: true,
      message: `Deal ${field === 'isActive' ? 'status' : 'featured status'} updated successfully`,
      data: { [field]: !currentValue },
    };
  } catch (error) {
    console.error('Error toggling deal status:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update deal status',
    };
  }
}

/**
 * Bulk update deals (activate/deactivate multiple deals)
 */
export async function bulkUpdateDeals(
  ids: string[],
  updates: { isActive?: boolean; isFeatured?: boolean }
): Promise<ActionResult> {
  try {
    // Require admin authentication
    await requireRole('admin');
    
    if (ids.length === 0) {
      return {
        success: false,
        message: 'No deals selected',
      };
    }
    
    // Prepare update object with snake_case fields
    const updateData: any = {};
    if (updates.isActive !== undefined) {
      updateData.is_active = updates.isActive;
    }
    if (updates.isFeatured !== undefined) {
      updateData.is_featured = updates.isFeatured;
    }
    
    // Update deals in Supabase
    const { error } = await supabaseAdmin
      .from('deals')
      .update(updateData)
      .in('id', ids);
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update deals',
      };
    }
    
    // Revalidate pages
    revalidatePath('/deals');
    revalidatePath('/');
    
    return {
      success: true,
      message: `${ids.length} deal(s) updated successfully`,
      data: { count: ids.length },
    };
  } catch (error) {
    console.error('Error bulk updating deals:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update deals',
    };
  }
}

/**
 * Get all deals (for admin list page)
 */
export async function getDeals(): Promise<Deal[]> {
  try {
    await requireRole('admin');
    
    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    // Transform snake_case to camelCase
    return (data || []).map(deal => ({
      id: deal.id,
      productName: deal.product_name,
      description: deal.description,
      imageUrl: deal.image_url,
      dealUrl: deal.deal_url,
      category: deal.category,
      retailer: deal.retailer,
      price: deal.price,
      originalPrice: deal.original_price,
      savingsPercentage: deal.savings_percentage,
      expirationDate: new Date(deal.expiration_date),
      slug: deal.slug,
      isActive: deal.is_active,
      isFeatured: deal.is_featured,
      metaDescription: deal.meta_description,
      createdAt: new Date(deal.created_at),
      updatedAt: new Date(deal.updated_at),
      createdBy: deal.created_by,
      viewCount: deal.view_count,
      clickCount: deal.click_count,
    })) as Deal[];
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}

/**
 * Get a single deal by ID
 */
export async function getDeal(id: string): Promise<Deal | null> {
  try {
    await requireRole('admin');
    
    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Transform snake_case to camelCase
    return {
      id: data.id,
      productName: data.product_name,
      description: data.description,
      imageUrl: data.image_url,
      dealUrl: data.deal_url,
      category: data.category,
      retailer: data.retailer,
      price: data.price,
      originalPrice: data.original_price,
      savingsPercentage: data.savings_percentage,
      expirationDate: new Date(data.expiration_date),
      slug: data.slug,
      isActive: data.is_active,
      isFeatured: data.is_featured,
      metaDescription: data.meta_description,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      createdBy: data.created_by,
      viewCount: data.view_count,
      clickCount: data.click_count,
    } as Deal;
  } catch (error) {
    console.error('Error fetching deal:', error);
    return null;
  }
}

/**
 * Approve a pending deal
 */
export async function approveDeal(id: string): Promise<ActionResult> {
  try {
    const { uid } = await requireRole('admin');

    // Update deal status to approved and activate it
    const { error } = await supabaseAdmin
      .from('deals')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: uid,
        rejection_reason: null,
        is_active: true,
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to approve deal',
      };
    }

    revalidatePath('/deals');
    revalidatePath('/deals/pending');
    revalidatePath('/');

    return {
      success: true,
      message: 'Deal approved successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error approving deal:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Reject a pending deal
 */
export async function rejectDeal(id: string, reason: string): Promise<ActionResult> {
  try {
    const { uid } = await requireRole('admin');

    if (!reason || reason.trim().length === 0) {
      return {
        success: false,
        message: 'Rejection reason is required',
      };
    }

    // Update deal status to rejected
    const { error } = await supabaseAdmin
      .from('deals')
      .update({
        status: 'rejected',
        approved_at: null,
        approved_by: uid,
        rejection_reason: reason,
        is_active: false,
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reject deal',
      };
    }

    revalidatePath('/deals');
    revalidatePath('/deals/pending');
    revalidatePath('/');

    return {
      success: true,
      message: 'Deal rejected',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error rejecting deal:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Get all pending deals (awaiting approval)
 */
export async function getPendingDeals(): Promise<Deal[]> {
  try {
    await requireRole('admin');

    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data.map(row => ({
      id: row.id,
      productName: row.product_name,
      description: row.description,
      imageUrl: row.image_url,
      price: row.price,
      originalPrice: row.original_price,
      savingsPercentage: row.savings_percentage,
      category: row.category,
      retailer: row.retailer,
      retailerId: row.retailer_id,
      dealUrl: row.deal_url,
      expirationDate: new Date(row.expiration_date),
      isActive: row.is_active,
      isFeatured: row.is_featured,
      status: row.status,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by,
      rejectionReason: row.rejection_reason,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      createdBy: row.created_by,
      viewCount: row.view_count,
      clickCount: row.click_count,
      slug: row.slug,
      metaDescription: row.meta_description,
    }));
  } catch (error) {
    console.error('Error fetching pending deals:', error);
    return [];
  }
}
