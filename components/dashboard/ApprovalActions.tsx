'use client';

/**
 * Approval Actions Component
 * Provides approve/reject buttons with modal for rejection reason
 */

import { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useRouter } from 'next/navigation';

interface ApprovalActionsProps {
  itemId: string;
  itemType: 'deal' | 'retailer';
  itemName: string;
  onApprove: (id: string) => Promise<{ success: boolean; message: string }>;
  onReject: (id: string, reason: string) => Promise<{ success: boolean; message: string }>;
}

export default function ApprovalActions({
  itemId,
  itemType,
  itemName,
  onApprove,
  onReject,
}: ApprovalActionsProps) {
  const router = useRouter();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await onApprove(itemId);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;

    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await onReject(itemId, rejectionReason);

      if (result.success) {
        setIsRejectModalOpen(false);
        setRejectionReason('');
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700"
        >
          Approve
        </Button>
        <Button
          onClick={() => setIsRejectModalOpen(true)}
          disabled={isProcessing}
          variant="secondary"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Reject
        </Button>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
          setError(null);
        }}
        title={`Reject ${itemType}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to reject: <strong>{itemName}</strong>
          </p>

          <div>
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why this is being rejected..."
              disabled={isProcessing}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason('');
                setError(null);
              }}
              variant="secondary"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
