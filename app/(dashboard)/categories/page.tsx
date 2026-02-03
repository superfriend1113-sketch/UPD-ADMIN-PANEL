/**
 * Categories List Page
 */

import Link from 'next/link';
import { getCategories, deleteCategory } from '../../../lib/actions/categories';
import CategoriesListClient from './CategoriesListClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <p className="text-gray-600 mt-2">Manage product categories and display order</p>
      </div>
      
      <CategoriesListClient initialCategories={categories} />
    </div>
  );
}
