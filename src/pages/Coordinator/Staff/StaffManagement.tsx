import React, { useState, useEffect } from 'react';
import { 
  Users, Star, MapPin, Calendar,
  TrendingUp, Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';

interface DeliveryOfficer {
  id: string;
  name: string;
  status: 'Active' | 'On Break' | 'Off Duty' | 'On Leave';
  performance: {
    rating: number;
    deliveryCount: number;
    onTimeRate: number;
    customerRating: number;
  };
  currentZone?: string;
  nextShift?: string;
}

export default function StaffManagement() {
  const [officers, setOfficers] = useState<DeliveryOfficer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<DeliveryOfficer | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Status badge styles
  const statusStyles = {
    'Active': 'bg-green-100 text-green-800',
    'On Break': 'bg-yellow-100 text-yellow-800',
    'Off Duty': 'bg-gray-100 text-gray-800',
    'On Leave': 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Break">On Break</option>
            <option value="Off Duty">Off Duty</option>
            <option value="On Leave">On Leave</option>
          </select>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {officers.map((officer) => (
          <div
            key={officer.id}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            onClick={() => setSelectedOfficer(officer)}
          >
            <div className="flex-shrink-0">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{officer.name}</p>
                <div className="flex items-center mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusStyles[officer.status]
                  }`}>
                    {officer.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Star className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-400" />
                  <p>{officer.performance.rating.toFixed(1)}</p>
                </div>
                {officer.currentZone && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>{officer.currentZone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Details Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                 onClick={() => setSelectedOfficer(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Staff Details
                </h3>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Performance Metrics</h4>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOfficer.performance.deliveryCount}
                        </p>
                        <p className="text-xs text-gray-500">Deliveries</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOfficer.performance.onTimeRate}%
                        </p>
                        <p className="text-xs text-gray-500">On-Time Rate</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOfficer.performance.customerRating.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">Customer Rating</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">2</p>
                        <p className="text-xs text-gray-500">Issues</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500">Schedule</h4>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">
                        Next Shift: {selectedOfficer.nextShift || 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {/* Handle schedule management */}}
                >
                  Manage Schedule
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setSelectedOfficer(null)}
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
