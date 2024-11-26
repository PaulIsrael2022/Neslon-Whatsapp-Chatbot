import React, { useState, useEffect } from 'react';
import { Key, Shield, Users } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function SecuritySettings() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    passwordRequirements: {
      requireStrongPassword: true,
      minLength: 8,
      requireNumbers: true,
      requireSymbols: true
    },
    passwordExpiry: 90,
    enable2FA: true,
    accessLogging: true,
    sessionTimeout: 30
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        passwordRequirements: settings.passwordRequirements || formData.passwordRequirements,
        passwordExpiry: settings.passwordExpiry || formData.passwordExpiry,
        enable2FA: settings.enable2FA || formData.enable2FA,
        accessLogging: settings.accessLogging || formData.accessLogging,
        sessionTimeout: settings.sessionTimeout || formData.sessionTimeout
      });
    }
  }, [settings]);

  const handlePasswordRequirementChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      passwordRequirements: {
        ...prev.passwordRequirements,
        [field]: !prev.passwordRequirements[field]
      }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    await updateSettings('security', formData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Password Requirements</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.passwordRequirements.requireStrongPassword}
                onChange={() => handlePasswordRequirementChange('requireStrongPassword')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Require Strong Passwords</label>
              <p className="text-gray-500 text-sm">
                Passwords must be at least 8 characters and include numbers and symbols
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.passwordRequirements.requireNumbers}
                onChange={() => handlePasswordRequirementChange('requireNumbers')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Require Numbers</label>
              <p className="text-gray-500 text-sm">
                Passwords must contain at least one number
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.passwordRequirements.requireSymbols}
                onChange={() => handlePasswordRequirementChange('requireSymbols')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Require Symbols</label>
              <p className="text-gray-500 text-sm">
                Passwords must contain at least one special character
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Password Length
            </label>
            <input
              type="number"
              min="8"
              value={formData.passwordRequirements.minLength}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordRequirements: {
                  ...prev.passwordRequirements,
                  minLength: parseInt(e.target.value)
                }
              }))}
              className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Password Expiry</h3>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Password Expiry (days)
          </label>
          <input
            type="number"
            name="passwordExpiry"
            value={formData.passwordExpiry}
            onChange={handleChange}
            className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Two-Factor Authentication</h3>
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="enable2FA"
                checked={formData.enable2FA}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Enable 2FA</label>
              <p className="text-gray-500 text-sm">
                Require two-factor authentication for all staff members
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Session Management</h3>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            name="sessionTimeout"
            value={formData.sessionTimeout}
            onChange={handleChange}
            className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="mt-2 text-sm text-gray-500">
            Automatically log out users after period of inactivity
          </p>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Access Logs</h3>
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="accessLogging"
                checked={formData.accessLogging}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Enable Access Logging</label>
              <p className="text-gray-500 text-sm">
                Keep detailed logs of all system access and changes
              </p>
            </div>
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