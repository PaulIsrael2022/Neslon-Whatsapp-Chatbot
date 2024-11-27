import React, { useState, useEffect } from 'react';
import { Users, MapPin, Phone, Mail, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeliveryOfficer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  currentZone?: string;
  activeDeliveries: number;
  rating: number;
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

  useEffect(() => {
    // TODO: Load delivery officers from API
    const mockOfficers: DeliveryOfficer[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'Active',
        currentZone: 'Zone A',
        activeDeliveries: 3,
        rating: 4.8
      },
      // Add more mock data as needed
    ];
    setOfficers(mockOfficers);
  }, []);

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
          <button 
            onClick={() => toast.success('Coming soon!')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
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
                    statusStyles[officer.status as keyof typeof statusStyles]
                  }`}>
                    {officer.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {officer.currentZone || 'No zone assigned'}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {officer.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {officer.email}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {officer.activeDeliveries} active deliveries
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
