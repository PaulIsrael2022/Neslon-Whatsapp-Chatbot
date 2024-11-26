import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

export default function GeneralSettings() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    pharmacyName: '',
    email: '',
    address: '',
    openingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    }
  });

  useEffect(() => {
    console.log('🔄 GeneralSettings: settings changed:', settings);
    if (settings?.businessInfo) {
      console.log('📝 Updating form data with settings');
      setFormData({
        pharmacyName: settings.businessInfo.name || '',
        email: settings.businessInfo.email || '',
        address: settings.businessInfo.address || '',
        openingHours: settings.openingHours || formData.openingHours
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`🔄 Input changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    console.log(`🔄 Hours changed: ${day}.${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    console.log('📤 Submitting general settings...');
    const updateData = {
      businessInfo: {
        name: formData.pharmacyName,
        email: formData.email,
        address: formData.address
      },
      openingHours: formData.openingHours
    };
    console.log('📦 Update data:', updateData);

    await updateSettings('general', updateData);
  };

  if (loading) {
    console.log('⌛ GeneralSettings: Loading...');
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Pharmacy Information</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700">
              Pharmacy Name
            </label>
            <input
              type="text"
              name="pharmacyName"
              id="pharmacyName"
              value={formData.pharmacyName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Business Hours</h3>
        <div className="mt-6 space-y-4">
          {Object.entries(formData.openingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24">
                <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
              </div>
              <select
                value={hours.open}
                onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                disabled={hours.closed}
                className="block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </option>
                ))}
              </select>
              <span className="text-gray-500">to</span>
              <select
                value={hours.close}
                onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                disabled={hours.closed}
                className="block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </option>
                ))}
              </select>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={hours.closed}
                  onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Closed</span>
              </label>
            </div>
          ))}
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


