import React from 'react';
import { Edit2, AlertTriangle, Package, Calendar, DollarSign } from 'lucide-react';
import type { Medication } from '../../types';

interface InventoryListProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  loading: boolean;
  filters: {
    search: string;
    type: string;
    status: string;
  };
}

export default function InventoryList({ medications, onEdit, loading, filters }: InventoryListProps) {
  const statusColors = {
    IN_STOCK: 'bg-green-100 text-green-800',
    LOW_STOCK: 'bg-yellow-100 text-yellow-800',
    OUT_OF_STOCK: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No medications found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medication
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Info
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
          {medications.map((medication) => (
            <tr key={medication._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                    <div className="text-sm text-gray-500">{medication.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">
                  {medication.type.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-400 mr-1" />
                    {medication.quantity} {medication.unit}
                  </div>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    R{medication.price.toFixed(2)}
                  </div>
                  {medication.expiryDate && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      Expires: {new Date(medication.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[medication.status]
                }`}>
                  {medication.status.replace(/_/g, ' ')}
                </span>
                {medication.quantity <= medication.minimumQuantity && (
                  <div className="flex items-center mt-1 text-xs text-yellow-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Restock needed
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(medication)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}