import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { doctors } from '../../services/api';
import BaseSettings from './BaseSettings';

export default function DoctorSettings() {
  const { user } = useAuth();
  const [doctorData, setDoctorData] = useState({
    specialization: '',
    qualification: '',
    experience: 0,
    licenseNumber: '',
    consultationFee: 0,
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true },
      { day: 'Sunday', startTime: '09:00', endTime: '17:00', isAvailable: false }
    ],
    prescriptionSettings: {
      defaultValidity: 30,
      allowGenericSubstitution: true,
      requirePharmacyConfirmation: false
    }
  });

  useEffect(() => {
    if (user) {
      loadDoctorData();
    }
  }, [user]);

  const loadDoctorData = async () => {
    try {
      const response = await doctors.getById(user!._id);
      const doctor = response.data;
      setDoctorData(prev => ({
        ...prev,
        specialization: doctor.specialization || '',
        qualification: doctor.qualification || '',
        experience: doctor.experience || 0,
        licenseNumber: doctor.licenseNumber || '',
        consultationFee: doctor.consultationFee || 0,
        availability: doctor.availability || prev.availability,
        prescriptionSettings: doctor.prescriptionSettings || prev.prescriptionSettings
      }));
    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast.error('Failed to load doctor settings');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctors.update(user!._id, doctorData);
      toast.success('Doctor settings updated successfully');
    } catch (error) {
      console.error('Error updating doctor settings:', error);
      toast.error('Failed to update doctor settings');
    }
  };

  const handleAvailabilityChange = (index: number, field: string, value: string | boolean) => {
    setDoctorData(prev => ({
      ...prev,
      availability: prev.availability.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BaseSettings />
        
        <div className="mt-10 bg-white rounded-lg shadow">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Doctor Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your professional information and availability.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">
            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    value={doctorData.specialization}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <input
                    type="text"
                    value={doctorData.qualification}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, qualification: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    value={doctorData.licenseNumber}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    value={doctorData.experience}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={doctorData.consultationFee}
                      onChange={(e) => setDoctorData(prev => ({ ...prev, consultationFee: parseFloat(e.target.value) }))}
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Availability Schedule</h3>
              <div className="space-y-4">
                {doctorData.availability.map((schedule, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-900">{schedule.day}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                        disabled={!schedule.isAvailable}
                      />
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                        disabled={!schedule.isAvailable}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.isAvailable}
                        onChange={(e) => handleAvailabilityChange(index, 'isAvailable', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                      />
                      <span className="ml-2 text-sm text-gray-500">Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Prescription Settings</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Prescription Validity (days)</label>
                  <input
                    type="number"
                    value={doctorData.prescriptionSettings.defaultValidity}
                    onChange={(e) => setDoctorData(prev => ({
                      ...prev,
                      prescriptionSettings: {
                        ...prev.prescriptionSettings,
                        defaultValidity: parseInt(e.target.value)
                      }
                    }))}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={doctorData.prescriptionSettings.allowGenericSubstitution}
                      onChange={(e) => setDoctorData(prev => ({
                        ...prev,
                        prescriptionSettings: {
                          ...prev.prescriptionSettings,
                          allowGenericSubstitution: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Allow Generic Substitution
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={doctorData.prescriptionSettings.requirePharmacyConfirmation}
                      onChange={(e) => setDoctorData(prev => ({
                        ...prev,
                        prescriptionSettings: {
                          ...prev.prescriptionSettings,
                          requirePharmacyConfirmation: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Require Pharmacy Confirmation
                    </label>
                  </div>
                </div>
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