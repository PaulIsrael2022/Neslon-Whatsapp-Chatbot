import React from 'react';
import { Package, Clock, User, Eye } from 'lucide-react';

export default function RecentOrders() {
  // Mock data - replace with actual API call
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'John Doe',
      status: 'PENDING',
      time: '10 minutes ago',
      items: 3
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Jane Smith',
      status: 'PROCESSING',
      time: '30 minutes ago',
      items: 2
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Order
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      {order.customer}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      getStatusColor(order.status)
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      {order.time}
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}