import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../services/api';
import BaseSettings from './BaseSettings';
import { Truck, MapPin, Bell, Car, Clock } from 'lucide-react';

export default function DeliverySettings() {
  const { user } = useAuth();
  const [deliveryData, setDeliveryData] = useState({
    vehicleType: '',
    vehicleRegistration: '',
    availabilityStatus: 'AVAILABLE',
    preferredZones: [] as string[],
    notifyNewDeliveries: true
  });

  useEffect(() => {
    if (user) {
      loadDeliveryData();
    }
  }, [user]);

  const loadDeliveryData = async () => {
    try {
      const response = await users.getById(user!._id);
      const userData = response.data;
      setDeliveryData({
        vehicleType: userData.vehicleType || '',
        vehicleRegistration: userData.vehicleRegistration || '',
        availabilityStatus: userData.availabilityStatus || 'AVAILABLE',
        preferredZones: userData.preferredZones || [],
        notifyNewDeliveries: userData.notifyNewDeliveries !== false
      });
    } catch (error) {
      console.error('Error loading delivery data:', error);
      toast.error('Failed to load delivery settings');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await users.update(user!._id, deliveryData);
      toast.success('Delivery settings updated successfully');
    } catch (error) {
      console.error('Error updating delivery settings:', error);
      toast.error('Failed to update delivery settings');
    }
  };

  return (
    <div className="space-y-6">
      <BaseSettings />

      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Vehicle Information */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Vehicle Information</h3>
                <p className="text-sm text-gray-500">Your delivery vehicle details</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <select
                  value={deliveryData.vehicleType}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, vehicleType: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="CAR">Car</option>
                  <option value="VAN">Van</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  type="text"
                  value={deliveryData.vehicleRegistration}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, vehicleRegistration: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter vehicle registration"
                />
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Availability</h3>
                <p className="text-sm text-gray-500">Set your delivery availability</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={deliveryData.availabilityStatus}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, availabilityStatus: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Delivery Notifications</label>
                <input
                  type="checkbox"
                  checked={deliveryData.notifyNewDeliveries}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, notifyNewDeliveries: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Preferred Zones */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delivery Zones</h3>
                <p className="text-sm text-gray-500">Your preferred delivery areas</p>
              </div>
            </div>
            <div className="p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Zones</label>
                <select
                  multiple
                  value={deliveryData.preferredZones}
                  onChange={(e) => {
                    const zones = Array.from(e.target.selectedOptions, option => option.value);
                    setDeliveryData(prev => ({ ...prev, preferredZones: zones }));
                  }}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  size={4}
                >
                  <option value="ZONE_1">Zone 1</option>
                  <option value="ZONE_2">Zone 2</option>
                  <option value="ZONE_3">Zone 3</option>
                  <option value="ZONE_4">Zone 4</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple zones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}