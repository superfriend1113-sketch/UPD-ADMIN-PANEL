'use client';

/**
 * Pending Retailers Client Component
 * Displays pending retailers with approval actions
 */

import { useState } from 'react';
import type { Retailer } from '@/types/retailer';
import ApprovalActions from '@/components/dashboard/ApprovalActions';
import { approveRetailer, rejectRetailer } from '@/lib/actions/retailers';

interface PendingRetailersClientProps {
  retailers: Retailer[];
}

export default function PendingRetailersClient({ retailers }: PendingRetailersClientProps) {
  if (retailers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Retailers</h3>
        <p className="text-gray-600">All retailer applications have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {retailers.map((retailer) => (
        <div key={retailer.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {/* Logo */}
              <div className="w-16 h-16 flex-shrink-0">
                {retailer.logoUrl ? (
                  <img
                    src={retailer.logoUrl}
                    alt={retailer.name}
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Logo</span>
                  </div>
                )}
              </div>

              {/* Retailer Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {retailer.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Slug: <span className="font-mono">{retailer.slug}</span>
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Website:</span>{' '}
                    <a
                      href={retailer.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {new URL(retailer.websiteUrl).hostname}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500">Commission:</span>{' '}
                    <span className="font-medium">{retailer.commission}</span>
                  </div>
                  {retailer.affiliateId && (
                    <div>
                      <span className="text-gray-500">Affiliate ID:</span>{' '}
                      <span className="font-mono text-xs">{retailer.affiliateId}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Submitted:</span>{' '}
                    <span>{new Date(retailer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            <div className="ml-4">
              <ApprovalActions
                itemId={retailer.id}
                itemType="retailer"
                itemName={retailer.name}
                onApprove={approveRetailer}
                onReject={rejectRetailer}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
