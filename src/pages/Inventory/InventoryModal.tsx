import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Medication } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface InventoryModalProps {
  medication: Medication | null;
  onClose: () => void;
  onSave: (medicationData: Partial<Medication>) => void;
  onDelete: (id: string) => void;
}

export default function InventoryModal({ medication, onClose, onSave, onDelete }: InventoryModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'PRESCRIPTION',
    quantity: 0,
    minimumQuantity: 10,
    unit: 'TABLETS',
    price: 0,
    manufacturer: '',
    expiryDate: '',
    batchNumber: '',
    location: '',
    instructions: '',
    sideEffects: [''],
    contraindications: ['']
  });

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        description: medication.description || '',
        type: medication.type,
        quantity: medication.quantity,
        minimumQuantity: medication.minimumQuantity,
        unit: medication.unit,
        price: medication.price,
        manufacturer: medication.manufacturer || '',
        expiryDate: medication.expiryDate ? new Date(medication.expiryDate).toISOString().split('T')[0] : '',
        batchNumber: medication.batchNumber || '',
        location: medication.location || '',
        instructions: medication.instructions || '',
        sideEffects: medication.sideEffects?.length ? medication.sideEffects : [''],
        contraindications: medication.contraindications?.length ? medication.contraindications : ['']
      });
    }
  }, [medication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      sideEffects: formData.sideEffects.filter(effect => effect.trim()),
      contraindications: formData.contraindications.filter(contra => contra.trim())
    };

    onSave(cleanedData);
  };

  const handleArrayChange = (
    field: 'sideEffects' | 'contraindications',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'sideEffects' | 'contraindications') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field: 'sideEffects' | 'contraindications', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {medication ? 'Edit Medication' : 'Add New Medication'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PRESCRIPTION' | 'OVER_THE_COUNTER' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="PRESCRIPTION">Prescription</option>
                <option value="OVER_THE_COUNTER">Over The Counter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.minimumQuantity}
                onChange={(e) => setFormData({ ...formData, minimumQuantity: parseInt(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as Medication['unit'] })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="TABLETS">Tablets</option>
                <option value="CAPSULES">Capsules</option>
                <option value="ML">Milliliters</option>
                <option value="MG">Milligrams</option>
                <option value="PIECES">Pieces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Batch Number</label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Storage Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Instructions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Side Effects */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Side Effects</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('sideEffects')}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Add Side Effect
                </button>
              </div>
              {formData.sideEffects.map((effect, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={effect}
                    onChange={(e) => handleArrayChange('sideEffects', index, e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formData.sideEffects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sideEffects', index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Contraindications */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Contraindications</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('contraindications')}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Add Contraindication
                </button>
              </div>
              {formData.contraindications.map((contra, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={contra}
                    onChange={(e) => handleArrayChange('contraindications', index, e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formData.contraindications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('contraindications', index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {medication && (
              <button
                type="button"
                onClick={() => onDelete(medication._id)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md shadow-sm text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {medication ? 'Update' : 'Add'} Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}