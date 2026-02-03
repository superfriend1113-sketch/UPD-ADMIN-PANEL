import Link from 'next/link';
import { getRetailers } from '../../../lib/actions/retailers';
import RetailersListClient from './RetailersListClient';

export default async function RetailersPage() {
  const retailers = await getRetailers();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Retailers Management</h1>
        <p className="text-gray-600 mt-2">Manage retailer information and partnerships</p>
      </div>
      <RetailersListClient initialRetailers={retailers} />
    </div>
  );
}
