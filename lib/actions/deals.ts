'use server';

/**
 * Deal Server Actions
 * CRUD operations and status management for deals
 */

import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '../firebase/adminConfig';
import { validateDeal, calculateSavingsPercentage, generateSlug } from '../validations';
import { requireAuth } from '../auth';
import type { ActionResult, Deal } from '../types';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Create a new deal
 */
export async function createDeal(formData: FormData): Promise<ActionResult> {
  try {
    // Require authentication
    const session = await requireAuth();
    
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
    
    // Create deal in Firestore
    const db = getAdminFirestore();
    const now = Timestamp.now();
    
    // Prepare data object, excluding undefined values
    const firestoreData: any = {
      productName: dealData.productName,
      description: dealData.description,
      imageUrl: dealData.imageUrl,
      dealUrl: dealData.dealUrl,
      category: dealData.category,
      retailer: dealData.retailer,
      price: dealData.price,
      originalPrice: dealData.originalPrice,
      savingsPercentage: dealData.savingsPercentage,
      expirationDate: Timestamp.fromDate(dealData.expirationDate!),
      slug: dealData.slug,
      isActive: dealData.isActive,
      isFeatured: dealData.isFeatured,
      createdAt: now,
      updatedAt: now,
      createdBy: session.email || 'unknown',
      viewCount: 0,
      clickCount: 0,
    };
    
    // Only add metaDescription if it's not undefined
    if (dealData.metaDescription) {
      firestoreData.metaDescription = dealData.metaDescription;
    }
    
    const docRef = await db.collection('deals').add(firestoreData);
    
    // Revalidate pages
    revalidatePath('/deals');
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Deal created successfully',
      data: { id: docRef.id },
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
    // Require authentication
    await requireAuth();
    
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
    
    // Update deal in Firestore
    const db = getAdminFirestore();
    const dealRef = db.collection('deals').doc(id);
    
    // Check if deal exists
    const dealDoc = await dealRef.get();
    if (!dealDoc.exists) {
      return {
        success: false,
        message: 'Deal not found',
      };
    }
    
    // Prepare update data, excluding undefined values
    const updateData: any = {
      productName: dealData.productName,
      description: dealData.description,
      imageUrl: dealData.imageUrl,
      dealUrl: dealData.dealUrl,
      category: dealData.category,
      retailer: dealData.retailer,
      price: dealData.price,
      originalPrice: dealData.originalPrice,
      savingsPercentage: dealData.savingsPercentage,
      expirationDate: Timestamp.fromDate(dealData.expirationDate!),
      slug: dealData.slug,
      isActive: dealData.isActive,
      isFeatured: dealData.isFeatured,
      updatedAt: Timestamp.now(),
    };
    
    // Only add metaDescription if it's not undefined
    if (dealData.metaDescription) {
      updateData.metaDescription = dealData.metaDescription;
    }
    
    await dealRef.update(updateData);
    
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
    // Require authentication
    await requireAuth();
    
    const db = getAdminFirestore();
    const dealRef = db.collection('deals').doc(id);
    
    // Check if deal exists
    const dealDoc = await dealRef.get();
    if (!dealDoc.exists) {
      return {
        success: false,
        message: 'Deal not found',
      };
    }
    
    // Delete deal
    await dealRef.delete();
    
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
    // Require authentication
    await requireAuth();
    
    const db = getAdminFirestore();
    const dealRef = db.collection('deals').doc(id);
    
    // Get current deal
    const dealDoc = await dealRef.get();
    if (!dealDoc.exists) {
      return {
        success: false,
        message: 'Deal not found',
      };
    }
    
    const currentValue = dealDoc.data()?.[field] || false;
    
    // Toggle the field
    await dealRef.update({
      [field]: !currentValue,
      updatedAt: Timestamp.now(),
    });
    
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
    // Require authentication
    await requireAuth();
    
    if (ids.length === 0) {
      return {
        success: false,
        message: 'No deals selected',
      };
    }
    
    const db = getAdminFirestore();
    const batch = db.batch();
    
    // Update each deal
    ids.forEach(id => {
      const dealRef = db.collection('deals').doc(id);
      batch.update(dealRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    });
    
    // Commit batch
    await batch.commit();
    
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
    await requireAuth();
    
    const db = getAdminFirestore();
    const snapshot = await db.collection('deals')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to plain objects
      expirationDate: doc.data().expirationDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
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
    await requireAuth();
    
    const db = getAdminFirestore();
    const doc = await db.collection('deals').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to plain objects
      expirationDate: doc.data()?.expirationDate?.toDate(),
      createdAt: doc.data()?.createdAt?.toDate(),
      updatedAt: doc.data()?.updatedAt?.toDate(),
    } as Deal;
  } catch (error) {
    console.error('Error fetching deal:', error);
    return null;
  }
}
