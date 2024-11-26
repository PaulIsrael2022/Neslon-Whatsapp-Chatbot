import React, { useState } from 'react';
import { X, Plus, Trash, MapPin, Truck } from 'lucide-react';

interface CreateQuotationModalProps {
  onClose: () => void;
}

export default function CreateQuotationModal({ onClose }: CreateQuotationModalProps) {
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [deliveryZone, setDeliveryZone] = useState('');

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Quotation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Email</label>
              <input
                type="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Pickup</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Delivery</span>
              </label>
            </div>
          </div>

          {/* Delivery Zone (only if delivery is selected) */}
          {deliveryMethod === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Zone</label>
              <select
                value={deliveryZone}
                onChange={(e) => setDeliveryZone(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a zone</option>
                <option value="zone1">Zone A - City Center</option>
                <option value="zone2">Zone B - Suburbs</option>
                <option value="zone3">Zone C - Extended Area</option>
              </select>
            </div>
          )}

          {/* Quotation Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Quotation Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Validity Period (days)</label>
            <input
              type="number"
              min="1"
              defaultValue={30}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Additional notes or terms..."
            />
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}