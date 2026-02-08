/**
 * Create Deal Page
 * Form for creating a new deal
 */

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase/adminConfig';
import { createDeal } from '../../../../lib/actions/deals';
import DealForm from '../../../../components/forms/DealForm';
import type { Category, Retailer } from '../../../../lib/types';

export const dynamic = 'force-dynamic';

export default async function CreateDealPage() {
  // Fetch categories and retailers for form dropdowns
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
  
  // Check if we have categories and retailers
  if (categories.length === 0 || retailers.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Setup Required</h3>
          <p>
            You need to create at least one category and one retailer before creating deals.
          </p>
          <div className="mt-4 space-x-4">
            {categories.length === 0 && (
              <a href="/categories/new" className="text-blue-600 hover:text-blue-800 font-medium">
                Create Category
              </a>
            )}
            {retailers.length === 0 && (
              <a href="/retailers/new" className="text-blue-600 hover:text-blue-800 font-medium">
                Create Retailer
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Deal</h1>
        <p className="text-gray-600 mt-2">Add a new deal to the platform</p>
      </div>
      
      <DealForm
        categories={categories}
        retailers={retailers}
        mode="create"
        onSubmit={createDeal}
      />
    </div>
  );
}
