'use client';

/**
 * Application Detail Panel
 * Side panel for reviewing retailer applications in detail
 */

import { useState } from 'react';
import Button from '@/components/ui/Button';
import RiskFlag from '@/components/ui/RiskFlag';
import { showToast } from '@/components/ui/Toast';

interface ApplicationDetailPanelProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (notes?: string) => void;
  onReject: (notes?: string) => void;
}

export default function ApplicationDetailPanel({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ApplicationDetailPanelProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !application) return null;

  const handleApprove = () => {
    onApprove(notes || 'Approved by admin review');
  };

  const handleReject = () => {
    if (!notes.trim()) {
      showToast('Please provide a reason for rejection in the internal notes', 'error');
      return;
    }
    onReject(notes);
  };

  // Calculate risk flags
  const riskFlags: { text: string; severity: 'default' | 'high' }[] = [];
  const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const emailDomain = application.email?.split('@')[1]?.toLowerCase();
  
  if (emailDomain && freeEmailDomains.includes(emailDomain)) {
    riskFlags.push({ text: 'Free email domain', severity: 'default' });
  }
  
  if (!application.website_url || application.website_url === 'None provided') {
    riskFlags.push({ text: 'No website  cannot verify legitimacy', severity: 'high' });
  }
  
  const currentYear = new Date().getFullYear();
  if (application.year_established && currentYear - application.year_established < 3) {
    riskFlags.push({ text: `Entity established recently (${application.year_established})`, severity: 'default' });
  }

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
        <h3 className="text-[15px] font-bold">Application Review</h3>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-[7px] px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold cursor-pointer border-[1.5px] border-[#d6d0c4] bg-transparent text-[#0d0d0d] transition-all duration-150 hover:border-[#0d0d0d]"
        >
          ✕ Close
        </button>
      </div>

      {/* Identity Section */}
      <div className="mb-[20px]">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
          Identity
        </h4>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Business Name</span>
          <span className="font-medium text-right max-w-[60%]">{application.name}</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Entity Type</span>
          <span className="font-medium text-right max-w-[60%]">{application.entity_type || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">State</span>
          <span className="font-medium text-right max-w-[60%]">{application.state}</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Year Est.</span>
          <span className="font-medium text-right max-w-[60%]">{application.year_established}</span>
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
            {application.email}
          </span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Phone</span>
          <span className="font-medium text-right max-w-[60%]">{application.phone || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Website</span>
          <span className="font-medium text-right max-w-[60%] break-all">
            {application.website_url || 'None provided'}
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
          <span className="font-medium text-right max-w-[60%]">{application.volume}/mo</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Categories</span>
          <span className="font-medium text-right max-w-[60%]">
            {application.categories?.join(', ') || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Conditions</span>
          <span className="font-medium text-right max-w-[60%]">
            {application.conditions?.join(', ') || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Discount Range</span>
          <span className="font-medium text-right max-w-[60%]">{application.discount_range || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Storage</span>
          <span className="font-medium text-right max-w-[60%]">{application.storage_location || 'N/A'}</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="mb-[20px]">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
          Controls
        </h4>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Min. Margin</span>
          <span className="font-medium text-right max-w-[60%]">{application.min_margin || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Dynamic Markdowns</span>
          <span className="font-medium text-right max-w-[60%]">
            {application.allow_dynamic_markdowns ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between mb-[7px] text-[13px]">
          <span className="text-[#888070]">Flash Sales</span>
          <span className="font-medium text-right max-w-[60%]">
            {application.allow_flash_sales ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Risk Flags Section */}
      <div className="mb-[20px]">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
          Risk Flags
        </h4>
        <div className="mt-[4px]">
          {riskFlags.length > 0 ? (
            <div className="flex flex-wrap gap-[4px]">
              {riskFlags.map((flag, idx) => (
                <RiskFlag key={idx} severity={flag.severity}>
                  {flag.text}
                </RiskFlag>
              ))}
            </div>
          ) : (
            <span className="text-[#1e8a52] text-[12px]">✓ No flags detected</span>
          )}
        </div>
      </div>

      {/* Internal Notes Section */}
      <div className="mb-[20px]">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#888070] mb-[10px] pb-[6px] border-b border-[#d6d0c4]">
          Internal Notes
        </h4>
        <textarea
          className="w-full border-[1.5px] border-[#d6d0c4] rounded-[6px] p-[10px_12px] font-body text-[13px] resize-vertical min-h-[80px] bg-white text-[#0d0d0d] outline-none focus:border-[#0d0d0d]"
          placeholder="Add review notes for this applicant... (Required for rejection)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="text-[11px] text-[#888070] mt-[6px]">
          These notes will be saved with the approval/rejection decision.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[10px] mt-[16px]">
        <Button variant="success" className="flex-1" onClick={handleApprove}>
          ✓ Approve
        </Button>
        <Button variant="danger" className="flex-1" onClick={handleReject}>
          ✗ Reject
        </Button>
      </div>
    </div>
    </>
  );
}
