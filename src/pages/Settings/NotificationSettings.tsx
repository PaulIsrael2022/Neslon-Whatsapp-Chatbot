import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function NotificationSettings() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    notificationPreferences: {
      orderNotifications: true,
      deliveryUpdates: true,
      notificationChannels: {
        push: true,
        email: true,
        sms: true
      }
    }
  });

  useEffect(() => {
    if (settings?.notificationPreferences) {
      setFormData({
        notificationPreferences: settings.notificationPreferences
      });
    }
  }, [settings]);

  const handleNotificationChange = (field: string) => {
    setFormData(prev => ({
      notificationPreferences: {
        ...prev.notificationPreferences,
        [field]: !prev.notificationPreferences[field]
      }
    }));
  };

  const handleChannelChange = (channel: string) => {
    setFormData(prev => ({
      notificationPreferences: {
        ...prev.notificationPreferences,
        notificationChannels: {
          ...prev.notificationPreferences.notificationChannels,
          [channel]: !prev.notificationPreferences.notificationChannels[channel]
        }
      }
    }));
  };

  const handleSubmit = async () => {
    await updateSettings('notifications', formData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Decide which notifications you'd like to receive and how.
        </p>

        <div className="mt-6 space-y-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="orderNotifications"
                name="orderNotifications"
                type="checkbox"
                checked={formData.notificationPreferences.orderNotifications}
                onChange={() => handleNotificationChange('orderNotifications')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="orderNotifications" className="font-medium text-gray-700">
                Order notifications
              </label>
              <p className="text-gray-500 text-sm">
                Get notified when a new order is placed or order status changes.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="deliveryNotifications"
                name="deliveryNotifications"
                type="checkbox"
                checked={formData.notificationPreferences.deliveryUpdates}
                onChange={() => handleNotificationChange('deliveryUpdates')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="deliveryNotifications" className="font-medium text-gray-700">
                Delivery updates
              </label>
              <p className="text-gray-500 text-sm">
                Receive updates about delivery status and tracking information.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Channels</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-400" />
              <span className="ml-3 text-sm font-medium text-gray-700">Push Notifications</span>
            </div>
            <button
              type="button"
              onClick={() => handleChannelChange('push')}
              className={`${
                formData.notificationPreferences.notificationChannels.push
                  ? 'bg-indigo-600'
                  : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <span className={`${
                formData.notificationPreferences.notificationChannels.push
                  ? 'translate-x-5'
                  : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="ml-3 text-sm font-medium text-gray-700">Email Notifications</span>
            </div>
            <button
              type="button"
              onClick={() => handleChannelChange('email')}
              className={`${
                formData.notificationPreferences.notificationChannels.email
                  ? 'bg-indigo-600'
                  : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <span className={`${
                formData.notificationPreferences.notificationChannels.email
                  ? 'translate-x-5'
                  : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <span className="ml-3 text-sm font-medium text-gray-700">SMS Notifications</span>
            </div>
            <button
              type="button"
              onClick={() => handleChannelChange('sms')}
              className={`${
                formData.notificationPreferences.notificationChannels.sms
                  ? 'bg-indigo-600'
                  : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <span className={`${
                formData.notificationPreferences.notificationChannels.sms
                  ? 'translate-x-5'
                  : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`} />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={handleSubmit}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}