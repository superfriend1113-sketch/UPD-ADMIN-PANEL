/**
 * CategoriesListClient Component
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { deleteCategory } from '../../../lib/actions/categories';
import type { Category } from '../../../lib/types';

interface CategoriesListClientProps {
  initialCategories: Category[];
}

export default function CategoriesListClient({ initialCategories }: CategoriesListClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoryId: string | null; dealCount: number }>({
    isOpen: false,
    categoryId: null,
    dealCount: 0,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    
    if (result.success) {
      setCategories(prev => prev.filter(c => c.id !== id));
      setToast({ message: result.message, type: 'success' });
      router.refresh();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
    
    setDeleteModal({ isOpen: false, categoryId: null, dealCount: 0 });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/categories/new">
          <Button variant="primary">Create New Category</Button>
        </Link>
        
        <div className="text-sm text-gray-600">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deals</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No categories found. Create your first category to get started.
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-2xl">{category.icon}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{category.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{category.order}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{category.dealCount || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                        category.isActive
                          ? 'text-green-800 bg-green-100'
                          : 'text-gray-800 bg-gray-100'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link href={`/categories/${category.id}/edit`}>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ 
                            isOpen: true, 
                            categoryId: category.id,
                            dealCount: category.dealCount || 0
                          })}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null, dealCount: 0 })}
        onConfirm={() => deleteModal.categoryId && handleDelete(deleteModal.categoryId)}
        title="Delete Category"
        message={
          deleteModal.dealCount > 0
            ? `This category has ${deleteModal.dealCount} associated deal(s). You cannot delete it until all deals are removed or reassigned.`
            : 'Are you sure you want to delete this category? This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
