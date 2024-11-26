import React, { useState, useEffect } from 'react';
import { Package, MapPin, User, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Delivery } from '../../types';
import { deliveries } from '../../services/api';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination';

interface DeliveryListProps {
  filters: {
    search: string;
    status: string;
    dateRange: string;
  };
}

export default function DeliveryList({ filters }: DeliveryListProps) {
  const [deliveriesList, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  useEffect(() => {
    loadDeliveries();
  }, [filters]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveries.list({
        search: filters.search,
        status: filters.status,
        page: pagination.page,
        limit: 10
      });
      setDeliveries(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ASSIGNED: 'bg-blue-100 text-blue-800',
    PICKED_UP: 'bg-purple-100 text-purple-800',
    IN_TRANSIT: 'bg-indigo-100 text-indigo-800',
    ARRIVED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (deliveriesList.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No deliveries found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters or create a new delivery.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {deliveriesList.map((delivery) => (
            <div key={delivery._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {typeof delivery.order === 'object' ? delivery.order.orderNumber : 'Loading...'}
                      </h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[delivery.status]
                      }`}>
                        {delivery.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {delivery.deliveryAddress.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {typeof delivery.deliveryOfficer === 'object' 
                        ? `${delivery.deliveryOfficer.firstName} ${delivery.deliveryOfficer.surname}`
                        : 'Unassigned'
                      }
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {delivery.deliverySchedule}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Zone: {typeof delivery.zone === 'object' ? delivery.zone.name : 'Loading...'}</div>
                    <div>ETA: {delivery.estimatedArrival 
                      ? new Date(delivery.estimatedArrival).toLocaleTimeString() 
                      : 'Not available'}</div>
                  </div>
                </div>
              </div>
              {delivery.status === 'IN_TRANSIT' && delivery.trackingUpdates.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      Last Update: {new Date(delivery.trackingUpdates[delivery.trackingUpdates.length - 1].timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {delivery.trackingUpdates[delivery.trackingUpdates.length - 1].location.address}
                    </div>
                  </div>
                  <div className="mt-2 relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: "45%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-6">
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