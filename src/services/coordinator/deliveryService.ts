import axios from 'axios';
import { API_BASE_URL } from '../config';

const DELIVERY_API = `${API_BASE_URL}/api/coordinator/deliveries`;

export interface DeliveryData {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  deliveryOfficer: {
    id: string;
    name: string;
  };
  estimatedDeliveryTime: string;
  customerName: string;
  address: string;
  zone: string;
}

export const deliveryService = {
  // Get all active deliveries
  getActiveDeliveries: async () => {
    const response = await axios.get(`${DELIVERY_API}/active`);
    return response.data;
  },

  // Get delivery by ID
  getDeliveryById: async (id: string) => {
    const response = await axios.get(`${DELIVERY_API}/${id}`);
    return response.data;
  },

  // Update delivery status
  updateDeliveryStatus: async (id: string, status: string) => {
    const response = await axios.patch(`${DELIVERY_API}/${id}/status`, { status });
    return response.data;
  },

  // Update delivery priority
  updateDeliveryPriority: async (id: string, priority: string) => {
    const response = await axios.patch(`${DELIVERY_API}/${id}/priority`, { priority });
    return response.data;
  },

  // Assign delivery to officer
  assignDelivery: async (deliveryId: string, officerId: string) => {
    const response = await axios.post(`${DELIVERY_API}/${deliveryId}/assign`, { officerId });
    return response.data;
  },

  // Get delivery metrics
  getDeliveryMetrics: async () => {
    const response = await axios.get(`${DELIVERY_API}/metrics`);
    return response.data;
  }
};
