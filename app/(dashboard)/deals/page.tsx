/**
 * Deals List Page
 * Display all deals with filtering and bulk actions
 */

import { getDeals, deleteDeal, toggleDealStatus, bulkUpdateDeals } from '../../../lib/actions/deals';
import { getAdminFirestore } from '../../../lib/firebase/adminConfig';
import DealsListClient from './DealsListClient';
import type { Category, Retailer } from '../../../lib/types';

export default async function DealsPage() {
  // Fetch deals
  const deals = await getDeals();
  
  // Fetch categories and retailers for filters
  const db = getAdminFirestore();
  
  const categoriesSnapshot = await db.collection('categories').orderBy('name').get();
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
  
  const retailersSnapshot = await db.collection('retailers').orderBy('name').get();
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
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Deals Management</h1>
        <p className="text-gray-600 mt-2">Manage all deals, filter by category, retailer, or status</p>
      </div>
      
      <DealsListClient
        initialDeals={deals}
        categories={categories}
        retailers={retailers}
      />
    </div>
  );
}
