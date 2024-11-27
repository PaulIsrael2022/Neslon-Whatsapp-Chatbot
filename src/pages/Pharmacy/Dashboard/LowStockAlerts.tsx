import React from 'react';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';

export default function LowStockAlerts() {
  // Mock data - replace with actual API call
  const lowStockItems = [
    {
      id: '1',
      name: 'Amoxicillin 500mg',
      currentStock: 25,
      minimumStock: 50,
      reorderPoint: 30
    },
    {
      id: '2',
      name: 'Paracetamol 500mg',
      currentStock: 15,
      minimumStock: 100,
      reorderPoint: 50
    }
  ];

  return (
    <div className="mt-4">
      <div className="flow-root">
        <ul className="-mb-8">
          {lowStockItems.map((item, itemIdx) => (
            <li key={item.id}>
              <div className="relative pb-8">
                {itemIdx !== lowStockItems.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center ring-8 ring-white">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Current Stock: {item.currentStock} units
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <p>Minimum: {item.minimumStock}</p>
                        <p>Reorder at: {item.reorderPoint}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Reorder Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a
          href="#"
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View All Stock Alerts
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}