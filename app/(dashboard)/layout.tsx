/**
 * Dashboard Layout
 * Protected layout that requires authentication
 */

import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth';
import AuthProvider from '@/components/auth/AuthProvider';
import Sidebar from '@/components/layout/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const session = await verifySession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        
        {/* Main content */}
        <div className="lg:pl-64">
          {/* Mobile header spacer */}
          <div className="h-14 lg:hidden" />
          
          {/* Page content */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
