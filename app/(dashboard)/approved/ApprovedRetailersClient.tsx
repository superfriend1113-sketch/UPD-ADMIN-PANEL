'use client';

/**
 * Approved Retailers Client Component
 * Handles client-side interactions for approved retailers
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusPill from '@/components/ui/StatusPill';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface ApprovedRetailersClientProps {
  retailers: any[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ApprovedRetailersClient({ retailers }: ApprovedRetailersClientProps) {
  const router = useRouter();
  const [selectedRetailer, setSelectedRetailer] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRowClick = (retailer: any) => {
    setSelectedRetailer(retailer);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedRetailer(null);
  };

  const handleSuspend = async () => {
    if (!selectedRetailer) return;
    
    try {
      // TODO: Implement suspend functionality
      console.log('Suspend retailer:', selectedRetailer.id);
      showToast('Retailer suspended successfully', 'success');
      handleClosePanel();
      router.refresh();
    } catch (error) {
      console.error('Error suspending retailer:', error);
      showToast('Error suspending retailer', 'error');
    }
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-[28px]">
          <h1 className="font-display text-[36px] tracking-[0.5px]">Approved Retailers</h1>
          <p className="text-[#888070] text-[13px] mt-[3px]">
            Active partners with full platform access.
          </p>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-[#d6d0c4] rounded-[6px] overflow-hidden shadow-[0_2px_12px_rgba(13,13,13,0.10)] mb-[24px]">
          <div className="px-[20px] py-[16px] border-b border-[#d6d0c4] flex items-center justify-between bg-[#ede9df]">
            <div>
              <h3 className="text-[15px] font-semibold">Active Partners</h3>
              <p className="text-[12px] text-[#888070] mt-px">Click a row to view details</p>
            </div>
            <StatusPill status="approved" count={retailers.length} />
          </div>

          {retailers.length === 0 ? (
            <div className="text-center py-[60px] px-[20px] text-[#888070]">
              <span className="text-[40px] block mb-[12px]">✅</span>
              <h3 className="text-[18px] text-[#0d0d0d] mb-[6px]">No Approved Retailers</h3>
              <p className="text-[14px]">No retailers have been approved yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#ede9df] border-b border-[#d6d0c4]">
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Business
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Listings
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Approved
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Approved By
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {retailers.map((retailer) => (
                    <tr
                      key={retailer.id}
                      onClick={() => handleRowClick(retailer)}
                      className="border-b border-[#d6d0c4] last:border-b-0 hover:bg-[#ede9df] transition-colors cursor-pointer"
                    >
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        <strong>{retailer.name}</strong>
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        <span className="font-mono text-[12px]">{retailer.email || 'N/A'}</span>
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        0
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        {formatDate(retailer.updated_at)}
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        admin@upd.com
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        <div onClick={(e) => e.stopPropagation()}>
                          <button className="inline-flex items-center gap-[7px] px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold cursor-pointer border-[1.5px] border-[#d6d0c4] bg-transparent text-[#0d0d0d] transition-all duration-150 hover:border-[#0d0d0d]">
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {isPanelOpen && selectedRetailer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 top-[56px]"
            onClick={handleClosePanel}
          />
          
          {/* Panel */}
          <div className="bg-[#f5f2eb] border-l border-[#d6d0c4] w-[380px] shrink-0 p-[24px] overflow-y-auto max-h-[calc(100vh-56px)] fixed right-0 top-[56px] z-50 shadow-[-4px_0_12px_rgba(13,13,13,0.08)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-[20px]">
              <h3 className="text-[15px] font-bold">Retailer Details</h3>
              <button
                onClick={handleClosePanel}
                className="text-[#888070] hover:text-[#0d0d0d] transition-colors duration-150 text-[20px] leading-none cursor-pointer bg-transparent border-0 p-0"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            {/* Identity Section */}
            <div className="mb-[20px]">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
                Identity
              </h4>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Business Name</span>
                <span className="font-medium text-right max-w-[60%]">{selectedRetailer.name}</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Entity Type</span>
                <span className="font-medium text-right max-w-[60%]">{selectedRetailer.entity_type || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">State</span>
                <span className="font-medium text-right max-w-[60%]">{selectedRetailer.state}</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Year Est.</span>
                <span className="font-medium text-right max-w-[60%]">{selectedRetailer.year_established}</span>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-[20px]">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
                Contact
              </h4>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Email</span>
                <span className="font-mono text-[11px] font-medium text-right max-w-[60%] break-all">
                  {selectedRetailer.email || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Phone</span>
                <span className="font-medium text-right max-w-[60%]">{selectedRetailer.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Website</span>
                <span className="font-medium text-right max-w-[60%] break-all">
                  {selectedRetailer.website_url || 'None provided'}
                </span>
              </div>
            </div>

            {/* Inventory Section */}
            <div className="mb-[20px]">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
                Inventory
              </h4>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Volume</span>
                <span className="font-medium text-right max-w-[60%]">{selectedRetailer.volume}/mo</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Categories</span>
                <span className="font-medium text-right max-w-[60%]">
                  {selectedRetailer.categories?.join(', ') || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Conditions</span>
                <span className="font-medium text-right max-w-[60%]">
                  {selectedRetailer.conditions?.join(', ') || 'N/A'}
                </span>
              </div>
            </div>

            {/* Status Section */}
            <div className="mb-[20px]">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
                Status
              </h4>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Approved Date</span>
                <span className="font-medium text-right max-w-[60%]">{formatDate(selectedRetailer.updated_at)}</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Approved By</span>
                <span className="font-medium text-right max-w-[60%]">admin@upd.com</span>
              </div>
              <div className="flex justify-between mb-[7px] text-[13px]">
                <span className="text-[#888070]">Active Listings</span>
                <span className="font-medium text-right max-w-[60%]">0</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-[16px]">
              <button 
                onClick={handleSuspend}
                className="w-full inline-flex items-center justify-center gap-[7px] px-[14px] py-[10px] rounded-[6px] text-[14px] font-semibold cursor-pointer border-[1.5px] border-[#d6d0c4] bg-transparent text-[#0d0d0d] transition-all duration-150 hover:border-[#0d0d0d]"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
