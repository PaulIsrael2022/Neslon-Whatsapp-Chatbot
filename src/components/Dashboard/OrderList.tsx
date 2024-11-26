import React, { useEffect, useRef } from 'react';
import { Eye, Package, Calendar, MapPin, Clock } from 'lucide-react';
import type { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  loading: boolean;
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
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
  const tableRef = useRef<HTMLDivElement>(null);

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    READY_FOR_PICKUP: 'bg-green-100 text-green-800',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-gray-100 text-gray-800'
  };

  // Handle smooth animations for updates
  useEffect(() => {
    const rows = tableRef.current?.querySelectorAll('tr[data-order-id]');
    rows?.forEach(row => {
      row.classList.add('transition-all', 'duration-500');
    });
  }, [orders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
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
    <div className="mt-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <p className="mt-2 text-sm text-gray-700">
            A comprehensive list of all orders with detailed information.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div ref={tableRef} className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Order Number
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Delivery Method
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      data-order-id={order._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onOrderSelect(order)}
                    >
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">
                            {order.orderNumber}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.user?.firstName} {order.user?.surname}
                            </div>
                            <div className="text-gray-500">{order.user?.phoneNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                          {order.deliveryMethod}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrderSelect(order);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="sr-only">View order</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(pagination.pages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.pages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{orders.length}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => onPageChange(Math.min(pagination.pages, pagination.currentPage + 1))}
                  disabled={pagination.currentPage === pagination.pages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}