import React, { useState, useEffect } from 'react';
import Stats from '../../components/Dashboard/Stats';
import Filters from '../../components/Dashboard/Filters';
import OrderList from '../../components/Dashboard/OrderList';
import OrderDetailModal from '../../components/OrderDetail/OrderDetailModal';
import { orders } from '../../services/api';
import { websocketService } from '../../services/websocket';
import { toast } from 'react-hot-toast';
import type { Order } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ordersList, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: '-createdAt'
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadStats();
    loadOrders();
  }, [filters]);

  // Setup WebSocket listeners
  useEffect(() => {
    // Get current user token from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user) {
      // Connect to WebSocket
      websocketService.connect(token, user);

      // Handle order updates
      const handleOrderUpdate = async (event: any) => {
        const { type, order } = event;
        
        // Validate order and order ID
        if (!order || !order._id) {
          console.error('Invalid order data received:', order);
          return;
        }

        try {
          // Fetch complete order data with populated fields
          const response = await orders.getById(order._id);
          const updatedOrder = response.data;
          
          if (!updatedOrder) {
            console.error('No order data received from server');
            return;
          }

          if (type === 'created') {
            // Add new order to list if it matches current filters
            setOrders(prevOrders => [updatedOrder, ...prevOrders]);
            setPagination(prev => ({ ...prev, total: prev.total + 1 }));
            loadStats(); // Refresh stats
          } else if (type === 'updated') {
            // Update existing order with complete data
            setOrders(prevOrders => 
              prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o)
            );
            
            // If this order is currently selected, update it
            if (selectedOrder && selectedOrder._id === updatedOrder._id) {
              setSelectedOrder(updatedOrder);
            }
            
            loadStats(); // Refresh stats if needed
          }
        } catch (error) {
          console.error('Error fetching updated order:', error);
          toast.error('Failed to fetch updated order details');
        }
      };

      // Handle status updates
      const handleStatusUpdate = async (event: any) => {
        const { orderId, status, updatedBy } = event;
        
        // Validate order ID
        if (!orderId) {
          console.error('No order ID received for status update');
          return;
        }

        try {
          // Fetch complete order data with populated fields
          const response = await orders.getById(orderId);
          const updatedOrder = response.data;
          
          if (!updatedOrder) {
            console.error('No order data received from server');
            return;
          }

          setOrders(prevOrders => 
            prevOrders.map(order => order._id === orderId ? updatedOrder : order)
          );
          
          // If this order is currently selected, update it
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder(updatedOrder);
          }
          
          loadStats(); // Refresh stats
        } catch (error) {
          console.error('Error fetching updated order:', error);
          toast.error('Failed to fetch updated order details');
        }
      };

      websocketService.addEventListener('orderUpdate', handleOrderUpdate);
      websocketService.addEventListener('statusUpdate', handleStatusUpdate);

      // Cleanup
      return () => {
        websocketService.removeEventListener('orderUpdate', handleOrderUpdate);
        websocketService.removeEventListener('statusUpdate', handleStatusUpdate);
        websocketService.disconnect();
      };
    }
  }, []);

  const loadStats = async () => {
    try {
      const response = await orders.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Error loading statistics');
      console.error('Error loading stats:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orders.list(filters);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Error loading orders');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await orders.update(orderId, { status });
      toast.success('Order status updated successfully');
      // No need to reload orders - WebSocket will handle the update
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Error updating order status');
      console.error('Error updating order status:', error);
    }
  };

  const handleAssignOrder = async (orderId: string, userId: string) => {
    try {
      await orders.update(orderId, { AssignedDeliveryOfficer: userId });
      toast.success('Order assigned successfully');
      // No need to reload orders - WebSocket will handle the update
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Error assigning order');
      console.error('Error assigning order:', error);
    }
  };

  const handleAssignPharmacy = async (orderId: string, pharmacyId: string) => {
    try {
      await orders.update(orderId, { assignedPharmacy: pharmacyId });
      toast.success('Pharmacy assigned successfully');
      // No need to reload orders - WebSocket will handle the update
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Error assigning pharmacy');
      console.error('Error assigning pharmacy:', error);
    }
  };

  if (!stats) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Stats stats={stats} />
      <Filters onChange={handleFilterChange} />
      <OrderList
        orders={ordersList}
        onOrderSelect={setSelectedOrder}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onAssignOrder={handleAssignOrder}
          onAssignPharmacy={handleAssignPharmacy}
        />
      )}
    </div>
  );
}