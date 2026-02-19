/**
 * Dashboard Layout
 * Protected layout with UPD design system
 */

import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/layout/AdminNav';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check with admin role requirement
  try {
    await requireRole('admin');
  } catch (error) {
    // Redirect to login if not authenticated or not an admin
    redirect('/login');
  }

  // Get pending applications count
  const supabase = await createClient();
  const { count: pendingCount } = await supabase
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <AdminNav />
      
      <div className="flex min-h-[calc(100vh-56px)]">
        <AdminSidebar pendingCount={pendingCount || 0} />
        
        {/* Main content */}
        <main className="flex-1 p-[32px] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
