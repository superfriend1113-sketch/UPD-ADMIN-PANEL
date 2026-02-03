'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { deleteRetailer } from '../../../lib/actions/retailers';
import type { Retailer } from '../../../lib/types';

export default function RetailersListClient({ initialRetailers }: { initialRetailers: Retailer[] }) {
  const router = useRouter();
  const [retailers, setRetailers] = useState(initialRetailers);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; retailerId: string | null; dealCount: number }>({ isOpen: false, retailerId: null, dealCount: 0 });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const handleDelete = async (id: string) => {
    const result = await deleteRetailer(id);
    if (result.success) {
      setRetailers(prev => prev.filter(r => r.id !== id));
      setToast({ message: result.message, type: 'success' });
      router.refresh();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
    setDeleteModal({ isOpen: false, retailerId: null, dealCount: 0 });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/retailers/new"><Button variant="primary">Create New Retailer</Button></Link>
        <div className="text-sm text-gray-600">{retailers.length} {retailers.length === 1 ? 'retailer' : 'retailers'}</div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Website</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deals</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {retailers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No retailers found.</td></tr>
            ) : (
              retailers.map(retailer => (
                <tr key={retailer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{retailer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{retailer.slug}</td>
                  <td className="px-4 py-3 text-sm"><a href={retailer.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{retailer.websiteUrl}</a></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{retailer.dealCount || 0}</td>
                  <td className="px-4 py-3"><span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${retailer.isActive ? 'text-green-800 bg-green-100' : 'text-gray-800 bg-gray-100'}`}>{retailer.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Link href={`/retailers/${retailer.id}/edit`}><button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button></Link>
                      <button onClick={() => setDeleteModal({ isOpen: true, retailerId: retailer.id, dealCount: retailer.dealCount || 0 })} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, retailerId: null, dealCount: 0 })} onConfirm={() => deleteModal.retailerId && handleDelete(deleteModal.retailerId)} title="Delete Retailer" message={deleteModal.dealCount > 0 ? `This retailer has ${deleteModal.dealCount} associated deal(s). Cannot delete.` : 'Are you sure? This action cannot be undone.'} confirmText="Delete" cancelText="Cancel" variant="danger" />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
