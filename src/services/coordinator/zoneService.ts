import axios from 'axios';
import { API_BASE_URL } from '../config';

const ZONE_API = `${API_BASE_URL}/api/coordinator/zones`;

export interface ZoneData {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  coverage: {
    coordinates: Array<{ lat: number; lng: number }>;
  };
  deliveryTimeWindow: {
    start: string;
    end: string;
  };
  pricing: {
    basePrice: number;
    pricePerKm: number;
    rushHourMultiplier: number;
  };
  metrics: {
    activeDeliveries: number;
    averageDeliveryTime: number;
    successRate: number;
  };
}

export const zoneService = {
  // Get all zones
  getAllZones: async () => {
    const response = await axios.get(`${ZONE_API}`);
    return response.data;
  },

  // Get zone by ID
  getZoneById: async (id: string) => {
    const response = await axios.get(`${ZONE_API}/${id}`);
    return response.data;
  },

  // Update zone coverage
  updateZoneCoverage: async (id: string, coverage: ZoneData['coverage']) => {
    const response = await axios.patch(`${ZONE_API}/${id}/coverage`, coverage);
    return response.data;
  },

  // Update zone pricing
  updateZonePricing: async (id: string, pricing: ZoneData['pricing']) => {
    const response = await axios.patch(`${ZONE_API}/${id}/pricing`, pricing);
    return response.data;
  },

  // Update delivery time window
  updateTimeWindow: async (id: string, timeWindow: ZoneData['deliveryTimeWindow']) => {
    const response = await axios.patch(`${ZONE_API}/${id}/time-window`, timeWindow);
    return response.data;
  },

  // Get zone performance metrics
  getZoneMetrics: async (id: string) => {
    const response = await axios.get(`${ZONE_API}/${id}/metrics`);
    return response.data;
  }
};
