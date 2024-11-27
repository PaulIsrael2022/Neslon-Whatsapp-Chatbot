import React, { useState, useEffect } from 'react';
import { MapPin, Users, Clock, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeliveryZone {
  id: string;
  name: string;
  coverage: string[];
  activeOfficers: number;
  deliveryTime: string;
  pricing: {
    base: number;
    perKm: number;
  };
  status: 'active' | 'inactive';
}

export default function ZonesManagement() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // TODO: Load zones from API
    const mockZones: DeliveryZone[] = [
      {
        id: '1',
        name: 'Zone A',
        coverage: ['Downtown', 'Business District'],
        activeOfficers: 3,
        deliveryTime: '30-45 min',
        pricing: {
          base: 10,
          perKm: 2
        },
        status: 'active'
      },
      // Add more mock data as needed
    ];
    setZones(mockZones);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Delivery Zones</h1>
        <button
          onClick={() => toast.success('Coming soon!')}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add New Zone
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900">{zone.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                zone.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {zone.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                {zone.activeOfficers} active officers
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {zone.deliveryTime} average delivery time
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-2" />
                ${zone.pricing.base} base + ${zone.pricing.perKm}/km
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <strong>Coverage:</strong>
                <div className="mt-1 flex flex-wrap gap-2">
                  {zone.coverage.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-5 right-5 flex space-x-2">
              <button 
                onClick={() => toast.success('Edit coming soon!')}
                className="text-gray-400 hover:text-gray-500"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => toast.success('Delete coming soon!')}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
