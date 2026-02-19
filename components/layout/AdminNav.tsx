'use client';

/**
 * Admin Navigation Bar
 * Top navigation with logo and tabs
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="bg-[#0d0d0d] px-[32px] flex items-center justify-between h-[56px] sticky top-0 z-100 border-b-[3px] border-[#c8401a]">
      <Link href="/" className="font-display text-[22px] text-[#f5f2eb] tracking-[1px]">
        UPD<span className="text-[#c8401a]">·</span>Admin
      </Link>
      
      <div className="flex gap-[4px]">
        <Link
          href="/pending"
          className={`px-[16px] py-[8px] rounded-[4px] text-[13px] font-medium tracking-[0.3px] transition-all ${
            isActive('/pending')
              ? 'bg-[#c8401a] text-[#f5f2eb]'
              : 'text-[#888070] hover:text-[#f5f2eb] hover:bg-[rgba(255,255,255,0.07)]'
          }`}
        >
          Pending Applications
        </Link>
        <Link
          href="/approved"
          className={`px-[16px] py-[8px] rounded-[4px] text-[13px] font-medium tracking-[0.3px] transition-all ${
            isActive('/approved')
              ? 'bg-[#c8401a] text-[#f5f2eb]'
              : 'text-[#888070] hover:text-[#f5f2eb] hover:bg-[rgba(255,255,255,0.07)]'
          }`}
        >
          Approved Retailers
        </Link>
        <Link
          href="/rejected"
          className={`px-[16px] py-[8px] rounded-[4px] text-[13px] font-medium tracking-[0.3px] transition-all ${
            isActive('/rejected')
              ? 'bg-[#c8401a] text-[#f5f2eb]'
              : 'text-[#888070] hover:text-[#f5f2eb] hover:bg-[rgba(255,255,255,0.07)]'
          }`}
        >
          Rejected
        </Link>
      </div>
    </nav>
  );
}
