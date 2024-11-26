import React from 'react';
import { MessageSquare, Mail, CreditCard, RefreshCcw } from 'lucide-react';

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">WhatsApp Integration</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">WhatsApp Business API</h4>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Configure
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Email Integration</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">SMTP Settings</h4>
                <p className="text-sm text-gray-500">Configured</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Edit Settings
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Gateway</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Payment Provider</h4>
                <p className="text-sm text-gray-500">Not configured</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Connect
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Sync Settings</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <RefreshCcw className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Data Synchronization</h4>
                <p className="text-sm text-gray-500">Last sync: 5 minutes ago</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Sync Now
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Sync Frequency</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Every 5 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every 30 minutes</option>
              <option>Every hour</option>
              <option>Manual only</option>
            </select>
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="autoSync"
                name="autoSync"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="autoSync" className="font-medium text-gray-700">
                Enable Automatic Sync
              </label>
              <p className="text-gray-500 text-sm">
                Automatically synchronize data based on the selected frequency
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}