/**
 * Create Category Page
 */

import { createCategory } from '../../../../lib/actions/categories';
import CategoryForm from '../../../../components/forms/CategoryForm';

export default async function CreateCategoryPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Category</h1>
        <p className="text-gray-600 mt-2">Add a new product category</p>
      </div>
      
      <CategoryForm mode="create" onSubmit={createCategory} />
    </div>
  );
}
