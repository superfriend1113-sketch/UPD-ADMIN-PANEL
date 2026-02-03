'use server';

/**
 * Retailer Server Actions
 */

import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '../firebase/adminConfig';
import { validateRetailer, isSlugUnique, generateSlug } from '../validations';
import { requireAuth } from '../auth';
import type { ActionResult, Retailer } from '../types';
import { Timestamp } from 'firebase-admin/firestore';

export async function createRetailer(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    
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
    
    const db = getAdminFirestore();
    const now = Timestamp.now();
    
    const firestoreData: any = {
      name: retailerData.name,
      slug: retailerData.slug,
      logoUrl: retailerData.logoUrl,
      websiteUrl: retailerData.websiteUrl,
      commission: retailerData.commission,
      isActive: retailerData.isActive,
      dealCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    if (retailerData.affiliateId) {
      firestoreData.affiliateId = retailerData.affiliateId;
    }
    
    await db.collection('retailers').add(firestoreData);
    
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
    await requireAuth();
    
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
    
    const db = getAdminFirestore();
    const retailerRef = db.collection('retailers').doc(id);
    
    const retailerDoc = await retailerRef.get();
    if (!retailerDoc.exists) {
      return { success: false, message: 'Retailer not found' };
    }
    
    const updateData: any = {
      name: retailerData.name,
      slug: retailerData.slug,
      logoUrl: retailerData.logoUrl,
      websiteUrl: retailerData.websiteUrl,
      commission: retailerData.commission,
      isActive: retailerData.isActive,
      updatedAt: Timestamp.now(),
    };
    
    if (retailerData.affiliateId) {
      updateData.affiliateId = retailerData.affiliateId;
    }
    
    await retailerRef.update(updateData);
    
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
    await requireAuth();
    
    const db = getAdminFirestore();
    const retailerRef = db.collection('retailers').doc(id);
    
    const retailerDoc = await retailerRef.get();
    if (!retailerDoc.exists) {
      return { success: false, message: 'Retailer not found' };
    }
    
    const dealCount = retailerDoc.data()?.dealCount || 0;
    if (dealCount > 0) {
      return { success: false, message: `Cannot delete retailer with ${dealCount} associated deal(s)` };
    }
    
    await retailerRef.delete();
    
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
    await requireAuth();
    
    const db = getAdminFirestore();
    const snapshot = await db.collection('retailers').orderBy('name').get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Retailer[];
  } catch (error) {
    console.error('Error fetching retailers:', error);
    return [];
  }
}

export async function getRetailer(id: string): Promise<Retailer | null> {
  try {
    await requireAuth();
    
    const db = getAdminFirestore();
    const doc = await db.collection('retailers').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      updatedAt: doc.data()?.updatedAt?.toDate(),
    } as Retailer;
  } catch (error) {
    console.error('Error fetching retailer:', error);
    return null;
  }
}
