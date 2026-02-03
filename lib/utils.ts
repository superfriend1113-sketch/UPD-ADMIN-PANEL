/**
 * Utility Functions
 * Client-safe utility functions that don't depend on Firebase Admin SDK
 */

/**
 * Calculate savings percentage
 * @param originalPrice - Original price in cents
 * @param salePrice - Sale price in cents
 * @returns Savings percentage rounded to 2 decimal places
 */
export function calculateSavingsPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice < 0 || salePrice >= originalPrice) {
    return 0;
  }
  
  const savings = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(savings * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate slug from string
 * Converts a string to a URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate URL format
 * Checks if string matches http:// or https:// URL pattern
 */
export function validateURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate slug format
 * Slug must contain only lowercase letters, numbers, and hyphens
 */
export function validateSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

/**
 * Validate price
 * Price must be a positive number with at most 2 decimal places
 */
export function validatePrice(price: number): boolean {
  if (typeof price !== 'number' || isNaN(price)) return false;
  if (price < 0) return false;
  
  // Check for at most 2 decimal places
  const decimalPlaces = (price.toString().split('.')[1] || '').length;
  return decimalPlaces <= 2;
}

/**
 * Validate future date
 * Date must be in the future
 */
export function validateFutureDate(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return false;
    
    return dateObj.getTime() > Date.now();
  } catch {
    return false;
  }
}
