import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../services/api';
import { User, Settings, Bell, Globe, Lock } from 'lucide-react';

export default function BaseSettings() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notificationPreference: 'WhatsApp',
    language: 'English'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        surname: user.surname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        notificationPreference: user.preferences?.notificationPreference || 'WhatsApp',
        language: user.preferences?.language || 'English'
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        if (formData.newPassword.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return;
        }
      }

      const updateData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        surname: formData.surname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        preferences: {
          notificationPreference: formData.notificationPreference,
          language: formData.language
        }
      };

      if (formData.newPassword) {
        Object.assign(updateData, {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      }

      await users.update(user!._id, updateData);
      toast.success('Settings updated successfully');

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="py-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>
              </div>
              <div className="px-3 py-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Surname</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Lock className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Security</h3>
                </div>
              </div>
              <div className="px-3 py-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                </div>
              </div>
              <div className="px-3 py-3 space-y-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <label className="block text-sm font-medium text-gray-700">Notification Preference</label>
                  </div>
                  <select
                    name="notificationPreference"
                    value={formData.notificationPreference}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                  </div>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                  >
                    <option value="English">English</option>
                    <option value="Setswana">Setswana</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}