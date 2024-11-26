import { mockOrders, mockStats, mockUsers } from './data';
import type { Order } from '../types';

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const userRecord = mockUsers[email];
      if (userRecord && userRecord.password === password) {
        return userRecord.user;
      }
      throw new Error('Invalid credentials');
    }
  },
  orders: {
    list: async (filters?: {
      search?: string;
      status?: Order['status'];
      dateFrom?: string;
    }) => {
      let filteredOrders = [...mockOrders];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(
          order =>
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.patientName.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.status) {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }

      if (filters?.dateFrom) {
        filteredOrders = filteredOrders.filter(
          order => new Date(order.orderDate) >= new Date(filters.dateFrom)
        );
      }

      return filteredOrders;
    },
    updateStatus: async (orderId: string, status: Order['status']) => {
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
      return order;
    },
    assignDelivery: async (orderId: string, userId: string) => {
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
        order.assignedTo = userId;
      }
      return order;
    }
  },
  stats: {
    get: async () => mockStats
  }
};