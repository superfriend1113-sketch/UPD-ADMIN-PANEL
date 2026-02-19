'use client';

/**
 * Flagged Item Detail Panel
 * Side panel for reviewing flagged inventory items in detail
 */

import { useState } from 'react';
import Button from '@/components/ui/Button';
import RiskFlag from '@/components/ui/RiskFlag';
import { showToast } from '@/components/ui/Toast';

interface FlaggedItemDetailPanelProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onClear: (notes?: string) => void;
  onReject: (notes?: string) => void;
}

export default function FlaggedItemDetailPanel({
  item,
  isOpen,
  onClose,
  onClear,
  onReject,
}: FlaggedItemDetailPanelProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleClear = () => {
    onClear(notes || 'Cleared by admin review');
  };

  const handleReject = () => {
    if (!notes.trim()) {
      showToast('Please provide a reason for rejection in the admin notes', 'error');
      return;
    }
    onReject(notes);
  };

  const discount = Math.round((1 - item.current_price / item.original_price) * 100);
  const totalValue = item.current_price * item.quantity;
  
  const riskLevel = item.risk_level || 'MEDIUM';
  const riskColor = riskLevel === 'HIGH' ? '#c8401a' : '#856404';
  const riskBg = riskLevel === 'HIGH' ? '#fef2f0' : '#fef8e7';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 top-[56px]"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="bg-[#f5f2eb] border-l border-[#d6d0c4] w-[380px] shrink-0 p-[24px] overflow-y-auto max-h-[calc(100vh-56px)] fixed right-0 top-[56px] z-50 shadow-[-4px_0_12px_rgba(13,13,13,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[20px]">
          <h3 className="text-[15px] font-bold">Flagged Item Review</h3>
          <button
            onClick={onClose}
            className="text-[#888070] hover:text-[#0d0d0d] transition-colors duration-150 text-[20px] leading-none cursor-pointer bg-transparent border-0 p-0"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Item Details Section */}
        <div className="mb-[20px]">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
            Item Details
          </h4>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">SKU</span>
            <span className="font-mono text-[11px] font-medium text-right max-w-[60%]">
              {item.sku}
            </span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Title</span>
            <span className="font-medium text-right max-w-[60%]">{item.title}</span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Category</span>
            <span className="font-medium text-right max-w-[60%]">{item.category || 'N/A'}</span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Condition</span>
            <span className="font-medium text-right max-w-[60%]">{item.condition || 'N/A'}</span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Location</span>
            <span className="font-medium text-right max-w-[60%]">{item.location || 'N/A'}</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-[20px]">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
            Pricing
          </h4>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Original Price</span>
            <span className="font-mono font-medium text-right max-w-[60%]">
              ${item.original_price?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Current Price</span>
            <span className="font-mono font-medium text-right max-w-[60%]">
              ${item.current_price?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Discount</span>
            <span className="font-semibold text-right max-w-[60%] text-[#c8401a]">
              {discount}%
            </span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Quantity</span>
            <span className="font-medium text-right max-w-[60%]">{item.quantity} units</span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Total Value</span>
            <span className="font-mono font-medium text-right max-w-[60%]">
              ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Retailer Section */}
        <div className="mb-[20px]">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
            Retailer
          </h4>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Business</span>
            <span className="font-medium text-right max-w-[60%]">{item.retailer_name}</span>
          </div>
          <div className="flex justify-between mb-[7px] text-[13px]">
            <span className="text-[#888070]">Status</span>
            <span className="font-medium text-right max-w-[60%]">{item.retailer_status}</span>
          </div>
        </div>

        {/* Risk Assessment Section */}
        <div className="mb-[20px]">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
            Risk Assessment
          </h4>
          <div className="mb-[10px]">
            <span
              className="inline-flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[6px] rounded-[20px] uppercase tracking-[0.4px]"
              style={{
                background: riskBg,
                color: riskColor,
                border: `1px solid ${riskColor}`,
              }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full"
                style={{ background: riskColor }}
              ></span>
              {riskLevel} RISK
            </span>
          </div>
          <div className="mt-[8px] mb-[10px]">
            {item.flags && item.flags.length > 0 ? (
              <div className="flex flex-wrap gap-[4px]">
                {item.flags.map((flag: any, idx: number) => (
                  <RiskFlag key={idx} severity={flag.severity || 'default'}>
                    {flag.text}
                  </RiskFlag>
                ))}
              </div>
            ) : (
              <span className="text-[#1e8a52] text-[12px]">✓ No flags detected</span>
            )}
          </div>
          {item.flag_notes && (
            <div className="p-[12px] bg-[#ede9df] border border-[#d6d0c4] rounded-[4px] text-[12px] leading-[1.6] text-[#888070]">
              {item.flag_notes}
            </div>
          )}
        </div>

        {/* Admin Notes Section */}
        <div className="mb-[20px]">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
            Admin Notes
          </h4>
          <textarea
            className="w-full border-[1.5px] border-[#d6d0c4] rounded-[6px] p-[10px_12px] font-body text-[13px] resize-vertical min-h-[80px] bg-white text-[#0d0d0d] outline-none focus:border-[#0d0d0d]"
            placeholder="Add internal review notes before taking action..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="text-[11px] text-[#888070] mt-[6px]">
            Required for rejection. Optional for clearing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[10px] mt-[16px]">
          <Button variant="success" className="flex-1" onClick={handleClear}>
            ✓ Clear & Approve
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleReject}>
            ✗ Reject Listing
          </Button>
        </div>
      </div>
    </>
  );
}
