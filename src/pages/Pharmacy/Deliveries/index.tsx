import React, { useState, useEffect } from 'react';
import { deliveries } from '../../../services/api';
import { toast } from 'react-hot-toast';
import DeliveryList from './DeliveryList';
import DeliveryFilters from './DeliveryFilters';
import type { Delivery } from '../../../types';

export default function PharmacyDeliveries() {
  const [deliveriesList, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date: ''
  });

  useEffect(() => {
    loadDeliveries();
  }, [filters]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveries.list(filters);
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Status</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage delivery status for all orders
        </p>
      </div>

      <DeliveryFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="mt-8">
        <DeliveryList
          deliveries={deliveriesList}
          loading={loading}
          onStatusUpdate={loadDeliveries}
        />
      </div>
    </div>
  );
}