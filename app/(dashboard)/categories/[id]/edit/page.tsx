/**
 * Edit Category Page
 */

import { notFound } from 'next/navigation';
import { getCategory, updateCategory } from '../../../../../lib/actions/categories';
import CategoryForm from '../../../../../components/forms/CategoryForm';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategory(id);
  
  if (!category) {
    notFound();
  }
  
  const handleUpdate = async (formData: FormData) => {
    'use server';
    return updateCategory(id, formData);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-2">Update category information</p>
      </div>
      
      <CategoryForm category={category} mode="edit" onSubmit={handleUpdate} />
    </div>
  );
}
