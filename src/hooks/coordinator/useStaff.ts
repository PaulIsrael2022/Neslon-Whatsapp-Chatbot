import { useState, useEffect } from 'react';
import { staffService, StaffMember } from '../../services/coordinator/staffService';

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllStaff();
      setStaff(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch staff members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStaffStatus = async (id: string, status: string) => {
    try {
      await staffService.updateStaffStatus(id, status);
      await fetchStaff(); // Refresh the list
    } catch (err) {
      setError('Failed to update staff status');
      console.error(err);
    }
  };

  const updateStaffZone = async (staffId: string, zoneId: string) => {
    try {
      await staffService.updateStaffZone(staffId, zoneId);
      await fetchStaff(); // Refresh the list
    } catch (err) {
      setError('Failed to update staff zone');
      console.error(err);
    }
  };

  const getStaffMetrics = async (id: string) => {
    try {
      const metrics = await staffService.getStaffMetrics(id);
      return metrics;
    } catch (err) {
      setError('Failed to fetch staff metrics');
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    loading,
    error,
    updateStaffStatus,
    updateStaffZone,
    getStaffMetrics,
    refreshStaff: fetchStaff
  };
};
