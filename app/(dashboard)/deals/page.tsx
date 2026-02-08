/**
 * Deals List Page
 * Display all deals with filtering and bulk actions
 */

import { getDeals, deleteDeal, toggleDealStatus, bulkUpdateDeals } from '../../../lib/actions/deals';
import { supabaseAdmin } from '../../../lib/supabase/adminConfig';
import DealsListClient from './DealsListClient';
import type { Category, Retailer, Deal } from '../../../lib/types';

// Client-side Deal type with Date objects instead of Timestamps
type ClientDeal = Omit<Deal, 'expirationDate' | 'createdAt' | 'updatedAt'> & {
  expirationDate: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  // Fetch deals
  const deals = await getDeals();
  
  // Fetch categories and retailers for filters
  const { data: categoriesData } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  const categories: Category[] = (categoriesData || []).map(data => ({
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon: data.icon,
    order: data.order,
    isActive: data.is_active,
    dealCount: data.deal_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }));
  
  const { data: retailersData } = await supabaseAdmin
    .from('retailers')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  const retailers: Retailer[] = (retailersData || []).map(data => ({
    id: data.id,
    name: data.name,
    slug: data.slug,
    logoUrl: data.logo_url,
    websiteUrl: data.website_url,
    affiliateId: data.affiliate_id,
    isActive: data.is_active,
    dealCount: data.deal_count,
    commission: data.commission?.toString() || '0',
    userId: data.user_id,
    status: data.status || 'approved',
    approvedAt: data.approved_at,
    approvedBy: data.approved_by,
    rejectionReason: data.rejection_reason,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }));
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Deals Management</h1>
        <p className="text-gray-600 mt-2">Manage all deals, filter by category, retailer, or status</p>
      </div>
      
      <DealsListClient
        initialDeals={deals as unknown as ClientDeal[]}
        categories={categories}
        retailers={retailers}
      />
    </div>
  );
}
