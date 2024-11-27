import React from 'react';
import { Package, User, Calendar, Clock, Eye } from 'lucide-react';

interface DoctorOrderListProps {
  filters: {
    search: string;
    status: string;
    type: string;
    date: string;
  };
}

export default function DoctorOrderList({ filters }: DoctorOrderListProps) {
  // Mock orders - replace with actual data
  const orders = [
    {
      id: 1,
      patient: 'John Doe',
      date: '2024-03-15',
      type: 'PRESCRIPTION_REFILL',
      medications: [
        { name: 'Amoxicillin', quantity: 30, instructions: 'Take 3 times daily' }
      ],
      status: 'PENDING'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      date: '2024-03-14',
      type: 'NEW_PRESCRIPTION',
      medications: [
        { name: 'Ibuprofen', quantity: 20, instructions: 'Take as needed' }
      ],
      status: 'COMPLETED'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.patient}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  {order.date}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  {order.type.replace('_', ' ')}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {order.medications.map((med, index) => (
                    <div key={index} className="mb-1">
                      <div className="font-medium">{med.name}</div>
                      <div className="text-gray-500 text-xs">{med.instructions}</div>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(order.status)
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <Eye className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}