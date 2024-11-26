import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { clinics } from '../../services/api';
import BaseSettings from './BaseSettings';

export default function ClinicSettings() {
  const { user } = useAuth();
  const [clinicData, setClinicData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
    openingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    },
    specialties: [''],
    facilities: [''],
    logo: null as File | null
  });

  useEffect(() => {
    if (user?.clinic) {
      loadClinicData();
    }
  }, [user]);

  const loadClinicData = async () => {
    try {
      const response = await clinics.getById(user!.clinic as string);
      const clinic = response.data;
      setClinicData({
        name: clinic.name || '',
        address: clinic.address || '',
        phoneNumber: clinic.phoneNumber || '',
        email: clinic.email || '',
        website: clinic.website || '',
        openingHours: clinic.openingHours || clinicData.openingHours,
        specialties: clinic.specialties?.length ? clinic.specialties : [''],
        facilities: clinic.facilities?.length ? clinic.facilities : [''],
        logo: null
      });
    } catch (error) {
      console.error('Error loading clinic data:', error);
      toast.error('Failed to load clinic data');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setClinicData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleArrayChange = (field: 'specialties' | 'facilities', index: number, value: string) => {
    setClinicData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'specialties' | 'facilities') => {
    setClinicData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'specialties' | 'facilities', index: number) => {
    setClinicData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(clinicData).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          formData.append('logo', value);
        } else if (key === 'openingHours') {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value.filter(item => item.trim())));
        } else {
          formData.append(key, value);
        }
      });

      await clinics.update(user!.clinic as string, formData);
      toast.success('Clinic settings updated successfully');
    } catch (error) {
      console.error('Error updating clinic settings:', error);
      toast.error('Failed to update clinic settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BaseSettings />
        
        <div className="mt-10 bg-white rounded-lg shadow">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Clinic Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your clinic's information and operating hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                  <input
                    type="text"
                    value={clinicData.name}
                    onChange={(e) => setClinicData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => setClinicData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={clinicData.phoneNumber}
                    onChange={(e) => setClinicData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={clinicData.website}
                    onChange={(e) => setClinicData(prev => ({ ...prev, website: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={clinicData.address}
                    onChange={(e) => setClinicData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Clinic Logo</h3>
              <div className="flex items-center space-x-6">
                {clinicData.logo && (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(clinicData.logo)}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload new logo</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Specialties</h3>
              {clinicData.specialties.map((specialty, index) => (
                <div key={index} className="flex space-x-4">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => handleArrayChange('specialties', index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    placeholder="Enter specialty"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('specialties', index)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('specialties')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Add Specialty
              </button>
            </div>

            {/* Facilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Facilities</h3>
              {clinicData.facilities.map((facility, index) => (
                <div key={index} className="flex space-x-4">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => handleArrayChange('facilities', index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    placeholder="Enter facility"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('facilities', index)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('facilities')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Add Facility
              </button>
            </div>

            {/* Opening Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(clinicData.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-900 capitalize">{day}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => setClinicData(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        }))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={hours.closed}
                      />
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => setClinicData(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        }))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={hours.closed}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) => setClinicData(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day]: { ...hours, closed: e.target.checked }
                          }
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                      />
                      <span className="ml-2 text-sm text-gray-500">Closed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}