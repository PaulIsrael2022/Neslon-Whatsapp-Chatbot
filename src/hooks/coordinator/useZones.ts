import { useState, useEffect } from 'react';
import { zoneService, ZoneData } from '../../services/coordinator/zoneService';

export const useZones = () => {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const data = await zoneService.getAllZones();
      setZones(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch zones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateZoneCoverage = async (id: string, coverage: ZoneData['coverage']) => {
    try {
      await zoneService.updateZoneCoverage(id, coverage);
      await fetchZones(); // Refresh the list
    } catch (err) {
      setError('Failed to update zone coverage');
      console.error(err);
    }
  };

  const updateZonePricing = async (id: string, pricing: ZoneData['pricing']) => {
    try {
      await zoneService.updateZonePricing(id, pricing);
      await fetchZones(); // Refresh the list
    } catch (err) {
      setError('Failed to update zone pricing');
      console.error(err);
    }
  };

  const updateTimeWindow = async (id: string, timeWindow: ZoneData['deliveryTimeWindow']) => {
    try {
      await zoneService.updateTimeWindow(id, timeWindow);
      await fetchZones(); // Refresh the list
    } catch (err) {
      setError('Failed to update time window');
      console.error(err);
    }
  };

  const getZoneMetrics = async (id: string) => {
    try {
      const metrics = await zoneService.getZoneMetrics(id);
      return metrics;
    } catch (err) {
      setError('Failed to fetch zone metrics');
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return {
    zones,
    loading,
    error,
    updateZoneCoverage,
    updateZonePricing,
    updateTimeWindow,
    getZoneMetrics,
    refreshZones: fetchZones
  };
};
