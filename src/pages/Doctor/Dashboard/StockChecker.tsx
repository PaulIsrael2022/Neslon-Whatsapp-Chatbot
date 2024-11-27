import React, { useState } from 'react';
import { Search, Package } from 'lucide-react';

export default function StockChecker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState([
    { id: 1, name: 'Amoxicillin', quantity: 150, status: 'IN_STOCK' },
    { id: 2, name: 'Ibuprofen', quantity: 25, status: 'LOW_STOCK' },
    { id: 3, name: 'Paracetamol', quantity: 0, status: 'OUT_OF_STOCK' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Medication Stock Checker</h2>
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {medications.map((medication) => (
            <li key={medication.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {medication.quantity}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(medication.status)
                }`}>
                  {medication.status.replace('_', ' ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}