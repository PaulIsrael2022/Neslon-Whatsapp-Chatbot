import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertTriangle, DollarSign } from 'lucide-react';
import StatsCards from './StatsCards';
import RecentOrders from './RecentOrders';
import LowStockAlerts from './LowStockAlerts';
import ActivityTimeline from './ActivityTimeline';
import { orders, inventory } from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingDeliveries: 0,
    lowStockItems: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load stats, orders, inventory data
      // Replace with actual API calls
      const statsResponse = await orders.getStats();
      setStats({
        todayOrders: statsResponse.data.totalOrders,
        pendingDeliveries: statsResponse.data.outForDelivery,
        lowStockItems: 5, // Replace with actual count
        revenue: 15000 // Replace with actual revenue
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Deliveries',
      value: stats.pendingDeliveries,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: "Today's Revenue",
      value: `R${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your pharmacy's performance and activities
        </p>
      </div>

      <StatsCards stats={statCards} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <RecentOrders />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Low Stock Alerts</h2>
            <LowStockAlerts />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Activity Timeline</h2>
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}