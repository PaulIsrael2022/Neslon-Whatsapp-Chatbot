// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// WebSocket configuration for real-time updates
export const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3000';

// API endpoints configuration
export const API_ENDPOINTS = {
  coordinator: {
    deliveries: '/api/coordinator/deliveries',
    staff: '/api/coordinator/staff',
    zones: '/api/coordinator/zones',
    metrics: '/api/coordinator/metrics',
    communications: '/api/coordinator/communications'
  }
};

// API request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000;

// Retry configuration
export const RETRY_CONFIG = {
  retries: 3,
  initialRetryDelay: 1000,
  maxRetryDelay: 5000
};

// WebSocket events
export const WS_EVENTS = {
  DELIVERY_UPDATE: 'delivery_update',
  STAFF_STATUS_UPDATE: 'staff_status_update',
  ZONE_UPDATE: 'zone_update',
  NEW_COMMUNICATION: 'new_communication'
};
