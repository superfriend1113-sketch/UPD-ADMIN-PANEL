/**
 * DealsListClient Component
 * Client-side component for deals list with filtering and bulk actions
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { deleteDeal, toggleDealStatus, bulkUpdateDeals } from '../../../lib/actions/deals';
import type { Deal, Category, Retailer } from '../../../lib/types';

interface DealsListClientProps {
  initialDeals: Deal[];
  categories: Category[];
  retailers: Retailer[];
}

export default function DealsListClient({ initialDeals, categories, retailers }: DealsListClientProps) {
  const router = useRouter();
  const [deals, setDeals] = useState(initialDeals);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [retailerFilter, setRetailerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expirationFilter, setExpirationFilter] = useState('');
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; dealId: string | null }>({
    isOpen: false,
    dealId: null,
  });
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Category filter
      if (categoryFilter && deal.category !== categoryFilter) return false;
      
      // Retailer filter
      if (retailerFilter && deal.retailer !== retailerFilter) return false;
      
      // Status filter
      if (statusFilter === 'active' && !deal.isActive) return false;
      if (statusFilter === 'inactive' && deal.isActive) return false;
      
      // Expiration filter
      const now = Date.now();
      const expirationTime = new Date(deal.expirationDate).getTime();
      const sevenDaysFromNow = now + (7 * 24 * 60 * 60 * 1000);
      
      if (expirationFilter === 'expired' && expirationTime > now) return false;
      if (expirationFilter === 'expiring-soon' && (expirationTime <= now || expirationTime > sevenDaysFromNow)) return false;
      if (expirationFilter === 'future' && expirationTime <= sevenDaysFromNow) return false;
      
      return true;
    });
  }, [deals, categoryFilter, retailerFilter, statusFilter, expirationFilter]);
  
  // Select all toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredDeals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDeals.map(d => d.id));
    }
  };
  
  // Toggle individual selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  // Delete deal
  const handleDelete = async (id: string) => {
    const result = await deleteDeal(id);
    
    if (result.success) {
      setDeals(prev => prev.filter(d => d.id !== id));
      setToast({ message: result.message, type: 'success' });
      router.refresh();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
    
    setDeleteModal({ isOpen: false, dealId: null });
  };
  
  // Toggle status
  const handleToggleStatus = async (id: string, field: 'isActive' | 'isFeatured') => {
    const result = await toggleDealStatus(id, field);
    
    if (result.success) {
      setDeals(prev => prev.map(d =>
        d.id === id ? { ...d, [field]: result.data[field] } : d
      ));
      setToast({ message: result.message, type: 'success' });
      router.refresh();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };
  
  // Bulk activate
  const handleBulkActivate = async () => {
    if (selectedIds.length === 0) return;
    
    const result = await bulkUpdateDeals(selectedIds, { isActive: true });
    
    if (result.success) {
      setDeals(prev => prev.map(d =>
        selectedIds.includes(d.id) ? { ...d, isActive: true } : d
      ));
      setSelectedIds([]);
      setToast({ message: result.message, type: 'success' });
      router.refresh();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };
  
  // Bulk deactivate
  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) return;
    
    const result = await bulkUpdateDeals(selectedIds, { isActive: false });
    
    if (result.success) {
      setDeals(prev => prev.map(d =>
        selectedIds.includes(d.id) ? { ...d, isActive: false } : d
      ));
      setSelectedIds([]);
      setToast({ message: result.message, type: 'success' });
      router.refresh();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };
  
  // Get category name
  const getCategoryName = (slug: string) => {
    return categories.find(c => c.slug === slug)?.name || slug;
  };
  
  // Get retailer name
  const getRetailerName = (slug: string) => {
    return retailers.find(r => r.slug === slug)?.name || slug;
  };
  
  // Format date consistently for SSR
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Check if deal is expired
  const isExpired = (expirationDate: Date) => {
    return new Date(expirationDate).getTime() < Date.now();
  };
  
  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/deals/new">
            <Button variant="primary">Create New Deal</Button>
          </Link>
          
          {selectedIds.length > 0 && (
            <>
              <Button variant="secondary" onClick={handleBulkActivate}>
                Activate ({selectedIds.length})
              </Button>
              <Button variant="secondary" onClick={handleBulkDeactivate}>
                Deactivate ({selectedIds.length})
              </Button>
            </>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredDeals.length} of {deals.length} deals
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            id="categoryFilter"
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </Select>
          
          <Select
            id="retailerFilter"
            label="Retailer"
            value={retailerFilter}
            onChange={(e) => setRetailerFilter(e.target.value)}
          >
            <option value="">All Retailers</option>
            {retailers.map(ret => (
              <option key={ret.id} value={ret.slug}>{ret.name}</option>
            ))}
          </Select>
          
          <Select
            id="statusFilter"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          
          <Select
            id="expirationFilter"
            label="Expiration"
            value={expirationFilter}
            onChange={(e) => setExpirationFilter(e.target.value)}
          >
            <option value="">All Dates</option>
            <option value="expired">Expired</option>
            <option value="expiring-soon">Expiring Soon (7 days)</option>
            <option value="future">Future</option>
          </Select>
        </div>
        
        {(categoryFilter || retailerFilter || statusFilter || expirationFilter) && (
          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCategoryFilter('');
                setRetailerFilter('');
                setStatusFilter('');
                setExpirationFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredDeals.length && filteredDeals.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Retailer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Savings</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expiration</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No deals found. {deals.length > 0 && 'Try adjusting your filters.'}
                  </td>
                </tr>
              ) : (
                filteredDeals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(deal.id)}
                        onChange={() => handleToggleSelect(deal.id)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={deal.imageUrl}
                          alt={deal.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{deal.productName}</div>
                          {deal.isFeatured && (
                            <span className="inline-block px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{getCategoryName(deal.category)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{getRetailerName(deal.retailer)}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">${(deal.price / 100).toFixed(2)}</div>
                        <div className="text-gray-500 line-through">${(deal.originalPrice / 100).toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded">
                        {deal.savingsPercentage}% off
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(deal.id, 'isActive')}
                        className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                          deal.isActive
                            ? 'text-green-800 bg-green-100 hover:bg-green-200'
                            : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {deal.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm ${isExpired(deal.expirationDate) ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                        {formatDate(deal.expirationDate)}
                        {isExpired(deal.expirationDate) && (
                          <div className="text-xs text-red-600">Expired</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link href={`/deals/${deal.id}/edit`}>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, dealId: deal.id })}
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
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, dealId: null })}
        onConfirm={() => deleteModal.dealId && handleDelete(deleteModal.dealId)}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
      
      {/* Toast Notification */}
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
