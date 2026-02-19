/**
 * Status Pill Component
 * Displays status with colored pill and dot indicator
 */

interface StatusPillProps {
  status: 'pending' | 'approved' | 'rejected';
  count?: number;
  label?: string; // Optional custom label
}

export default function StatusPill({ status, count, label }: StatusPillProps) {
  const styles = {
    pending: 'bg-[#fef8e7] text-[#856404] border-[#f0c040]',
    approved: 'bg-[#f0faf5] text-[#1e8a52] border-[#a8dfc0]',
    rejected: 'bg-[#fef2f0] text-[#c8401a] border-[#f0b0a0]',
  };

  const defaultLabels = {
    pending: 'PENDING REVIEW',
    approved: 'APPROVED',
    rejected: 'REJECTED',
  };

  const displayLabel = label || defaultLabels[status];

  return (
    <span className={`inline-flex items-center gap-[6px] px-[14px] py-[6px] rounded-[20px] text-[12px] font-semibold tracking-[0.4px] uppercase border ${styles[status]}`}>
      <span className="w-[6px] h-[6px] rounded-full bg-current"></span>
      {count !== undefined ? `${count} ${displayLabel}` : displayLabel}
    </span>
  );
}
