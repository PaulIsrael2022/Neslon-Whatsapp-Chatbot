import axios from 'axios';
import type { 
  ApiResponse, 
  Order, 
  Stats, 
  User, 
  Pharmacy, 
  Clinic,
  Doctor,
  Service,
  Notification,
  OrderFilters,
  PharmacyFilters,
  NotificationFilters,
  Medication,
  InventoryTransaction,
  Settings,
  Delivery,
  DeliveryZone
} from '../types';

// Get the API URL from environment variables
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const deliveries = {
  list: async (filters?: {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    zone?: string;
    deliveryOfficer?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<Delivery[]>>('/deliveries', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Delivery>>(`/deliveries/${id}`);
    return response.data;
  },

  create: async (deliveryData: Partial<Delivery>) => {
    const response = await api.post<ApiResponse<Delivery>>('/deliveries', deliveryData);
    return response.data;
  },

  update: async (id: string, deliveryData: Partial<Delivery>) => {
    const response = await api.patch<ApiResponse<Delivery>>(`/deliveries/${id}`, deliveryData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/deliveries/${id}`);
    return response.data;
  },

  updateLocation: async (id: string, locationData: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    const response = await api.post<ApiResponse<Delivery>>(`/deliveries/${id}/location`, locationData);
    return response.data;
  },

  addFeedback: async (id: string, feedbackData: {
    rating: number;
    comment: string;
  }) => {
    const response = await api.post<ApiResponse<Delivery>>(`/deliveries/${id}/feedback`, feedbackData);
    return response.data;
  }
};

export const deliveryZones = {
  list: async (filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<DeliveryZone[]>>('/delivery-zones', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<DeliveryZone>>(`/delivery-zones/${id}`);
    return response.data;
  },

  create: async (zoneData: Partial<DeliveryZone>) => {
    const response = await api.post<ApiResponse<DeliveryZone>>('/delivery-zones', zoneData);
    return response.data;
  },

  update: async (id: string, zoneData: Partial<DeliveryZone>) => {
    const response = await api.patch<ApiResponse<DeliveryZone>>(`/delivery-zones/${id}`, zoneData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/delivery-zones/${id}`);
    return response.data;
  }
};

// Rest of the existing API services...
export const settings = {
  get: async () => {
    const response = await api.get<ApiResponse<Settings>>('/settings');
    return response.data;
  },
  update: async (settingsData: Partial<Settings>) => {
    const response = await api.patch<ApiResponse<Settings>>('/settings', settingsData);
    return response.data;
  },
  updateSection: async (section: string, data: any) => {
    const response = await api.patch<ApiResponse<Settings>>(`/settings/${section}`, data);
    return response.data;
  },
  testEmail: async () => {
    const response = await api.post<ApiResponse<void>>('/settings/test-email');
    return response.data;
  },
  testWhatsApp: async () => {
    const response = await api.post<ApiResponse<void>>('/settings/test-whatsapp');
    return response.data;
  },
  sync: async () => {
    const response = await api.post<ApiResponse<{ lastSync: Date }>>('/settings/sync');
    return response.data;
  }
};

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: Partial<User>) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }
};

export const users = {
  list: async (filters?: { 
    search?: string; 
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<User[]>>('/users', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
  create: async (userData: Partial<User>) => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data;
  },
  update: async (id: string, userData: Partial<User>) => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
};

export const patients = {
  list: async (filters?: { 
    search?: string; 
    memberType?: string; 
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<User[]>>('/users/patients', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/patients/${id}`);
    return response.data;
  },
  create: async (patientData: Partial<User>) => {
    const response = await api.post<ApiResponse<User>>('/users/patients', patientData);
    return response.data;
  },
  update: async (id: string, patientData: Partial<User>) => {
    const response = await api.patch<ApiResponse<User>>(`/users/patients/${id}`, patientData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/users/patients/${id}`);
    return response.data;
  }
};

export const clinics = {
  list: async (filters?: { 
    search?: string;
    isActive?: boolean;
    isPartner?: boolean;
    specialties?: string[];
    page?: number;
    limit?: number;
  }) => {
    console.log('📡 Fetching clinics with filters:', filters);
    const response = await api.get<ApiResponse<Clinic[]>>('/clinics', { params: filters });
    console.log('📥 Clinics response:', response.data);
    return response.data;
  },

  getById: async (id: string) => {
    console.log(`📡 Fetching clinic ${id}`);
    const response = await api.get<ApiResponse<Clinic>>(`/clinics/${id}`);
    console.log('📥 Clinic response:', response.data);
    return response.data;
  },

  create: async (clinicData: Partial<Clinic>) => {
    console.log('📡 Creating clinic:', clinicData);
    const response = await api.post<ApiResponse<Clinic>>('/clinics', clinicData);
    console.log('📥 Create response:', response.data);
    return response.data;
  },

  update: async (id: string, clinicData: Partial<Clinic>) => {
    console.log(`📡 Updating clinic ${id}:`, clinicData);
    const response = await api.patch<ApiResponse<Clinic>>(`/clinics/${id}`, clinicData);
    console.log('📥 Update response:', response.data);
    return response.data;
  },

  delete: async (id: string) => {
    console.log(`📡 Deleting clinic ${id}`);
    const response = await api.delete<ApiResponse<void>>(`/clinics/${id}`);
    console.log('📥 Delete response:', response.data);
    return response.data;
  }
};

export const doctors = {
  list: async (filters?: { 
    search?: string;
    specialization?: string;
    clinic?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<Doctor[]>>('/doctors', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data;
  },
  create: async (doctorData: Partial<Doctor>) => {
    const response = await api.post<ApiResponse<Doctor>>('/doctors', doctorData);
    return response.data;
  },
  update: async (id: string, doctorData: Partial<Doctor>) => {
    const response = await api.patch<ApiResponse<Doctor>>(`/doctors/${id}`, doctorData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/doctors/${id}`);
    return response.data;
  }
};

export const services = {
  list: async (filters?: { 
    search?: string;
    category?: string;
    clinic?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<Service[]>>('/services', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data;
  },
  create: async (serviceData: Partial<Service>) => {
    const response = await api.post<ApiResponse<Service>>('/services', serviceData);
    return response.data;
  },
  update: async (id: string, serviceData: Partial<Service>) => {
    const response = await api.patch<ApiResponse<Service>>(`/services/${id}`, serviceData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/services/${id}`);
    return response.data;
  }
};

export const orders = {
  list: async (filters?: OrderFilters) => {
    const response = await api.get<ApiResponse<Order[]>>('/orders', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData: Partial<Order>) => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data;
  },

  update: async (id: string, orderData: Partial<Order>) => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}`, orderData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/orders/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<Stats>>('/orders/stats/overview');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  sendNotification: async (orderId: string, data: {
    type: 'whatsapp' | 'sms' | 'email';
    message: string;
    to: string;
  }) => {
    const response = await api.post<ApiResponse<void>>(`/orders/${orderId}/notifications`, data);
    return response.data;
  },

  updateStatus: async (id: string, data: {
    status: OrderStatus;
    note?: string;
  }) => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
    return response.data;
  },

  assignDeliveryOfficer: async (id: string, deliveryOfficerId: string) => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/assign-delivery`, { deliveryOfficerId });
    return response.data;
  },

  assignPharmacy: async (id: string, pharmacyId: string) => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/assign-pharmacy`, { pharmacyId });
    return response.data;
  }
};

export const pharmacies = {
  list: async (filters?: { 
    search?: string;
    isActive?: boolean;
    isPartner?: boolean;
    page?: number;
    limit?: number;
  }) => {
    console.log('📡 Fetching pharmacies with filters:', filters);
    const response = await api.get<ApiResponse<Pharmacy[]>>('/pharmacies', { params: filters });
    console.log('📥 Pharmacies response:', response.data);
    return response.data;
  },

  getById: async (id: string) => {
    console.log(`📡 Fetching pharmacy ${id}`);
    const response = await api.get<ApiResponse<Pharmacy>>(`/pharmacies/${id}`);
    console.log('📥 Pharmacy response:', response.data);
    return response.data;
  },

  create: async (pharmacyData: Partial<Pharmacy>) => {
    console.log('📡 Creating pharmacy:', pharmacyData);
    const response = await api.post<ApiResponse<Pharmacy>>('/pharmacies', pharmacyData);
    console.log('📥 Create response:', response.data);
    return response.data;
  },

  update: async (id: string, pharmacyData: Partial<Pharmacy>) => {
    console.log(`📡 Updating pharmacy ${id}:`, pharmacyData);
    const response = await api.patch<ApiResponse<Pharmacy>>(`/pharmacies/${id}`, pharmacyData);
    console.log('📥 Update response:', response.data);
    return response.data;
  },

  delete: async (id: string) => {
    console.log(`📡 Deleting pharmacy ${id}`);
    const response = await api.delete<ApiResponse<void>>(`/pharmacies/${id}`);
    console.log('📥 Delete response:', response.data);
    return response.data;
  }
};

export const inventory = {
  list: async (filters?: { 
    search?: string; 
    type?: string; 
    status?: string;
    pharmacy?: string;
    approved?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const response = await api.get<ApiResponse<Medication[]>>('/inventory', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Medication>>(`/inventory/${id}`);
    return response.data;
  },
  create: async (medicationData: Partial<Medication>) => {
    const response = await api.post<ApiResponse<Medication>>('/inventory', medicationData);
    return response.data;
  },
  update: async (id: string, medicationData: Partial<Medication>) => {
    const response = await api.patch<ApiResponse<Medication>>(`/inventory/${id}`, medicationData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/inventory/${id}`);
    return response.data;
  },
  requestApproval: async (id: string) => {
    const response = await api.post<ApiResponse<void>>(`/inventory/${id}/request-approval`);
    return response.data;
  },
  approve: async (id: string) => {
    const response = await api.post<ApiResponse<void>>(`/inventory/${id}/approve`);
    return response.data;
  },
  updateInventory: async (id: string, data: {
    pharmacy: string;
    quantity?: number;
    status?: string;
    adjustmentReason?: string;
  }) => {
    const response = await api.post<ApiResponse<void>>(`/inventory/${id}/inventory`, data);
    return response.data;
  }
};

export const notifications = {
  create: async (notificationData: {
    type: 'WHATSAPP' | 'EMAIL';
    recipients: string[];
    message: string;
    subject?: string;
    scheduledFor?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    isRecurring?: boolean;
    recurringPattern?: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      interval: number;
      endDate?: string;
    };
  }) => {
    const response = await api.post<ApiResponse<Notification>>('/notifications', notificationData);
    return response.data;
  },
  list: async (filters?: NotificationFilters) => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications', { params: filters });
    return response.data;
  }
};

export const images = {
  getPrescriptionImage: (orderId: string, index: number) => {
    const token = localStorage.getItem('token');
    return {
      url: `${API_URL}/api/images/orders/${orderId}/prescription-image/${index}`,
      headers: { Authorization: `Bearer ${token}` }
    };
  },
  getMedicalAidCard: (userId: string, side: 'front' | 'back') => {
    const token = localStorage.getItem('token');
    return {
      url: `${API_URL}/api/images/users/${userId}/medical-aid-card/${side}`,
      headers: { Authorization: `Bearer ${token}` }
    };
  }
};

export default api;