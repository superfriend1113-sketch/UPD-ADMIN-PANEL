/**
 * Pending Retailers Page
 * Shows all retailers awaiting admin approval
 */

import { getPendingRetailers } from '@/lib/actions/retailers';
import PendingRetailersClient from './PendingRetailersClient';

export const metadata = {
  title: 'Pending Retailers | Admin Panel',
  description: 'Review and approve retailer applications',
};

export default async function PendingRetailersPage() {
  const pendingRetailers = await getPendingRetailers();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Retailers</h1>
        <p className="text-gray-600 mt-2">
          Review retailer applications and approve or reject them
        </p>
      </div>

      <PendingRetailersClient retailers={pendingRetailers} />
    </div>
  );
}
