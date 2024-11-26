import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { pharmacies } from '../../services/api';
import BaseSettings from './BaseSettings';
import { Building2, Clock, ImagePlus } from 'lucide-react';

export default function PharmacySettings() {
  const { user } = useAuth();
  const [pharmacyData, setPharmacyData] = useState({
    openingHours: '',
    isActive: true,
    isPartner: false,
    logo: null as File | null
  });

  useEffect(() => {
    if (user?.pharmacy) {
      loadPharmacyData();
    }
  }, [user]);

  const loadPharmacyData = async () => {
    try {
      const response = await pharmacies.getById(user!.pharmacy as string);
      const pharmacy = response.data;
      setPharmacyData({
        openingHours: pharmacy.openingHours || '',
        isActive: pharmacy.isActive,
        isPartner: pharmacy.isPartner,
        logo: null
      });
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
      toast.error('Failed to load pharmacy data');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPharmacyData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('openingHours', pharmacyData.openingHours);
      formData.append('isActive', String(pharmacyData.isActive));
      formData.append('isPartner', String(pharmacyData.isPartner));
      if (pharmacyData.logo) {
        formData.append('logo', pharmacyData.logo);
      }

      await pharmacies.update(user!.pharmacy as string, formData);
      toast.success('Pharmacy settings updated successfully');
    } catch (error) {
      console.error('Error updating pharmacy settings:', error);
      toast.error('Failed to update pharmacy settings');
    }
  };

  return (
    <div className="space-y-6">
      <BaseSettings />

      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Basic Information */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Pharmacy Status</h3>
                <p className="text-sm text-gray-500">Manage your pharmacy's status</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Active Status</label>
                <input
                  type="checkbox"
                  checked={pharmacyData.isActive}
                  onChange={(e) => setPharmacyData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Partner Status</label>
                <input
                  type="checkbox"
                  checked={pharmacyData.isPartner}
                  onChange={(e) => setPharmacyData(prev => ({ ...prev, isPartner: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Opening Hours</h3>
                <p className="text-sm text-gray-500">Set your business hours</p>
              </div>
            </div>
            <div className="p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <input
                  type="text"
                  value={pharmacyData.openingHours}
                  onChange={(e) => setPharmacyData(prev => ({ ...prev, openingHours: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 9AM-1PM"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ImagePlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Pharmacy Logo</h3>
                <p className="text-sm text-gray-500">Upload your pharmacy logo</p>
              </div>
            </div>
            <div className="p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                <input
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
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