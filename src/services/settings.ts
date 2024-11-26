import { settings } from './api';
import type { Settings } from '../types';

class SettingsService {
  private static instance: SettingsService;
  private settingsCache: Settings | null = null;

  private constructor() {
    console.log('🏗️ SettingsService instance created');
  }

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async getSettings(): Promise<Settings> {
    console.log('📡 SettingsService: Fetching settings...');
    console.log('💾 Current cache state:', this.settingsCache);
    
    if (!this.settingsCache) {
      console.log('🔍 Cache miss, fetching from API...');
      const response = await settings.get();
      console.log('📥 API Response:', response);
      this.settingsCache = response.data;
    } else {
      console.log('✨ Using cached settings');
    }
    
    return this.settingsCache;
  }

  async updateSettings(section: string, data: Partial<Settings>): Promise<Settings> {
    console.log(`📤 SettingsService: Updating section "${section}" with data:`, data);
    const response = await settings.updateSection(section, data);
    console.log('📥 Update response:', response);
    this.settingsCache = response.data;
    return this.settingsCache;
  }

  async updateAllSettings(data: Partial<Settings>): Promise<Settings> {
    console.log('📤 SettingsService: Updating all settings with data:', data);
    const response = await settings.update(data);
    console.log('📥 Update all response:', response);
    this.settingsCache = response.data;
    return this.settingsCache;
  }

  clearCache() {
    console.log('🧹 Clearing settings cache');
    this.settingsCache = null;
  }
}

export default SettingsService.getInstance();