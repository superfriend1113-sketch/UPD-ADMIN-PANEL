'use server';

/**
 * Category Server Actions
 * CRUD operations for categories
 */

import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '../firebase/adminConfig';
import { validateCategory, isSlugUnique, generateSlug } from '../validations';
import { requireAuth } from '../auth';
import type { ActionResult, Category } from '../types';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Create a new category
 */
export async function createCategory(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    
    const categoryData: Partial<Category> = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'true',
    };
    
    // Validate category data
    const validation = validateCategory(categoryData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }
    
    // Check slug uniqueness
    const slugUnique = await isSlugUnique(categoryData.slug!, 'categories');
    if (!slugUnique) {
      return {
        success: false,
        message: 'Validation failed',
        errors: { slug: 'This slug is already in use' },
      };
    }
    
    const db = getAdminFirestore();
    const now = Timestamp.now();
    
    await db.collection('categories').add({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      icon: categoryData.icon,
      order: categoryData.order,
      isActive: categoryData.isActive,
      dealCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    
    revalidatePath('/categories');
    revalidatePath('/deals');
    
    return {
      success: true,
      message: 'Category created successfully',
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create category',
    };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    
    const categoryData: Partial<Category> = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'true',
    };
    
    // Validate category data
    const validation = validateCategory(categoryData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }
    
    // Check slug uniqueness (excluding current category)
    const slugUnique = await isSlugUnique(categoryData.slug!, 'categories', id);
    if (!slugUnique) {
      return {
        success: false,
        message: 'Validation failed',
        errors: { slug: 'This slug is already in use' },
      };
    }
    
    const db = getAdminFirestore();
    const categoryRef = db.collection('categories').doc(id);
    
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      return {
        success: false,
        message: 'Category not found',
      };
    }
    
    await categoryRef.update({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      icon: categoryData.icon,
      order: categoryData.order,
      isActive: categoryData.isActive,
      updatedAt: Timestamp.now(),
    });
    
    revalidatePath('/categories');
    revalidatePath('/deals');
    
    return {
      success: true,
      message: 'Category updated successfully',
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update category',
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    
    const db = getAdminFirestore();
    const categoryRef = db.collection('categories').doc(id);
    
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      return {
        success: false,
        message: 'Category not found',
      };
    }
    
    // Check if category has deals
    const dealCount = categoryDoc.data()?.dealCount || 0;
    if (dealCount > 0) {
      return {
        success: false,
        message: `Cannot delete category with ${dealCount} associated deal(s)`,
      };
    }
    
    await categoryRef.delete();
    
    revalidatePath('/categories');
    revalidatePath('/deals');
    
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete category',
    };
  }
}

/**
 * Update category order
 */
export async function updateCategoryOrder(id: string, order: number): Promise<ActionResult> {
  try {
    await requireAuth();
    
    const db = getAdminFirestore();
    const categoryRef = db.collection('categories').doc(id);
    
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      return {
        success: false,
        message: 'Category not found',
      };
    }
    
    await categoryRef.update({
      order,
      updatedAt: Timestamp.now(),
    });
    
    revalidatePath('/categories');
    
    return {
      success: true,
      message: 'Category order updated successfully',
    };
  } catch (error) {
    console.error('Error updating category order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update category order',
    };
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    await requireAuth();
    
    const db = getAdminFirestore();
    const snapshot = await db.collection('categories')
      .orderBy('order')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get a single category by ID
 */
export async function getCategory(id: string): Promise<Category | null> {
  try {
    await requireAuth();
    
    const db = getAdminFirestore();
    const doc = await db.collection('categories').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      updatedAt: doc.data()?.updatedAt?.toDate(),
    } as Category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}
