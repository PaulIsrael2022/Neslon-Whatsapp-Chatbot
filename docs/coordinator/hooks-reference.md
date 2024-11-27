# Custom Hooks Reference

## Delivery Hooks

### useDeliveries

A hook for managing delivery-related operations and state.

```typescript
const {
  deliveries,
  loading,
  error,
  updateDeliveryStatus,
  updateDeliveryPriority,
  refreshDeliveries
} = useDeliveries();
```

#### Returns
- `deliveries`: Array of delivery objects
- `loading`: Boolean indicating loading state
- `error`: Error message if any
- `updateDeliveryStatus`: Function to update delivery status
- `updateDeliveryPriority`: Function to update delivery priority
- `refreshDeliveries`: Function to refresh delivery data

#### Example Usage
```typescript
function DeliveryList() {
  const {
    deliveries,
    loading,
    updateDeliveryStatus
  } = useDeliveries();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {deliveries.map(delivery => (
        <DeliveryCard
          key={delivery.id}
          delivery={delivery}
          onStatusChange={(status) => updateDeliveryStatus(delivery.id, status)}
        />
      ))}
    </div>
  );
}
```

## Staff Hooks

### useStaff

A hook for managing staff-related operations and state.

```typescript
const {
  staff,
  loading,
  error,
  updateStaffStatus,
  updateStaffZone,
  getStaffMetrics,
  refreshStaff
} = useStaff();
```

#### Returns
- `staff`: Array of staff member objects
- `loading`: Boolean indicating loading state
- `error`: Error message if any
- `updateStaffStatus`: Function to update staff status
- `updateStaffZone`: Function to update staff zone assignment
- `getStaffMetrics`: Function to fetch staff metrics
- `refreshStaff`: Function to refresh staff data

#### Example Usage
```typescript
function StaffList() {
  const {
    staff,
    loading,
    updateStaffStatus
  } = useStaff();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {staff.map(member => (
        <StaffCard
          key={member.id}
          staff={member}
          onStatusChange={(status) => updateStaffStatus(member.id, status)}
        />
      ))}
    </div>
  );
}
```

## Zone Hooks

### useZones

A hook for managing zone-related operations and state.

```typescript
const {
  zones,
  loading,
  error,
  updateZoneCoverage,
  updateZonePricing,
  updateTimeWindow,
  getZoneMetrics,
  refreshZones
} = useZones();
```

#### Returns
- `zones`: Array of zone objects
- `loading`: Boolean indicating loading state
- `error`: Error message if any
- `updateZoneCoverage`: Function to update zone coverage
- `updateZonePricing`: Function to update zone pricing
- `updateTimeWindow`: Function to update delivery time windows
- `getZoneMetrics`: Function to fetch zone metrics
- `refreshZones`: Function to refresh zone data

#### Example Usage
```typescript
function ZoneList() {
  const {
    zones,
    loading,
    updateZonePricing
  } = useZones();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {zones.map(zone => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          onPricingChange={(pricing) => updateZonePricing(zone.id, pricing)}
        />
      ))}
    </div>
  );
}
```

## Error Handling

All hooks include built-in error handling:

```typescript
function DeliveryManager() {
  const { deliveries, error, loading } = useDeliveries();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <DeliveryList deliveries={deliveries} />;
}
```

## Best Practices

1. Always handle loading and error states
2. Use the refresh functions when data needs to be updated
3. Implement proper error boundaries in your components
4. Use TypeScript for better type safety and developer experience
5. Consider implementing retry logic for failed operations
