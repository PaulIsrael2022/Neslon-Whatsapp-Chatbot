import { useState, useEffect } from 'react';
import { deliveryService, DeliveryData } from '../../services/coordinator/deliveryService';

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getActiveDeliveries();
      setDeliveries(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deliveries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id: string, status: string) => {
    try {
      await deliveryService.updateDeliveryStatus(id, status);
      await fetchDeliveries(); // Refresh the list
    } catch (err) {
      setError('Failed to update delivery status');
      console.error(err);
    }
  };

  const updateDeliveryPriority = async (id: string, priority: string) => {
    try {
      await deliveryService.updateDeliveryPriority(id, priority);
      await fetchDeliveries(); // Refresh the list
    } catch (err) {
      setError('Failed to update delivery priority');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return {
    deliveries,
    loading,
    error,
    updateDeliveryStatus,
    updateDeliveryPriority,
    refreshDeliveries: fetchDeliveries
  };
};
