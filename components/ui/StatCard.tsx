/**
 * Stat Card Component
 * Displays statistics with colored top border
 */

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: 'accent1' | 'accent2' | 'accent3' | 'accent4';
}

export default function StatCard({ label, value, subtitle, accent = 'accent1' }: StatCardProps) {
  const accentColors = {
    accent1: 'before:bg-[#c8401a]',
    accent2: 'before:bg-[#1e8a52]',
    accent3: 'before:bg-[#1a6bc8]',
    accent4: 'before:bg-[#c9a227]',
  };

  return (
    <div className={`relative bg-white border border-[#d6d0c4] rounded-[6px] p-[20px_22px] shadow-[0_2px_12px_rgba(13,13,13,0.10)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] ${accentColors[accent]}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#888070]">
        {label}
      </div>
      <div className="font-display text-[38px] tracking-[0.5px] mt-[4px] leading-none">
        {value}
      </div>
      {subtitle && (
        <div className="text-[12px] text-[#888070] mt-[4px]">
          {subtitle}
        </div>
      )}
    </div>
  );
}
