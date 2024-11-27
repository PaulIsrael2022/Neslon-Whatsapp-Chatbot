import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Clock, AlertCircle,
  CheckCircle, XCircle, MoreVertical 
} from 'lucide-react';

interface Delivery {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  deliveryOfficer: {
    name: string;
    id: string;
  };
  estimatedDeliveryTime: string;
  customerName: string;
  address: string;
  zone: string;
}

export default function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');

  // Status badge styles
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    DELAYED: 'bg-red-100 text-red-800',
    FAILED: 'bg-gray-100 text-gray-800'
  };

  // Priority badge styles
  const priorityStyles = {
    Low: 'bg-gray-100 text-gray-800',
    Medium: 'bg-blue-100 text-blue-800',
    High: 'bg-orange-100 text-orange-800',
    Emergency: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Active Deliveries</h1>
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DELAYED">Delayed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="priority">Sort by Priority</option>
            <option value="time">Sort by Time</option>
            <option value="zone">Sort by Zone</option>
          </select>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Add Delivery
          </button>
        </div>
      </div>

      {/* Delivery List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 cursor-pointer"
                   onClick={() => setSelectedDelivery(delivery)}>
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">
                        {delivery.orderNumber}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>{delivery.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex space-x-4 items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityStyles[delivery.priority]}`}>
                        {delivery.priority}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[delivery.status]}`}>
                        {delivery.status}
                      </span>
                      <div className="text-sm text-gray-500">
                        <Clock className="inline-block h-4 w-4 mr-1" />
                        {delivery.estimatedDeliveryTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => setSelectedDelivery(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delivery Details
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Order: {selectedDelivery.orderNumber}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Customer: {selectedDelivery.customerName}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Officer: {selectedDelivery.deliveryOfficer.name}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Zone: {selectedDelivery.zone}
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {/* Handle update status */}}
                >
                  Update Status
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setSelectedDelivery(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
