/**
 * Analytics Data Model
 * Represents daily aggregated metrics about platform usage
 */

import { Timestamp } from 'firebase/firestore';

export interface Analytics {
  // Identifiers
  id: string;                    // Unique identifier (typically date-based, e.g., "2026-02-03")

  // Date
  date: Timestamp;               // Date for this analytics record

  // Aggregate Metrics
  totalViews: number;            // Total views across all deals (integer)
  totalClicks: number;           // Total clicks across all deals (integer)
  totalDeals: number;            // Total number of deals (integer)
  activeDeals: number;           // Number of active deals (integer)

  // Category Breakdown
  viewsByCategory: {             // Views broken down by category
    [categoryId: string]: number;
  };
  clicksByCategory: {            // Clicks broken down by category
    [categoryId: string]: number;
  };

  // Top Performers
  topDeals: Array<{              // Top performing deals
    dealId: string;
    views: number;
    clicks: number;
  }>;
}

/**
 * Validate Analytics document structure
 * @param analytics - Partial analytics object to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateAnalytics(analytics: Partial<Analytics>): string[] {
  const errors: string[] = [];

  // Required fields
  if (!analytics.date) errors.push('date is required');
  if (analytics.totalViews === undefined || analytics.totalViews === null) errors.push('totalViews is required');
  if (analytics.totalClicks === undefined || analytics.totalClicks === null) errors.push('totalClicks is required');
  if (analytics.totalDeals === undefined || analytics.totalDeals === null) errors.push('totalDeals is required');
  if (analytics.activeDeals === undefined || analytics.activeDeals === null) errors.push('activeDeals is required');

  // Numeric field validation (must be non-negative integers)
  const numericFields = ['totalViews', 'totalClicks', 'totalDeals', 'activeDeals'] as const;
  
  for (const field of numericFields) {
    const value = analytics[field];
    if (value !== undefined && value !== null) {
      if (!Number.isInteger(value)) {
        errors.push(`${field} must be an integer`);
      }
      if (value < 0) {
        errors.push(`${field} must be non-negative`);
      }
    }
  }

  // Timestamp validation
  if (analytics.date && !(analytics.date instanceof Timestamp)) {
    errors.push('date must be a Firebase Timestamp');
  }

  // Category breakdown validation
  if (analytics.viewsByCategory) {
    for (const [categoryId, views] of Object.entries(analytics.viewsByCategory)) {
      if (!Number.isInteger(views) || views < 0) {
        errors.push(`viewsByCategory.${categoryId} must be a non-negative integer`);
      }
    }
  }

  if (analytics.clicksByCategory) {
    for (const [categoryId, clicks] of Object.entries(analytics.clicksByCategory)) {
      if (!Number.isInteger(clicks) || clicks < 0) {
        errors.push(`clicksByCategory.${categoryId} must be a non-negative integer`);
      }
    }
  }

  // Top deals validation
  if (analytics.topDeals) {
    if (!Array.isArray(analytics.topDeals)) {
      errors.push('topDeals must be an array');
    } else {
      analytics.topDeals.forEach((deal, index) => {
        if (!deal.dealId) {
          errors.push(`topDeals[${index}].dealId is required`);
        }
        if (!Number.isInteger(deal.views) || deal.views < 0) {
          errors.push(`topDeals[${index}].views must be a non-negative integer`);
        }
        if (!Number.isInteger(deal.clicks) || deal.clicks < 0) {
          errors.push(`topDeals[${index}].clicks must be a non-negative integer`);
        }
      });
    }
  }

  return errors;
}

/**
 * Calculate Click-Through Rate (CTR)
 */
export function calculateCTR(clicks: number, views: number): number {
  if (views === 0) return 0;
  return (clicks / views) * 100;
}
