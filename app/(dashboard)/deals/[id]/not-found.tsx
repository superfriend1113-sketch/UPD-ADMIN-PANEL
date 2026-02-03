/**
 * Deal Not Found Page
 */

import Link from 'next/link';
import Button from '../../../../components/ui/Button';

export default function DealNotFound() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Deal Not Found</h1>
        <p className="text-gray-600 mb-8">
          The deal you're looking for doesn't exist or has been deleted.
        </p>
        
        <Link href="/deals">
          <Button variant="primary">Back to Deals</Button>
        </Link>
      </div>
    </div>
  );
}
