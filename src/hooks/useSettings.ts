import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SettingsService from '../services/settings';
import type { Settings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🔍 Loading settings...');
      setLoading(true);
      const data = await SettingsService.getSettings();
      console.log('📥 Received settings:', data);
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error loading settings:', err);
      setError(err as Error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (section: string, data: Partial<Settings>) => {
    try {
      console.log(`🔄 Updating settings section "${section}" with data:`, data);
      setLoading(true);
      const updatedSettings = await SettingsService.updateSettings(section, data);
      console.log('📤 Settings update response:', updatedSettings);
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
      return true;
    } catch (err) {
      console.error('❌ Error updating settings:', err);
      setError(err as Error);
      toast.error('Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAllSettings = async (data: Partial<Settings>) => {
    try {
      console.log('🔄 Updating all settings with data:', data);
      setLoading(true);
      const updatedSettings = await SettingsService.updateAllSettings(data);
      console.log('📤 All settings update response:', updatedSettings);
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
      return true;
    } catch (err) {
      console.error('❌ Error updating all settings:', err);
      setError(err as Error);
      toast.error('Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    updateAllSettings
  };
}