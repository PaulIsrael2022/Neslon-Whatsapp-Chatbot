import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DeliveryList from './DeliveryList';
import DeliveryZones from './DeliveryZones';
import DeliveryFilters from './DeliveryFilters';
import ZoneModal from './ZoneModal';
import type { DeliveryZone } from '../../types';
import { toast } from 'react-hot-toast';

export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'zones'>('active');
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: ''
  });

  const handleAddEditZone = (zone: DeliveryZone | null) => {
    setSelectedZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleZoneModalClose = () => {
    setIsZoneModalOpen(false);
    setSelectedZone(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Delivery Management
          </h1>
        </div>
        {activeTab === 'zones' && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => handleAddEditZone(null)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Delivery Zone
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`${
              activeTab === 'active'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Active Deliveries
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`${
              activeTab === 'zones'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Delivery Zones
          </button>
        </nav>
      </div>

      {activeTab === 'active' ? (
        <>
          <DeliveryFilters filters={filters} onFilterChange={setFilters} />
          <div className="mt-8">
            <DeliveryList filters={filters} />
          </div>
        </>
      ) : (
        <DeliveryZones onEditZone={handleAddEditZone} />
      )}

      {isZoneModalOpen && (
        <ZoneModal
          zone={selectedZone}
          onClose={handleZoneModalClose}
        />
      )}
    </div>
  );
}