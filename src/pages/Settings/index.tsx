import React, { useState, useEffect } from 'react';
import { Save, Home, Building2, Users, Bell, Truck, Shield, Link } from 'lucide-react';
import { toast } from 'react-hot-toast';
import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';
import DeliverySettings from './DeliverySettings';
import SecuritySettings from './SecuritySettings';
import UserManagement from './UserManagement';
import BusinessSettings from './BusinessSettings';
import IntegrationSettings from './IntegrationSettings';
import { settings } from '../../services/api';
import type { Settings as SettingsType } from '../../types';

const tabs = [
  { id: 'general', name: 'General', icon: Home, component: GeneralSettings },
  { id: 'business', name: 'Business', icon: Building2, component: BusinessSettings },
  { id: 'users', name: 'User Management', icon: Users, component: UserManagement },
  { id: 'notifications', name: 'Notifications', icon: Bell, component: NotificationSettings },
  { id: 'delivery', name: 'Delivery', icon: Truck, component: DeliverySettings },
  { id: 'security', name: 'Security', icon: Shield, component: SecuritySettings },
  { id: 'integrations', name: 'Integrations', icon: Link, component: IntegrationSettings }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users'); // Set default tab to users
  const [saving, setSaving] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsType | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settings.get();
      setSettingsData(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async () => {
    if (!settingsData) return;

    try {
      setSaving(true);
      await settings.update(settingsData);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsChange = (section: string, data: any) => {
    if (!settingsData) return;
    
    setSettingsData({
      ...settingsData,
      [section]: { ...settingsData[section], ...data }
    });
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Settings
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleSave}
            disabled={saving || activeTab === 'users'} // Disable save button for user management
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <ActiveComponent 
            settings={settingsData} 
            onSettingsChange={(data: any) => handleSettingsChange(activeTab, data)}
          />
        </div>
      </div>
    </div>
  );
}