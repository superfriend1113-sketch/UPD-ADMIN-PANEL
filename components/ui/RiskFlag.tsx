/**
 * Risk Flag Component
 * Displays risk/warning indicators
 */

interface RiskFlagProps {
  children: React.ReactNode;
  severity?: 'default' | 'high';
}

export default function RiskFlag({ children, severity = 'default' }: RiskFlagProps) {
  const styles = {
    default: 'bg-[#fef8e7] text-[#856404] border-[#f0c040]',
    high: 'bg-[#fef2f0] text-[#c8401a] border-[#f0b0a0]',
  };

  return (
    <span className={`inline-flex items-center gap-[4px] border rounded-[4px] text-[11px] font-medium px-[8px] py-[2px] ${styles[severity]}`}>
      {children}
    </span>
  );
}
