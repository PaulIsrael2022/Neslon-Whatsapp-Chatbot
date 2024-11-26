import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Users } from 'lucide-react';
import type { DeliveryZone, User } from '../../types';
import { deliveryZones, users } from '../../services/api';
import { toast } from 'react-hot-toast';

interface ZoneModalProps {
  zone: DeliveryZone | null;
  onClose: () => void;
}

export default function ZoneModal({ zone, onClose }: ZoneModalProps) {
  const [loading, setLoading] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    areas: [''],
    basePrice: 0,
    pricePerKm: 0,
    minimumOrder: 0,
    maxDistance: 0,
    isActive: true,
    assignedDrivers: [{ driver: '', priority: 0 }],
    deliverySchedule: {
      monday: { available: true, slots: [{ time: '09:00', maxDeliveries: 5 }] },
      tuesday: { available: true, slots: [{ time: '09:00', maxDeliveries: 5 }] },
      wednesday: { available: true, slots: [{ time: '09:00', maxDeliveries: 5 }] },
      thursday: { available: true, slots: [{ time: '09:00', maxDeliveries: 5 }] },
      friday: { available: true, slots: [{ time: '09:00', maxDeliveries: 5 }] },
      saturday: { available: true, slots: [{ time: '09:00', maxDeliveries: 5 }] },
      sunday: { available: false, slots: [] }
    }
  });

  useEffect(() => {
    loadDrivers();
    if (zone) {
      setFormData({
        name: zone.name,
        description: zone.description || '',
        areas: zone.areas,
        basePrice: zone.basePrice,
        pricePerKm: zone.pricePerKm,
        minimumOrder: zone.minimumOrder,
        maxDistance: zone.maxDistance,
        isActive: zone.isActive,
        assignedDrivers: zone.assignedDrivers,
        deliverySchedule: zone.deliverySchedule
      });
    }
  }, [zone]);

  const loadDrivers = async () => {
    try {
      const response = await users.list({ role: 'deliveryOfficer', status: 'active' });
      setAvailableDrivers(response.data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      toast.error('Failed to load delivery officers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (zone) {
        await deliveryZones.update(zone._id, formData);
        toast.success('Delivery zone updated successfully');
      } else {
        await deliveryZones.create(formData);
        toast.success('Delivery zone created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error saving delivery zone:', error);
      toast.error('Failed to save delivery zone');
    } finally {
      setLoading(false);
    }
  };

  const addArea = () => {
    setFormData(prev => ({
      ...prev,
      areas: [...prev.areas, '']
    }));
  };

  const removeArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index)
    }));
  };

  const addDriver = () => {
    setFormData(prev => ({
      ...prev,
      assignedDrivers: [...prev.assignedDrivers, { driver: '', priority: 0 }]
    }));
  };

  const removeDriver = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assignedDrivers: prev.assignedDrivers.filter((_, i) => i !== index)
    }));
  };

  const addTimeSlot = (day: string) => {
    setFormData(prev => ({
      ...prev,
      deliverySchedule: {
        ...prev.deliverySchedule,
        [day]: {
          ...prev.deliverySchedule[day],
          slots: [
            ...prev.deliverySchedule[day].slots,
            { time: '09:00', maxDeliveries: 5 }
          ]
        }
      }
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverySchedule: {
        ...prev.deliverySchedule,
        [day]: {
          ...prev.deliverySchedule[day],
          slots: prev.deliverySchedule[day].slots.filter((_, i) => i !== index)
        }
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {zone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Zone Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Areas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Areas Covered</label>
              <button
                type="button"
                onClick={addArea}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add Area
              </button>
            </div>
            {formData.areas.map((area, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => {
                    const newAreas = [...formData.areas];
                    newAreas[index] = e.target.value;
                    setFormData({ ...formData, areas: newAreas });
                  }}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter area name"
                  required
                />
                {formData.areas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArea(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price (R)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price per KM (R)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerKm}
                onChange={(e) => setFormData({ ...formData, pricePerKm: parseFloat(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Order Value (R)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: parseFloat(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Distance (KM)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.maxDistance}
                onChange={(e) => setFormData({ ...formData, maxDistance: parseFloat(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Assigned Drivers */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Assigned Drivers</label>
              <button
                type="button"
                onClick={addDriver}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add Driver
              </button>
            </div>
            {formData.assignedDrivers.map((assignment, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <select
                  value={typeof assignment.driver === 'string' ? assignment.driver : assignment.driver._id}
                  onChange={(e) => {
                    const newDrivers = [...formData.assignedDrivers];
                    newDrivers[index] = { ...newDrivers[index], driver: e.target.value };
                    setFormData({ ...formData, assignedDrivers: newDrivers });
                  }}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Driver</option>
                  {availableDrivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.firstName} {driver.surname}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  value={assignment.priority}
                  onChange={(e) => {
                    const newDrivers = [...formData.assignedDrivers];
                    newDrivers[index] = { ...newDrivers[index], priority: parseInt(e.target.value) };
                    setFormData({ ...formData, assignedDrivers: newDrivers });
                  }}
                  className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Priority"
                />
                {formData.assignedDrivers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDriver(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Delivery Schedule */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Schedule</h3>
            {Object.entries(formData.deliverySchedule).map(([day, schedule]) => (
              <div key={day} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.available}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          deliverySchedule: {
                            ...prev.deliverySchedule,
                            [day]: {
                              ...schedule,
                              available: e.target.checked
                            }
                          }
                        }));
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 capitalize">{day}</span>
                  </div>
                  {schedule.available && (
                    <button
                      type="button"
                      onClick={() => addTimeSlot(day)}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Add Time Slot
                    </button>
                  )}
                </div>
                {schedule.available && schedule.slots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2 ml-6">
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => {
                        const newSchedule = { ...formData.deliverySchedule };
                        newSchedule[day].slots[index].time = e.target.value;
                        setFormData({ ...formData, deliverySchedule: newSchedule });
                      }}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      min="1"
                      value={slot.maxDeliveries}
                      onChange={(e) => {
                        const newSchedule = { ...formData.deliverySchedule };
                        newSchedule[day].slots[index].maxDeliveries = parseInt(e.target.value);
                        setFormData({ ...formData, deliverySchedule: newSchedule });
                      }}
                      className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Max deliveries"
                    />
                    {schedule.slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(day, index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Zone is active
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : zone ? 'Update Zone' : 'Create Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}