import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DoctorOrderList from './DoctorOrderList';
import DoctorOrderFilters from './DoctorOrderFilters';
import OrderDeliveryModal from '../../../components/OrderDelivery/OrderDeliveryModal';
import { orders } from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function DoctorOrdersPage() {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    date: ''
  });

  const handleCreateOrder = async (orderData: any) => {
    try {
      const response = await orders.create({
        ...orderData,
        orderCategory: orderData.deliveryMethod === 'DELIVERY' ? 'WHATSAPP_REQUEST' : 'PHARMACY_PICKUP'
      });
      
      toast.success('Order created successfully');
      setShowModal(false);
      // Refresh orders list
      // You can implement this using a loadOrders function
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage prescriptions and medication orders
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </button>
      </div>

      <DoctorOrderFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white shadow rounded-lg">
        <DoctorOrderList filters={filters} />
      </div>

      {showModal && (
        <OrderDeliveryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateOrder}
        />
      )}
    </div>
  );
}