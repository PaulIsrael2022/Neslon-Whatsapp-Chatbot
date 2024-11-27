import React, { useState, useEffect } from 'react';
import { Package, User, MapPin, Clock, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
  }[];
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
  zone: string;
  priority: 'normal' | 'urgent';
}

interface DeliveryOfficer {
  id: string;
  name: string;
  status: 'available' | 'busy';
  activeDeliveries: number;
  zone: string;
}

export default function OrdersAssignment() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryOfficers, setDeliveryOfficers] = useState<DeliveryOfficer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    // TODO: Fetch pending orders from API
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        createdAt: '2023-12-01T10:00:00',
        customer: {
          name: 'John Doe',
          address: '123 Main St, City',
          phone: '+1234567890'
        },
        items: [
          { name: 'Medication A', quantity: 2 },
          { name: 'Medication B', quantity: 1 }
        ],
        status: 'pending',
        zone: 'Zone A',
        priority: 'urgent'
      },
      // Add more mock orders
    ];
    setOrders(mockOrders);

    // TODO: Fetch available delivery officers from API
    const mockOfficers: DeliveryOfficer[] = [
      {
        id: '1',
        name: 'James Wilson',
        status: 'available',
        activeDeliveries: 0,
        zone: 'Zone A'
      },
      // Add more mock officers
    ];
    setDeliveryOfficers(mockOfficers);
  }, []);

  const handleAssignDelivery = async (orderId: string, officerId: string) => {
    try {
      // TODO: Implement API call to assign delivery
      toast.success('Delivery assigned successfully');
      // Update orders list
      setOrders(orders.filter(order => order.id !== orderId));
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to assign delivery');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === 'all' || order.zone === filterZone;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    return matchesSearch && matchesZone && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders Assignment</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
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
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li
                key={order.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedOrder?.id === order.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.priority}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {order.customer.name}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {order.customer.address}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                    <ul className="mt-1 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Assignment Panel */}
        <div className="bg-white shadow sm:rounded-md">
          {selectedOrder ? (
            <div className="px-4 py-4">
              <h2 className="text-lg font-medium text-gray-900">Assign Delivery Officer</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a delivery officer to handle this order
              </p>

              <div className="mt-4 space-y-4">
                {deliveryOfficers
                  .filter(officer => officer.status === 'available')
                  .map(officer => (
                    <div
                      key={officer.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-indigo-500"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{officer.name}</h3>
                        <p className="text-sm text-gray-500">Zone: {officer.zone}</p>
                        <p className="text-sm text-gray-500">
                          Active Deliveries: {officer.activeDeliveries}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAssignDelivery(selectedOrder.id, officer.id)}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 text-center text-gray-500">
              Select an order to assign a delivery officer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
