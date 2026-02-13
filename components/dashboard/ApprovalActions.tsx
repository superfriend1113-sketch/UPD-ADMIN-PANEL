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
        <div className="space-y-5">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  You are about to reject:
                </p>
                <p className="text-sm font-semibold text-red-800">{itemName}</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason Input */}
          <div>
            <label htmlFor="rejection-reason" className="block text-sm font-semibold text-gray-900 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Provide a clear explanation that will be sent to the {itemType}. Be specific and professional.
            </p>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none"
              placeholder="Example: Your business documentation is incomplete. Please provide valid business registration and tax identification documents."
              disabled={isProcessing}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {rejectionReason.length} characters
              </p>
              {rejectionReason.length < 20 && rejectionReason.length > 0 && (
                <p className="text-xs text-amber-600">
                  Please provide more detail (minimum 20 characters)
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason('');
                setError(null);
              }}
              variant="secondary"
              disabled={isProcessing}
              className="px-5 py-2.5 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim() || rejectionReason.length < 20}
              className="bg-red-600 hover:bg-red-700 px-5 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Rejecting...
                </span>
              ) : (
                'Confirm Rejection'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
