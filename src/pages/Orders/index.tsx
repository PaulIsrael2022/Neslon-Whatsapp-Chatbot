import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import OrderList from './OrderList';
import OrderFilters from './OrderFilters';
import OrderDetailModal from '../../components/OrderDetail/OrderDetailModal';
import Pagination from '../../components/Pagination';
import { orders } from '../../services/api';
import { toast } from 'react-hot-toast';
import { websocketService } from '../../services/websocket';
import type { Order, OrderFilters as OrderFiltersType, OrderStatus } from '../../types';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<OrderFiltersType>({
    search: '',
    status: '',
    orderType: '',
    orderCategory: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sort: '-createdAt'
  });

  // Memoized filtered orders and counts
  const { filteredOrders, categoryCounts } = useMemo(() => {
    // Apply search filter
    let filtered = allOrders;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.customer?.name?.toLowerCase().includes(searchLower) ||
        order.customer?.phone?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Apply order type filter
    if (filters.orderType) {
      filtered = filtered.filter(order => order.orderType === filters.orderType);
    }

    // Apply tab category filter
    if (activeTab !== 'all') {
      const categoryMap = {
        'whatsapp': 'WHATSAPP_REQUEST',
        'pharmacy': 'PHARMACY_PICKUP',
        'customer': 'CUSTOMER_PICKUP'
      };
      filtered = filtered.filter(order => order.orderCategory === categoryMap[activeTab]);
    }

    // Calculate category counts
    const counts = {
      whatsappRequests: allOrders.filter(order => order.orderCategory === 'WHATSAPP_REQUEST').length,
      pharmacyPickups: allOrders.filter(order => order.orderCategory === 'PHARMACY_PICKUP').length,
      customerPickups: allOrders.filter(order => order.orderCategory === 'CUSTOMER_PICKUP').length
    };

    return {
      filteredOrders: filtered,
      categoryCounts: counts
    };
  }, [allOrders, filters.search, filters.status, filters.orderType, activeTab]);

  // Memoized pagination
  const pagination = useMemo(() => {
    const total = filteredOrders.length;
    const pages = Math.ceil(total / filters.limit);
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    
    return {
      total,
      pages,
      page: filters.page,
      displayedOrders: filteredOrders.slice(start, end)
    };
  }, [filteredOrders, filters.page, filters.limit]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Fetch all orders without pagination
      const response = await orders.list({ 
        ...filters, 
        page: 1,
        limit: 1000 // Adjust this based on your expected maximum orders
      });
      setAllOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Setup WebSocket listeners
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user) {
      websocketService.connect(token, user);

      const handleOrderUpdate = async (event: any) => {
        const { type, order } = event;
        if (!order || !order._id) {
          console.error('Invalid order data received:', order);
          return;
        }

        try {
          const response = await orders.getById(order._id);
          const updatedOrder = response.data;
          
          if (!updatedOrder) return;

          setAllOrders(prevOrders => {
            if (type === 'created') {
              return [updatedOrder, ...prevOrders];
            } else if (type === 'updated') {
              return prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o);
            }
            return prevOrders;
          });

          if (selectedOrder && selectedOrder._id === updatedOrder._id) {
            setSelectedOrder(updatedOrder);
          }
        } catch (error) {
          console.error('Error fetching updated order:', error);
          toast.error('Failed to fetch updated order details');
        }
      };

      const handleStatusUpdate = async (event: any) => {
        const { orderId } = event;
        if (!orderId) return;

        try {
          const response = await orders.getById(orderId);
          const updatedOrder = response.data;
          
          if (!updatedOrder) return;

          setAllOrders(prevOrders => 
            prevOrders.map(order => order._id === orderId ? updatedOrder : order)
          );
          
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder(updatedOrder);
          }
        } catch (error) {
          console.error('Error fetching updated order:', error);
          toast.error('Failed to fetch updated order details');
        }
      };

      websocketService.addEventListener('orderUpdate', handleOrderUpdate);
      websocketService.addEventListener('statusUpdate', handleStatusUpdate);

      return () => {
        websocketService.removeEventListener('orderUpdate', handleOrderUpdate);
        websocketService.removeEventListener('statusUpdate', handleStatusUpdate);
      };
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOrders();
  }, []);

  const handleFilterChange = (newFilters: Partial<OrderFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusChange = async (status: OrderStatus, note?: string) => {
    if (!selectedOrder) return;
    try {
      await orders.updateStatus(selectedOrder._id, { status, note });
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleAssignOrder = async (userId: string) => {
    if (!selectedOrder) return;
    try {
      await orders.assignDeliveryOfficer(selectedOrder._id, userId);
      toast.success('Delivery officer assigned successfully');
    } catch (error) {
      console.error('Error assigning delivery officer:', error);
      toast.error('Failed to assign delivery officer');
    }
  };

  const handleAssignPharmacy = async (pharmacyId: string) => {
    if (!selectedOrder) return;
    try {
      await orders.assignPharmacy(selectedOrder._id, pharmacyId);
      toast.success('Pharmacy assigned successfully');
    } catch (error) {
      console.error('Error assigning pharmacy:', error);
      toast.error('Failed to assign pharmacy');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">
            All Orders ({pagination.total})
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            WhatsApp Requests ({categoryCounts.whatsappRequests})
          </TabsTrigger>
          <TabsTrigger value="pharmacy">
            Pharmacy Pickups ({categoryCounts.pharmacyPickups})
          </TabsTrigger>
          <TabsTrigger value="customer">
            Customer Pickups ({categoryCounts.customerPickups})
          </TabsTrigger>
        </TabsList>

        <OrderFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        <div className="mt-6">
          <OrderList
            orders={pagination.displayedOrders}
            onOrderSelect={setSelectedOrder}
            loading={loading}
            pagination={{
              total: pagination.total,
              page: pagination.page,
              pages: pagination.pages
            }}
            onPageChange={handlePageChange}
          />
        </div>
      </Tabs>

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