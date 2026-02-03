import { createRetailer } from '../../../../lib/actions/retailers';
import RetailerForm from '../../../../components/forms/RetailerForm';

export default async function CreateRetailerPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Retailer</h1>
        <p className="text-gray-600 mt-2">Add a new retailer partner</p>
      </div>
      <RetailerForm mode="create" onSubmit={createRetailer} />
    </div>
  );
}
