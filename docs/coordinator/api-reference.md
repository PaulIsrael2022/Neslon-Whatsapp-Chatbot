# API Reference

## Delivery API

### Endpoints

#### Get Active Deliveries
```typescript
GET /api/coordinator/deliveries/active
```
Returns a list of all active deliveries.

**Response**
```typescript
{
  deliveries: DeliveryData[];
}

interface DeliveryData {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  deliveryOfficer: {
    id: string;
    name: string;
  };
  estimatedDeliveryTime: string;
  customerName: string;
  address: string;
  zone: string;
}
```

#### Update Delivery Status
```typescript
PATCH /api/coordinator/deliveries/:id/status
```
Updates the status of a specific delivery.

**Request Body**
```typescript
{
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
}
```

## Staff API

### Endpoints

#### Get All Staff
```typescript
GET /api/coordinator/staff
```
Returns a list of all staff members.

**Response**
```typescript
{
  staff: StaffMember[];
}

interface StaffMember {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  currentDeliveries: number;
  completedDeliveries: number;
  rating: number;
  zone: string;
}
```

#### Update Staff Status
```typescript
PATCH /api/coordinator/staff/:id/status
```
Updates the status of a staff member.

**Request Body**
```typescript
{
  status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
}
```

## Zone API

### Endpoints

#### Get All Zones
```typescript
GET /api/coordinator/zones
```
Returns a list of all delivery zones.

**Response**
```typescript
{
  zones: ZoneData[];
}

interface ZoneData {
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
```

#### Update Zone Coverage
```typescript
PATCH /api/coordinator/zones/:id/coverage
```
Updates the coverage area of a zone.

**Request Body**
```typescript
{
  coverage: {
    coordinates: Array<{ lat: number; lng: number }>;
  };
}
```

## WebSocket Events

### Event Types

#### Delivery Updates
```typescript
{
  type: 'delivery_update';
  data: {
    deliveryId: string;
    status: string;
    timestamp: string;
  };
}
```

#### Staff Status Updates
```typescript
{
  type: 'staff_status_update';
  data: {
    staffId: string;
    status: string;
    timestamp: string;
  };
}
```

#### Zone Updates
```typescript
{
  type: 'zone_update';
  data: {
    zoneId: string;
    changes: Partial<ZoneData>;
    timestamp: string;
  };
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_ERROR`: Server error
