/**
 * MetricsCard Component
 * Displays a single dashboard metric with icon and loading state
 */

import LoadingSpinner from '../ui/LoadingSpinner';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
}

export default function MetricsCard({ title, value, icon, loading = false }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <LoadingSpinner size="sm" className="mt-2" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>
        <div className="shrink-0 ml-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
