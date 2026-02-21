'use client';

/**
 * Admin Sidebar
 * Left sidebar navigation for admin panel
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
  count?: number;
  active?: boolean;
}

function SidebarItem({ href, icon, label, count, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-[10px] px-[20px] py-[10px] text-[13.5px] transition-all duration-150 border-l-[3px] cursor-pointer ${
        active
          ? 'text-white border-l-white bg-[#1e3a8a]'
          : 'text-[rgba(255,255,255,0.8)] border-l-transparent hover:text-white hover:bg-[#1e3a8a]'
      }`}
    >
      <span className="text-[16px] w-[18px] text-center">{icon}</span>
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto bg-white text-[#059669] text-[10px] font-bold rounded-[10px] px-[7px] py-[1px]">
          {count}
        </span>
      )}
    </Link>
  );
}

interface AdminSidebarProps {
  pendingCount?: number;
}

export default function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-[#059669] py-[24px] flex-shrink-0">
      <div className="px-[20px] pb-[20px] border-b border-[rgba(255,255,255,0.2)] mb-[8px]">
        <div className="font-display text-[18px] text-white">Admin</div>
        <div className="text-[11px] text-[rgba(255,255,255,0.6)] mt-[2px]">Platform Operations</div>
      </div>

      <div className="text-[10px] font-semibold text-[rgba(255,255,255,0.6)] tracking-[1.2px] uppercase px-[20px] mb-[8px] mt-[20px]">
        Review
      </div>
      <SidebarItem
        href="/pending"
        icon="📋"
        label="Pending Applications"
        count={pendingCount}
        active={pathname === '/pending' || pathname.startsWith('/pending/')}
      />
      <SidebarItem
        href="/approved"
        icon="✅"
        label="Approved Retailers"
        active={pathname === '/approved' || pathname.startsWith('/approved/')}
      />
      <SidebarItem
        href="/rejected"
        icon="🚫"
        label="Rejected"
        active={pathname === '/rejected' || pathname.startsWith('/rejected/')}
      />

      <div className="text-[10px] font-semibold text-[rgba(255,255,255,0.6)] tracking-[1.2px] uppercase px-[20px] mb-[8px] mt-[20px]">
        Platform
      </div>
      <SidebarItem
        href="/inventory"
        icon="📦"
        label="Flagged Inventory"
        active={pathname === '/inventory' || pathname.startsWith('/inventory/')}
      />
      <SidebarItem
        href="/logs"
        icon="📊"
        label="Activity Log"
        active={pathname === '/logs' || pathname.startsWith('/logs/')}
      />
    </aside>
  );
}
