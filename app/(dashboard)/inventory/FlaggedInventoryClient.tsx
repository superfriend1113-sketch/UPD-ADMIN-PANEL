'use client';

/**
 * Flagged Inventory Client Component
 * Handles client-side interactions for flagged inventory review
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/ui/StatCard';
import StatusPill from '@/components/ui/StatusPill';
import RiskFlag from '@/components/ui/RiskFlag';
import FlaggedItemDetailPanel from '@/components/dashboard/FlaggedItemDetailPanel';
import { showToast } from '@/components/ui/Toast';

interface FlaggedInventoryClientProps {
  items: any[];
  stats: {
    awaiting: number;
    clearedToday: number;
    rejected: number;
    avgReviewTime: string;
  };
  recentlyCleared: any[];
}

function formatTimeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

function calculateDiscount(original: number, current: number): number {
  return Math.round((1 - current / original) * 100);
}

export default function FlaggedInventoryClient({
  items,
  stats,
  recentlyCleared,
}: FlaggedInventoryClientProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedItem(null);
  };

  const handleClear = async (notes?: string) => {
    if (!selectedItem) return;
    
    try {
      const response = await fetch(`/api/deals/${selectedItem.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes || 'Cleared by admin review',
        }),
      });

      if (response.ok) {
        showToast('Item cleared and moved to active', 'success');
        handleClosePanel();
        router.refresh();
      } else {
        showToast('Failed to clear item', 'error');
      }
    } catch (error) {
      console.error('Error clearing item:', error);
      showToast('Error clearing item', 'error');
    }
  };

  const handleReject = async (notes?: string) => {
    if (!selectedItem) return;
    
    try {
      const response = await fetch(`/api/deals/${selectedItem.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: notes || 'Rejected due to policy violation',
        }),
      });

      if (response.ok) {
        showToast('Item rejected due to policy violation', 'info');
        handleClosePanel();
        router.refresh();
      } else {
        showToast('Failed to reject item', 'error');
      }
    } catch (error) {
      console.error('Error rejecting item:', error);
      showToast('Error rejecting item', 'error');
    }
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-[28px]">
          <h1 className="font-display text-[36px] tracking-[0.5px]">Flagged Inventory</h1>
          <p className="text-[#888070] text-[13px] mt-[3px]">
            Items requiring manual review before going live.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-[16px] mb-[28px]">
          <StatCard
            label="Awaiting Review"
            value={stats.awaiting}
            subtitle="Flagged by system"
            accent="accent1"
          />
          <StatCard
            label="Cleared (Today)"
            value={stats.clearedToday}
            subtitle="Moved to active"
            accent="accent2"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            subtitle="Policy violations"
            accent="accent3"
          />
          <StatCard
            label="Avg. Review Time"
            value={stats.avgReviewTime}
            subtitle="Last 7 days"
            accent="accent4"
          />
        </div>

        {/* Flagged Items Table */}
        <div className="bg-white border border-[#d6d0c4] rounded-[6px] overflow-hidden shadow-[0_2px_12px_rgba(13,13,13,0.10)] mb-[24px]">
          <div className="px-[20px] py-[16px] border-b border-[#d6d0c4] flex items-center justify-between bg-[#ede9df]">
            <div>
              <h3 className="text-[15px] font-semibold">Items Flagged for Review</h3>
              <p className="text-[12px] text-[#888070] mt-px">Click a row to review details and take action</p>
            </div>
            <StatusPill status="pending" count={items.length} label="flagged" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-[60px] px-[20px] text-[#888070]">
              <span className="text-[40px] block mb-[12px]">🏳️</span>
              <h3 className="text-[18px] text-[#0d0d0d] mb-[6px]">No Flagged Items</h3>
              <p className="text-[14px]">All inventory is currently clear of flags.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#ede9df] border-b border-[#d6d0c4]">
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      SKU
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Title
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Retailer
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Price
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Qty
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Flag Reason
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Flagged
                    </th>
                    <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const discount = calculateDiscount(item.original_price, item.current_price);
                    
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleRowClick(item)}
                        className="border-b border-[#d6d0c4] last:border-b-0 hover:bg-[#ede9df] transition-colors cursor-pointer"
                      >
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <span className="font-mono text-[12px]">{item.sku}</span>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {item.title}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <strong>{item.retailer_name}</strong>
                          <br />
                          <span className="text-[11px] text-[#888070]">{item.retailer_status}</span>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <span className="font-mono text-[13px]">
                            ${item.current_price}
                            <span className="inline-block bg-[#c8401a] text-white text-[10px] font-bold px-[6px] py-[2px] rounded-[3px] ml-[4px]">
                              −{discount}%
                            </span>
                          </span>
                          <br />
                          <span className="text-[#888070] line-through font-mono text-[12px]">
                            ${item.original_price}
                          </span>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {item.quantity}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <div className="flex flex-wrap gap-[4px]">
                            {item.flags?.map((flag: any, idx: number) => (
                              <RiskFlag key={idx} severity={flag.severity || 'default'}>
                                {flag.text}
                              </RiskFlag>
                            ))}
                          </div>
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          {formatTimeAgo(item.flagged_at)}
                        </td>
                        <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                          <div onClick={(e) => e.stopPropagation()} className="flex gap-[6px]">
                            <button
                              onClick={() => handleRowClick(item)}
                              className="inline-flex items-center gap-[7px] px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold cursor-pointer bg-[#1e8a52] text-white transition-all duration-150 hover:bg-[#167343]"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => handleRowClick(item)}
                              className="inline-flex items-center gap-[7px] px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold cursor-pointer bg-[#c8401a] text-white transition-all duration-150 hover:bg-[#a83416]"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recently Cleared Items Table */}
        <div className="bg-white border border-[#d6d0c4] rounded-[6px] overflow-hidden shadow-[0_2px_12px_rgba(13,13,13,0.10)]">
          <div className="px-[20px] py-[16px] border-b border-[#d6d0c4] bg-[#ede9df]">
            <h3 className="text-[15px] font-semibold">Recently Cleared Items</h3>
            <p className="text-[12px] text-[#888070] mt-px">Items that passed review in the last 24 hours</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ede9df] border-b border-[#d6d0c4]">
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    SKU
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Title
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Retailer
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Original Flag
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Cleared By
                  </th>
                  <th className="px-[16px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#888070] text-left whitespace-nowrap">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentlyCleared.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-[16px] py-[40px] text-center text-[#888070] text-[14px]">
                      No recently cleared items
                    </td>
                  </tr>
                ) : (
                  recentlyCleared.map((item) => (
                    <tr key={item.id} className="border-b border-[#d6d0c4] last:border-b-0 hover:bg-[#ede9df] transition-colors">
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        <span className="font-mono text-[12px]">{item.sku}</span>
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        {item.title}
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        {item.retailer_name}
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        <span className="text-[12px] text-[#888070]">{item.original_flag}</span>
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        {item.cleared_by}
                      </td>
                      <td className="px-[16px] py-[13px] text-[13.5px] align-middle">
                        <span className="text-[12px] text-[#1e8a52]">
                          ✓ {formatTimeAgo(item.cleared_at)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <FlaggedItemDetailPanel
        item={selectedItem}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onClear={handleClear}
        onReject={handleReject}
      />
    </>
  );
}
