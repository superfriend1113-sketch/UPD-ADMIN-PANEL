/**
 * Chip Component
 * Small label/tag component
 */

interface ChipProps {
  children: React.ReactNode;
}

export default function Chip({ children }: ChipProps) {
  return (
    <span className="inline-block bg-[#ede9df] border border-[#d6d0c4] rounded-[4px] text-[11px] font-medium px-[8px] py-[2px] text-[#0d0d0d]">
      {children}
    </span>
  );
}
