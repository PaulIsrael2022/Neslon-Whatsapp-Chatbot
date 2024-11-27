import React, { useState, useEffect } from 'react';
import { 
  MapPin, Users, Clock, TrendingUp,
  DollarSign, Package, Settings 
} from 'lucide-react';

interface DeliveryZone {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Busy';
  metrics: {
    activeDeliveries: number;
    assignedStaff: number;
    averageDeliveryTime: string;
    deliverySuccess: number;
  };
  coverage: {
    areas: string[];
    radius: number;
  };
  pricing: {
    basePrice: number;
    pricePerKm: number;
    rushHourMultiplier: number;
  };
}

export default function ZoneManagement() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Status badge styles
  const statusStyles = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Busy': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Zone Management</h1>
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Busy">Busy</option>
          </select>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Add Zone
          </button>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            onClick={() => setSelectedZone(zone)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-10 w-10 text-gray-400" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusStyles[zone.status]
                  }`}>
                    {zone.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Package className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>{zone.metrics.activeDeliveries} Active</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>{zone.metrics.assignedStaff} Staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Modal */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                 onClick={() => setSelectedZone(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Zone Details: {selectedZone.name}
                </h3>
                
                {/* Performance Metrics */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Performance Metrics</h4>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedZone.metrics.averageDeliveryTime}
                        </p>
                        <p className="text-xs text-gray-500">Avg. Delivery Time</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedZone.metrics.deliverySuccess}%
                        </p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage Information */}
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500">Coverage Area</h4>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {selectedZone.coverage.areas.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Radius: {selectedZone.coverage.radius}km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-900">
                          Base: ${selectedZone.pricing.basePrice}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${selectedZone.pricing.pricePerKm}/km
                        </p>
                        <p className="text-xs text-gray-500">
                          Rush Hour: {selectedZone.pricing.rushHourMultiplier}x
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {/* Handle zone settings */}}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Edit Settings
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setSelectedZone(null)}
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
