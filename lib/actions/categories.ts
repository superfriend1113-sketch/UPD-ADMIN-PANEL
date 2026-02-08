'use server';

/**
 * Category Server Actions
 * CRUD operations for categories
 */

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '../supabase/adminConfig';
import { validateCategory, isSlugUnique, generateSlug } from '../validations';
import { requireRole } from '../auth';
import type { ActionResult, Category } from '../types';

/**
 * Create a new category
 */
export async function createCategory(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole('admin');
    
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
    
    const { error } = await supabaseAdmin
      .from('categories')
      .insert({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        order: categoryData.order,
        is_active: categoryData.isActive,
        deal_count: 0,
      });
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create category',
      };
    }
    
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
    await requireRole('admin');
    
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
    
    const { error } = await supabaseAdmin
      .from('categories')
      .update({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        order: categoryData.order,
        is_active: categoryData.isActive,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return {
          success: false,
          message: 'Category not found',
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to update category',
      };
    }
    
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
    await requireRole('admin');
    
    // First check if category has deals
    const { data: category, error: fetchError } = await supabaseAdmin
      .from('categories')
      .select('deal_count')
      .eq('id', id)
      .single();
    
    if (fetchError || !category) {
      return {
        success: false,
        message: 'Category not found',
      };
    }
    
    // Check if category has deals
    const dealCount = category.deal_count || 0;
    if (dealCount > 0) {
      return {
        success: false,
        message: `Cannot delete category with ${dealCount} associated deal(s)`,
      };
    }
    
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete category',
      };
    }
    
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
    await requireRole('admin');
    
    const { error } = await supabaseAdmin
      .from('categories')
      .update({ order })
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return {
          success: false,
          message: 'Category not found',
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to update category order',
      };
    }
    
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
    await requireRole('admin');
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    return (data || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
      isActive: cat.is_active,
      dealCount: cat.deal_count,
      createdAt: new Date(cat.created_at),
      updatedAt: new Date(cat.updated_at),
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
    await requireRole('admin');
    
    const { data, error } = await supabaseAdmin
      .from('categories')
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
      description: data.description,
      icon: data.icon,
      order: data.order,
      isActive: data.is_active,
      dealCount: data.deal_count,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    } as Category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}
