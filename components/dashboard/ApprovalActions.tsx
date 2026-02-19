'use client';

/**
 * Approval Actions Component
 * UPD Design System - Approve/Reject buttons for retailer applications
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { showToast } from '../ui/Toast';

interface ApprovalActionsProps {
  retailerId: string;
}

export function ApprovalActions({ retailerId }: ApprovalActionsProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/retailers/${retailerId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        showToast('Application approved successfully', 'success');
        router.refresh();
      } else {
        showToast('Failed to approve application', 'error');
      }
    } catch (error) {
      console.error('Error approving retailer:', error);
      showToast('Error approving application', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;

    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/retailers/${retailerId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        showToast('Application rejected', 'info');
        router.refresh();
      } else {
        showToast('Failed to reject application', 'error');
      }
    } catch (error) {
      console.error('Error rejecting retailer:', error);
      showToast('Error rejecting application', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-[6px] items-center" onClick={(e) => e.stopPropagation()}>
      <Button
        size="sm"
        variant="success"
        onClick={handleApprove}
        disabled={isProcessing}
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={handleReject}
        disabled={isProcessing}
      >
        Reject
      </Button>
    </div>
  );
}

// Default export for backward compatibility
export default ApprovalActions;
