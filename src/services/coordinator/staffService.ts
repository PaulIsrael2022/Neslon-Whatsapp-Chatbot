import axios from 'axios';
import { API_BASE_URL } from '../config';

const STAFF_API = `${API_BASE_URL}/api/coordinator/staff`;

export interface StaffMember {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  currentDeliveries: number;
  completedDeliveries: number;
  rating: number;
  zone: string;
}

export const staffService = {
  // Get all staff members
  getAllStaff: async () => {
    const response = await axios.get(`${STAFF_API}`);
    return response.data;
  },

  // Get staff member by ID
  getStaffById: async (id: string) => {
    const response = await axios.get(`${STAFF_API}/${id}`);
    return response.data;
  },

  // Update staff status
  updateStaffStatus: async (id: string, status: string) => {
    const response = await axios.patch(`${STAFF_API}/${id}/status`, { status });
    return response.data;
  },

  // Get staff performance metrics
  getStaffMetrics: async (id: string) => {
    const response = await axios.get(`${STAFF_API}/${id}/metrics`);
    return response.data;
  },

  // Update staff zone assignment
  updateStaffZone: async (staffId: string, zoneId: string) => {
    const response = await axios.patch(`${STAFF_API}/${staffId}/zone`, { zoneId });
    return response.data;
  },

  // Get staff schedule
  getStaffSchedule: async (staffId: string) => {
    const response = await axios.get(`${STAFF_API}/${staffId}/schedule`);
    return response.data;
  }
};
