/**
 * Shared Type Definitions
 * Imports and re-exports types from user-web app for consistency
 */

// Re-export types from user-web for consistency
export type { Deal } from '../types/deal';
export type { Category } from '../types/category';
export type { Retailer } from '../types/retailer';
export type { Analytics } from '../types/analytics';

// Admin-specific types

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
}

export interface DashboardMetrics {
  totalDeals: number;
  activeDeals: number;
  expiredDeals: number;
  totalCategories: number;
  totalRetailers: number;
}

export interface DealFilters {
  categoryId?: string;
  retailerId?: string;
  status?: 'active' | 'inactive' | 'expired';
  expiration?: 'expired' | 'expiring-soon' | 'future';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}
