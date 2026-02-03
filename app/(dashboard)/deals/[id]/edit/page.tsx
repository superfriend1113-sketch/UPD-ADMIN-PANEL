/**
 * Edit Deal Page
 * Form for editing an existing deal
 */

import { notFound } from 'next/navigation';
import { getAdminFirestore } from '../../../../../lib/firebase/adminConfig';
import { getDeal, updateDeal } from '../../../../../lib/actions/deals';
import DealForm from '../../../../../components/forms/DealForm';
import type { Category, Retailer } from '../../../../../lib/types';

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
  const db = getAdminFirestore();
  
  const categoriesSnapshot = await db.collection('categories')
    .orderBy('name')
    .get();
  
  const categories: Category[] = categoriesSnapshot.docs
    .filter(doc => doc.data().isActive === true)
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
        dealCount: data.dealCount,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    }) as Category[];
  
  const retailersSnapshot = await db.collection('retailers')
    .orderBy('name')
    .get();
  
  const retailers: Retailer[] = retailersSnapshot.docs
    .filter(doc => doc.data().isActive === true)
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        affiliateId: data.affiliateId,
        isActive: data.isActive,
        dealCount: data.dealCount,
        commission: data.commission,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    }) as Retailer[];
  
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
        deal={deal}
        categories={categories}
        retailers={retailers}
        mode="edit"
        onSubmit={handleUpdate}
      />
    </div>
  );
}
