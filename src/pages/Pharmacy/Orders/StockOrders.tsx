import React, { useState } from 'react';
import { Plus, Package, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StockOrderModal from './StockOrderModal';
import { toast } from 'react-hot-toast';

export default function StockOrders() {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const handleCreateOrder = async (orderData: any) => {
    try {
      // Replace with actual API call
      console.log('Creating stock order:', orderData);
      toast.success('Stock order created successfully');
      setShowNewOrderModal(false);
    } catch (error) {
      console.error('Error creating stock order:', error);
      throw error;
    }
  };

  // Mock data - replace with actual API calls
  const stockOrders = [
    {
      id: '1',
      orderNumber: 'STK-2024-001',
      type: 'RESTOCK',
      supplier: 'HP Fund',
      items: 5,
      status: 'PENDING',
      total: 2500.00,
      date: '2024-03-15'
    },
    {
      id: '2',
      orderNumber: 'STK-2024-002',
      type: 'PROCUREMENT',
      supplier: 'Medical Supplies Co',
      items: 3,
      status: 'APPROVED',
      total: 1800.00,
      date: '2024-03-14'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      RECEIVED: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    return type === 'RESTOCK' ? ArrowUpRight : ArrowDownRight;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-medium text-gray-900">Stock Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage stock orders and procurement requests
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Stock Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search orders..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="">All Types</option>
              <option value="RESTOCK">Restock</option>
              <option value="PROCUREMENT">Procurement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="RECEIVED">Received</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockOrders.map((order) => {
              const TypeIcon = getTypeIcon(order.type);
              return (
                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TypeIcon className={`h-5 w-5 ${
                        order.type === 'RESTOCK' ? 'text-green-500' : 'text-blue-500'
                      } mr-2`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items} items
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(order.status)
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showNewOrderModal && (
        <StockOrderModal
          onClose={() => setShowNewOrderModal(false)}
          onSubmit={handleCreateOrder}
        />
      )}
    </div>
  );
}