/**
 * Retailer Data Model
 * Represents a merchant or store that offers deals
 */

import { Timestamp } from 'firebase/firestore';

export interface Retailer {
  // Identifiers
  id: string;

  // Retailer Information
  name: string;                  // Display name
  slug: string;                  // URL-friendly identifier
  logoUrl: string;               // Firebase Storage URL for logo
  websiteUrl: string;            // Retailer website
  affiliateId?: string;          // Affiliate tracking ID

  // Status
  isActive: boolean;             // Whether retailer is active

  // Denormalized data
  dealCount: number;             // Number of deals from retailer (integer)

  // Business
  commission: string;            // Commission rate or structure

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Validate Retailer document structure
 * @param retailer - Partial retailer object to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateRetailer(retailer: Partial<Retailer>): string[] {
  const errors: string[] = [];

  // Required fields
  if (!retailer.name) errors.push('name is required');
  if (!retailer.slug) errors.push('slug is required');
  if (!retailer.logoUrl) errors.push('logoUrl is required');
  if (!retailer.websiteUrl) errors.push('websiteUrl is required');
  if (!retailer.commission) errors.push('commission is required');

  // URL validation
  if (retailer.websiteUrl) {
    try {
      new URL(retailer.websiteUrl);
    } catch {
      errors.push('websiteUrl must be a valid URL');
    }
  }

  // Deal count validation
  if (retailer.dealCount !== undefined && retailer.dealCount !== null) {
    if (!Number.isInteger(retailer.dealCount)) {
      errors.push('dealCount must be an integer');
    }
    if (retailer.dealCount < 0) {
      errors.push('dealCount must be non-negative');
    }
  }

  // Timestamp validation
  if (retailer.createdAt && !(retailer.createdAt instanceof Timestamp)) {
    errors.push('createdAt must be a Firebase Timestamp');
  }
  if (retailer.updatedAt && !(retailer.updatedAt instanceof Timestamp)) {
    errors.push('updatedAt must be a Firebase Timestamp');
  }

  return errors;
}
