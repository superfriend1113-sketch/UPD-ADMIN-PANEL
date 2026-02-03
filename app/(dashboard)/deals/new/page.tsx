/**
 * Create Deal Page
 * Form for creating a new deal
 */

import { redirect } from 'next/navigation';
import { getAdminFirestore } from '../../../../lib/firebase/adminConfig';
import { createDeal } from '../../../../lib/actions/deals';
import DealForm from '../../../../components/forms/DealForm';
import type { Category, Retailer } from '../../../../lib/types';

export const dynamic = 'force-dynamic';

export default async function CreateDealPage() {
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
