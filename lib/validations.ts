/**
 * Validation Utilities
 * Comprehensive validation functions for forms and data integrity
 */

import { getAdminFirestore } from './firebase/adminConfig';
import type { Deal, Category, Retailer, ValidationResult } from './types';
import {
  validateURL,
  validateSlug,
  validatePrice,
  validateFutureDate,
  calculateSavingsPercentage,
  generateSlug,
} from './utils';

// Re-export utility functions for backward compatibility
export {
  validateURL,
  validateSlug,
  validatePrice,
  validateFutureDate,
  calculateSavingsPercentage,
  generateSlug,
};

/**
 * Check if slug is unique in a collection
 * @param slug - Slug to check
 * @param collection - Collection name ('categories' or 'retailers')
 * @param excludeId - Optional ID to exclude (for edit operations)
 */
export async function isSlugUnique(
  slug: string,
  collection: 'categories' | 'retailers',
  excludeId?: string
): Promise<boolean> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection(collection)
      .where('slug', '==', slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) return true;
    
    // If excludeId is provided, check if the found document is the one being edited
    if (excludeId) {
      const doc = snapshot.docs[0];
      return doc.id === excludeId;
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking slug uniqueness in ${collection}:`, error);
    return false;
  }
}

/**
 * Validate Deal data
 * Comprehensive validation for deal creation/editing
 */
export function validateDeal(data: Partial<Deal>): ValidationResult {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!data.productName || data.productName.trim() === '') {
    errors.productName = 'Product name is required';
  } else if (data.productName.length > 200) {
    errors.productName = 'Product name must be 200 characters or less';
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description is required';
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less';
  }
  
  if (!data.imageUrl || data.imageUrl.trim() === '') {
    errors.imageUrl = 'Image URL is required';
  } else if (!validateURL(data.imageUrl)) {
    errors.imageUrl = 'Image URL must be a valid URL (http:// or https://)';
  }
  
  if (!data.dealUrl || data.dealUrl.trim() === '') {
    errors.dealUrl = 'Deal URL is required';
  } else if (!validateURL(data.dealUrl)) {
    errors.dealUrl = 'Deal URL must be a valid URL (http:// or https://)';
  }
  
  if (!data.category || data.category.trim() === '') {
    errors.category = 'Category is required';
  }
  
  if (!data.retailer || data.retailer.trim() === '') {
    errors.retailer = 'Retailer is required';
  }
  
  // Price validation
  if (data.price === undefined || data.price === null) {
    errors.price = 'Price is required';
  } else if (!validatePrice(data.price / 100)) {
    errors.price = 'Price must be a positive number';
  }
  
  if (data.originalPrice === undefined || data.originalPrice === null) {
    errors.originalPrice = 'Original price is required';
  } else if (!validatePrice(data.originalPrice / 100)) {
    errors.originalPrice = 'Original price must be a positive number';
  }
  
  // Price comparison
  if (data.price !== undefined && data.originalPrice !== undefined) {
    if (data.price >= data.originalPrice) {
      errors.price = 'Sale price must be less than original price';
    }
  }
  
  // Expiration date validation
  if (!data.expirationDate) {
    errors.expirationDate = 'Expiration date is required';
  } else if (!validateFutureDate(data.expirationDate)) {
    errors.expirationDate = 'Expiration date must be in the future';
  }
  
  if (!data.slug || data.slug.trim() === '') {
    errors.slug = 'Slug is required';
  } else if (!validateSlug(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Category data
 * Comprehensive validation for category creation/editing
 */
export function validateCategory(data: Partial<Category>): ValidationResult {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Category name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Category name must be 100 characters or less';
  }
  
  if (!data.slug || data.slug.trim() === '') {
    errors.slug = 'Slug is required';
  } else if (!validateSlug(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  }
  
  if (!data.icon || data.icon.trim() === '') {
    errors.icon = 'Icon is required';
  }
  
  // Optional description validation
  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be 500 characters or less';
  }
  
  // Order validation
  if (data.order !== undefined && data.order !== null) {
    if (!Number.isInteger(data.order) || data.order < 0) {
      errors.order = 'Order must be a non-negative integer';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Retailer data
 * Comprehensive validation for retailer creation/editing
 */
export function validateRetailer(data: Partial<Retailer>): ValidationResult {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Retailer name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Retailer name must be 100 characters or less';
  }
  
  if (!data.slug || data.slug.trim() === '') {
    errors.slug = 'Slug is required';
  } else if (!validateSlug(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  }
  
  if (!data.logoUrl || data.logoUrl.trim() === '') {
    errors.logoUrl = 'Logo URL is required';
  } else if (!validateURL(data.logoUrl)) {
    errors.logoUrl = 'Logo URL must be a valid URL (http:// or https://)';
  }
  
  if (!data.websiteUrl || data.websiteUrl.trim() === '') {
    errors.websiteUrl = 'Website URL is required';
  } else if (!validateURL(data.websiteUrl)) {
    errors.websiteUrl = 'Website URL must be a valid URL (http:// or https://)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
