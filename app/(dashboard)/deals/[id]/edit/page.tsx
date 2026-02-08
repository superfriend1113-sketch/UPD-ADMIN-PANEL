/**
 * Edit Deal Page
 * Form for editing an existing deal
 */

import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../../lib/supabase/adminConfig';
import { getDeal, updateDeal } from '../../../../../lib/actions/deals';
import DealForm from '../../../../../components/forms/DealForm';
import type { Category, Retailer, Deal } from '../../../../../lib/types';

// Client-side Deal type with Date objects instead of Timestamps
type ClientDeal = Omit<Deal, 'expirationDate' | 'createdAt' | 'updatedAt'> & {
  expirationDate: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

interface EditDealPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const { id } = await params;
  
  // Fetch deal data
  const deal = await getDeal(id);
  
  if (!deal) {
    notFound();
  }
  
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
  
  // Wrapper function to pass deal ID to updateDeal
  const handleUpdate = async (formData: FormData) => {
    'use server';
    return updateDeal(id, formData);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Deal</h1>
        <p className="text-gray-600 mt-2">Update deal information</p>
      </div>
      
      <DealForm
        deal={deal as unknown as ClientDeal}
        categories={categories}
        retailers={retailers}
        mode="edit"
        onSubmit={handleUpdate}
      />
    </div>
  );
}
