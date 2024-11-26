import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../services/api';
import BaseSettings from './BaseSettings';
import { Building2, Pill, CreditCard, MapPin, X } from 'lucide-react';

export default function CustomerSettings() {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState({
    addresses: {
      home: [{ address: '', isSaved: false }],
      work: [{ address: '', isSaved: false }]
    },
    medicalAidProvider: '',
    medicalAidNumber: '',
    scheme: '',
    medicalAidCardFront: null as File | null,
    medicalAidCardBack: null as File | null,
    prescriptionPreferences: {
      preferredPharmacy: '',
      allowGenericSubstitution: true,
      deliveryPreference: 'DELIVERY'
    }
  });

  useEffect(() => {
    if (user) {
      loadCustomerData();
    }
  }, [user]);

  const loadCustomerData = async () => {
    try {
      const response = await users.getById(user!._id);
      const userData = response.data;
      setCustomerData({
        addresses: userData.addresses || {
          home: [{ address: '', isSaved: false }],
          work: [{ address: '', isSaved: false }]
        },
        medicalAidProvider: userData.medicalAidProvider || '',
        medicalAidNumber: userData.medicalAidNumber || '',
        scheme: userData.scheme || '',
        medicalAidCardFront: null,
        medicalAidCardBack: null,
        prescriptionPreferences: userData.prescriptionPreferences || {
          preferredPharmacy: '',
          allowGenericSubstitution: true,
          deliveryPreference: 'DELIVERY'
        }
      });
    } catch (error) {
      console.error('Error loading customer data:', error);
      toast.error('Failed to load customer settings');
    }
  };

  const handleFileChange = (field: 'medicalAidCardFront' | 'medicalAidCardBack', file: File | null) => {
    setCustomerData(prev => ({ ...prev, [field]: file }));
  };

  const handleAddressChange = (type: 'home' | 'work', index: number, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [type]: prev.addresses[type].map((addr, i) => 
          i === index ? { ...addr, address: value } : addr
        )
      }
    }));
  };

  const addAddress = (type: 'home' | 'work') => {
    setCustomerData(prev => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [type]: [...prev.addresses[type], { address: '', isSaved: false }]
      }
    }));
  };

  const removeAddress = (type: 'home' | 'work', index: number) => {
    setCustomerData(prev => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [type]: prev.addresses[type].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all non-file data
      formData.append('addresses', JSON.stringify(customerData.addresses));
      formData.append('medicalAidProvider', customerData.medicalAidProvider);
      formData.append('medicalAidNumber', customerData.medicalAidNumber);
      formData.append('scheme', customerData.scheme);
      formData.append('prescriptionPreferences', JSON.stringify(customerData.prescriptionPreferences));

      // Append files if they exist
      if (customerData.medicalAidCardFront) {
        formData.append('medicalAidCardFront', customerData.medicalAidCardFront);
      }
      if (customerData.medicalAidCardBack) {
        formData.append('medicalAidCardBack', customerData.medicalAidCardBack);
      }

      await users.update(user!._id, formData);
      toast.success('Customer settings updated successfully');
    } catch (error) {
      console.error('Error updating customer settings:', error);
      toast.error('Failed to update customer settings');
    }
  };

  return (
    <div className="space-y-6">
      <BaseSettings />

      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Medical Aid Information */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Medical Aid</h3>
                <p className="text-sm text-gray-500">Your medical aid details</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider</label>
                <input
                  type="text"
                  value={customerData.medicalAidProvider}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, medicalAidProvider: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number</label>
                <input
                  type="text"
                  value={customerData.medicalAidNumber}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, medicalAidNumber: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scheme</label>
                <input
                  type="text"
                  value={customerData.scheme}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, scheme: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Prescription Preferences */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Pill className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Prescription Preferences</h3>
                <p className="text-sm text-gray-500">Your prescription settings</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Pharmacy</label>
                <input
                  type="text"
                  value={customerData.prescriptionPreferences.preferredPharmacy}
                  onChange={(e) => setCustomerData(prev => ({
                    ...prev,
                    prescriptionPreferences: {
                      ...prev.prescriptionPreferences,
                      preferredPharmacy: e.target.value
                    }
                  }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Allow Generic Substitution</label>
                <input
                  type="checkbox"
                  checked={customerData.prescriptionPreferences.allowGenericSubstitution}
                  onChange={(e) => setCustomerData(prev => ({
                    ...prev,
                    prescriptionPreferences: {
                      ...prev.prescriptionPreferences,
                      allowGenericSubstitution: e.target.checked
                    }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Medical Aid Cards */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Medical Aid Cards</h3>
                <p className="text-sm text-gray-500">Upload your medical aid cards</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Front of Card</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange('medicalAidCardFront', e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Back of Card</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange('medicalAidCardBack', e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Delivery Addresses</h3>
              <p className="text-sm text-gray-500">Manage your delivery locations</p>
            </div>
          </div>
          <div className="p-4 space-y-6">
            {/* Home Addresses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Home Addresses</h4>
                <button
                  type="button"
                  onClick={() => addAddress('home')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Address
                </button>
              </div>
              {customerData.addresses.home.map((addr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={addr.address}
                    onChange={(e) => handleAddressChange('home', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter home address"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddress('home', index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Work Addresses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Work Addresses</h4>
                <button
                  type="button"
                  onClick={() => addAddress('work')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Address
                </button>
              </div>
              {customerData.addresses.work.map((addr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={addr.address}
                    onChange={(e) => handleAddressChange('work', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter work address"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddress('work', index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}