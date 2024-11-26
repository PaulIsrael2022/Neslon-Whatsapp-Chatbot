import React, { useState, useEffect } from 'react';
import { Edit2, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import type { DeliveryZone } from '../../types';
import { deliveryZones } from '../../services/api';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination';

interface DeliveryZonesProps {
  onEditZone: (zone: DeliveryZone) => void;
}

export default function DeliveryZones({ onEditZone }: DeliveryZonesProps) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  useEffect(() => {
    loadZones();
  }, [pagination.page]);

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await deliveryZones.list({
        page: pagination.page,
        limit: 10
      });
      setZones(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading delivery zones:', error);
      toast.error('Failed to load delivery zones');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No delivery zones found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new delivery zone.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Zone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Areas Covered
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pricing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statistics
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {zones.map((zone) => (
            <tr key={zone._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <MapPin className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                    <div className="text-sm text-gray-500">{zone.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {zone.areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-1 mb-1"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div>Base Price: R{zone.basePrice.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">
                    R{zone.pricePerKm.toFixed(2)}/km up to {zone.maxDistance}km
                  </div>
                  <div className="text-sm text-gray-500">
                    Min. Order: R{zone.minimumOrder.toFixed(2)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div>Total Deliveries: {zone.stats.totalDeliveries}</div>
                  <div className="text-sm text-gray-500">
                    Success Rate: {((zone.stats.successfulDeliveries / zone.stats.totalDeliveries) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg. Rating: {zone.stats.customerRating.toFixed(1)}/5
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  zone.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {zone.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="mt-1 text-sm text-gray-500">
                  {zone.assignedDrivers.length} Drivers
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEditZone(zone)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}