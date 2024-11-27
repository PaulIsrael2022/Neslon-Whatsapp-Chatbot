import React, { useState, useEffect } from 'react';
import { Package, MapPin, User, Clock, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Delivery {
  id: string;
  orderNumber: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  officer?: {
    name: string;
    phone: string;
  };
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  zone: string;
}

export default function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // TODO: Load active deliveries from API
    const mockDeliveries: Delivery[] = [
      {
        id: '1',
        orderNumber: 'DEL-001',
        status: 'pending',
        customer: {
          name: 'John Doe',
          address: '123 Main St, City',
          phone: '+1234567890'
        },
        estimatedTime: 'Unassigned',
        priority: 'high',
        createdAt: '2023-12-01T10:00:00Z',
        zone: 'Zone A'
      },
      {
        id: '2',
        orderNumber: 'DEL-002',
        status: 'in_progress',
        customer: {
          name: 'Jane Smith',
          address: '456 Oak St, City',
          phone: '+1234567891'
        },
        officer: {
          name: 'Mike Smith',
          phone: '+1987654321'
        },
        estimatedTime: '30 mins',
        priority: 'medium',
        createdAt: '2023-12-01T10:30:00Z',
        zone: 'Zone B'
      },
      // Add more mock data as needed
    ];
    setDeliveries(mockDeliveries);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
    const matchesZone = filterZone === 'all' || delivery.zone === filterZone;
    const matchesPriority = filterPriority === 'all' || delivery.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesZone && matchesPriority;
  });

  const renderGridView = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredDeliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {delivery.orderNumber}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                  {delivery.status.replace('_', ' ')}
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(delivery.priority)}`}>
                  {delivery.priority}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {delivery.customer.name}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {delivery.customer.address}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {delivery.estimatedTime}
              </div>
            </div>

            {delivery.officer && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Delivery Officer</h4>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {delivery.officer.name}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {filteredDeliveries.map((delivery) => (
          <li key={delivery.id} className="hover:bg-gray-50">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {delivery.orderNumber}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(delivery.priority)}`}>
                      {delivery.priority}
                    </span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {delivery.customer.name}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {delivery.customer.address}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {delivery.estimatedTime}
                    </div>
                    {delivery.officer && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {delivery.officer.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Active Deliveries</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </select>
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </div>
  );
}
