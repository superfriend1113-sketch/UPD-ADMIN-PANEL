/**
 * Pending Deals Page
 * Shows all deals awaiting admin approval
 */

import { getPendingDeals } from '@/lib/actions/deals';
import PendingDealsClient from './PendingDealsClient';

export const metadata = {
  title: 'Pending Deals | Admin Panel',
  description: 'Review and approve deal submissions',
};

export default async function PendingDealsPage() {
  const pendingDeals = await getPendingDeals();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Deals</h1>
        <p className="text-gray-600 mt-2">
          Review deal submissions and approve or reject them
        </p>
      </div>

      <PendingDealsClient deals={pendingDeals} />
    </div>
  );
}
