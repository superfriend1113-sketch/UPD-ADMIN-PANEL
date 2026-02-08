/**
 * Dashboard Page
 * Main admin dashboard with metrics and overview
 */

import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/adminConfig';

export const dynamic = 'force-dynamic';

async function getDashboardMetrics() {
  const now = new Date().toISOString();

  // Fetch all deals
  const { data: deals, error: dealsError } = await supabaseAdmin
    .from('deals')
    .select('id, is_active, expiration_date, status');

  if (dealsError) throw dealsError;

  // Calculate metrics
  const totalDeals = deals?.length || 0;
  const activeDeals = deals?.filter(deal => 
    deal.is_active && deal.expiration_date && new Date(deal.expiration_date) > new Date(now)
  ).length || 0;
  const expiredDeals = deals?.filter(deal => 
    deal.expiration_date && new Date(deal.expiration_date) <= new Date(now)
  ).length || 0;
  const pendingDeals = deals?.filter(deal => deal.status === 'pending').length || 0;

  // Fetch categories and retailers counts
  const { count: categoriesCount } = await supabaseAdmin
    .from('categories')
    .select('*', { count: 'exact', head: true });

  const { count: retailersCount } = await supabaseAdmin
    .from('retailers')
    .select('*', { count: 'exact', head: true });

  const { count: pendingRetailersCount } = await supabaseAdmin
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return {
    totalDeals,
    activeDeals,
    expiredDeals,
    pendingDeals,
    totalCategories: categoriesCount || 0,
    totalRetailers: retailersCount || 0,
    pendingRetailers: pendingRetailersCount || 0,
  };
}

export default async function DashboardPage() {
  const session = await requireAuth();
  const metrics = await getDashboardMetrics();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session.email}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalDeals}</p>
          <p className="text-sm text-gray-600">Total Deals</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.activeDeals}</p>
          <p className="text-sm text-gray-600">Active Deals</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.expiredDeals}</p>
          <p className="text-sm text-gray-600">Expired Deals</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalCategories}</p>
          <p className="text-sm text-gray-600">Categories</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalRetailers}</p>
          <p className="text-sm text-gray-600">Retailers</p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {(metrics.pendingDeals > 0 || metrics.pendingRetailers > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Deals */}
            {metrics.pendingDeals > 0 && (
              <Link href="/deals/pending" className="block">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow hover:border-yellow-400">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800">
                      {metrics.pendingDeals} pending
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pending Deals</h3>
                  <p className="text-gray-600 text-sm">Review and approve submitted deals</p>
                </div>
              </Link>
            )}

            {/* Pending Retailers */}
            {metrics.pendingRetailers > 0 && (
              <Link href="/retailers/pending" className="block">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow hover:border-orange-400">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-200 text-orange-800">
                      {metrics.pendingRetailers} pending
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pending Retailers</h3>
                  <p className="text-gray-600 text-sm">Review and approve retailer applications</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Deals Card */}
        <Link href="/deals" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-blue-400">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Deals</h3>
            <p className="text-gray-600 text-sm">Manage all deals, create new offers, and track performance</p>
          </div>
        </Link>

        {/* Categories Card */}
        <Link href="/categories" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-green-400">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Categories</h3>
            <p className="text-gray-600 text-sm">Organize deals into categories and manage display order</p>
          </div>
        </Link>

        {/* Retailers Card */}
        <Link href="/retailers" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-purple-400">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Retailers</h3>
            <p className="text-gray-600 text-sm">Manage retailer information and affiliate partnerships</p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Deal Management Ready!
        </h2>
        <p className="text-gray-600 mb-6">
          You can now create and manage deals. Click on the cards above to get started.
        </p>
      </div>
    </div>
  );
}
