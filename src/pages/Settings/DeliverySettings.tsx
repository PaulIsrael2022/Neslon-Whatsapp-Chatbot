import React from 'react';

export default function DeliverySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Delivery Time Slots</h3>
        <div className="mt-6 space-y-4">
          {[
            '9:30 AM - 11:00 AM',
            '11:00 AM - 12:30 PM',
            '1:30 PM - 3:00 PM',
            '3:00 PM - 4:30 PM',
            '4:30 PM - 6:00 PM'
          ].map((slot) => (
            <div key={slot} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{slot}</span>
              </div>
              <input
                type="number"
                className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Limit"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Delivery Radius</h3>
        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="5"
            />
            <span className="text-sm text-gray-500">kilometers</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Maximum distance for delivery from pharmacy location
          </p>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Minimum Order Value</h3>
        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">R</span>
            <input
              type="number"
              className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="100"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Minimum order value required for delivery
          </p>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Emergency Delivery</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Enable Emergency Delivery</label>
              <p className="text-gray-500 text-sm">
                Allow customers to request emergency delivery outside normal hours
              </p>
            </div>
          </div>
          <div className="ml-7">
            <label className="block text-sm font-medium text-gray-700">
              Emergency Delivery Surcharge
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="text-sm text-gray-500">R</span>
              <input
                type="number"
                className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="150"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}