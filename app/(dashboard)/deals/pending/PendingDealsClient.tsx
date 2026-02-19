'use client';

/**
 * Pending Deals Client Component
 * Displays pending deals with approval actions
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Deal } from '@/types/deal';
import { approveDeal, rejectDeal } from '@/lib/actions/deals';
import { formatPrice } from '@/types/deal';
import { showToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

interface PendingDealsClientProps {
  deals: Deal[];
}

export default function PendingDealsClient({ deals }: PendingDealsClientProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (dealId: string) => {
    setProcessing(dealId);
    try {
      const result = await approveDeal(dealId);
      if (result.success) {
        showToast('Deal approved successfully', 'success');
        router.refresh();
      } else {
        showToast(result.message || 'Failed to approve deal', 'error');
      }
    } catch (error) {
      showToast('Error approving deal', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (dealId: string) => {
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    setProcessing(dealId);
    try {
      const result = await rejectDeal(dealId, reason);
      if (result.success) {
        showToast('Deal rejected', 'info');
        router.refresh();
      } else {
        showToast(result.message || 'Failed to reject deal', 'error');
      }
    } catch (error) {
      showToast('Error rejecting deal', 'error');
    } finally {
      setProcessing(null);
    }
  };

  if (deals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Deals</h3>
        <p className="text-gray-600">All deal submissions have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <div key={deal.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {/* Deal Image */}
              <div className="w-24 h-24 flex-shrink-0">
                {deal.imageUrl ? (
                  <img
                    src={deal.imageUrl}
                    alt={deal.productName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Deal Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {deal.productName}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {deal.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Price:</span>{' '}
                    <span className="font-semibold text-green-600">{formatPrice(deal.price)}</span>
                    {' '}
                    <span className="text-gray-400 line-through">{formatPrice(deal.originalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Savings:</span>{' '}
                    <span className="font-semibold text-red-600">{deal.savingsPercentage}% OFF</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>{' '}
                    <span className="font-medium">{deal.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Retailer:</span>{' '}
                    <span className="font-medium">{deal.retailer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expires:</span>{' '}
                    <span>{new Date(deal.expirationDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>{' '}
                    <span>{new Date(deal.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {deal.isFeatured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                  <a
                    href={deal.dealUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Deal URL →
                  </a>
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            <div className="ml-4 flex gap-2">
              <Button
                size="sm"
                variant="success"
                onClick={() => handleApprove(deal.id)}
                disabled={processing === deal.id}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleReject(deal.id)}
                disabled={processing === deal.id}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
