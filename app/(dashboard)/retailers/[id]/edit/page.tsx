import { notFound } from 'next/navigation';
import { getRetailer, updateRetailer } from '../../../../../lib/actions/retailers';
import RetailerForm from '../../../../../components/forms/RetailerForm';

export default async function EditRetailerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const retailer = await getRetailer(id);
  if (!retailer) notFound();
  
  const handleUpdate = async (formData: FormData) => {
    'use server';
    return updateRetailer(id, formData);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Retailer</h1>
        <p className="text-gray-600 mt-2">Update retailer information</p>
      </div>
      <RetailerForm retailer={retailer} mode="edit" onSubmit={handleUpdate} />
    </div>
  );
}
