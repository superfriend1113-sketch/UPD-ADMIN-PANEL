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
          ? 'text-[#f5f2eb] border-l-[#c8401a] bg-[rgba(200,64,26,0.12)]'
          : 'text-[#999] border-l-transparent hover:text-[#f5f2eb] hover:bg-[rgba(255,255,255,0.05)]'
      }`}
    >
      <span className="text-[16px] w-[18px] text-center">{icon}</span>
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto bg-[#c8401a] text-white text-[10px] font-bold rounded-[10px] px-[7px] py-[1px]">
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
    <aside className="w-[220px] bg-[#0d0d0d] py-[24px] flex-shrink-0">
      <div className="px-[20px] pb-[20px] border-b border-[#222] mb-[8px]">
        <div className="font-display text-[18px] text-[#f5f2eb]">Admin</div>
        <div className="text-[11px] text-[#555] mt-[2px]">Platform Operations</div>
      </div>

      <div className="text-[10px] font-semibold text-[#555] tracking-[1.2px] uppercase px-[20px] mb-[8px] mt-[20px]">
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

      <div className="text-[10px] font-semibold text-[#555] tracking-[1.2px] uppercase px-[20px] mb-[8px] mt-[20px]">
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
