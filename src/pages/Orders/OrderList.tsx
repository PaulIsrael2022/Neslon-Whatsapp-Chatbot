import React from 'react';
import { Package, MapPin, User, Calendar, Clock } from 'lucide-react';
import type { Order } from '../../types';
import Pagination from '../../components/Pagination';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

export default function OrderList({ 
  orders, 
  onOrderSelect, 
  loading,
  pagination,
  onPageChange
}: OrderListProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    READY_FOR_PICKUP: 'bg-green-100 text-green-800',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-gray-100 text-gray-800'
  };

  // Helper function to safely format text with fallback
  const formatText = (text: string | undefined): string => {
    if (!text) return '';
    return text.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No orders match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              // Safely get the status color with fallback
              const statusColor = order.status ? statusColors[order.status] : 'bg-gray-100 text-gray-800';
              
              return (
                <tr
                  key={order._id}
                  onClick={() => onOrderSelect(order)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatText(order.orderType)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user ? `${order.user.firstName || ''} ${order.user.surname || ''}`.trim() || 'N/A' : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.phoneNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {order.deliveryMethod || 'N/A'}
                        </div>
                        {order.deliverySchedule && (
                          <div className="text-sm text-gray-500">
                            {order.deliverySchedule}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                      {formatText(order.status) || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatText(order.orderCategory) || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderSelect(order);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}