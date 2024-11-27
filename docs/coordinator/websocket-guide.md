# WebSocket Integration Guide

## Overview

The Delivery Coordinator Interface uses WebSocket connections for real-time updates on deliveries, staff status, and zone changes. This guide explains how to implement and use WebSocket functionality in your components.

## WebSocket Configuration

### Connection Setup

```typescript
import { WS_BASE_URL, WS_EVENTS } from '../services/config';

const socket = new WebSocket(WS_BASE_URL);

socket.onopen = () => {
  console.log('WebSocket connection established');
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};
```

### Event Types

The system supports the following WebSocket events:

```typescript
export const WS_EVENTS = {
  DELIVERY_UPDATE: 'delivery_update',
  STAFF_STATUS_UPDATE: 'staff_status_update',
  ZONE_UPDATE: 'zone_update',
  NEW_COMMUNICATION: 'new_communication'
};
```

## Implementation Examples

### Delivery Updates

```typescript
function DeliveryTracker() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(WS_BASE_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === WS_EVENTS.DELIVERY_UPDATE) {
        // Update delivery status in real-time
        setDeliveries(prevDeliveries => 
          prevDeliveries.map(delivery => 
            delivery.id === data.deliveryId 
              ? { ...delivery, ...data.changes }
              : delivery
          )
        );
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return <DeliveryList deliveries={deliveries} />;
}
```

### Staff Status Updates

```typescript
function StaffMonitor() {
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(WS_BASE_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === WS_EVENTS.STAFF_STATUS_UPDATE) {
        // Update staff status in real-time
        setStaffMembers(prevStaff => 
          prevStaff.map(staff => 
            staff.id === data.staffId 
              ? { ...staff, status: data.status }
              : staff
          )
        );
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return <StaffList staff={staffMembers} />;
}
```

## Error Handling

### Reconnection Logic

```typescript
function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      reconnectAttempts.current = 0;
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, 1000 * Math.pow(2, reconnectAttempts.current));
      }
    };

    setSocket(ws);
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  return socket;
}
```

## Best Practices

1. **Connection Management**
   - Implement reconnection logic with exponential backoff
   - Clean up WebSocket connections when components unmount
   - Handle connection errors gracefully

2. **State Management**
   - Keep WebSocket state in sync with component state
   - Implement optimistic updates for better UX
   - Handle race conditions between WebSocket updates and API calls

3. **Performance**
   - Only open necessary WebSocket connections
   - Close connections when they're no longer needed
   - Implement message queuing for high-frequency updates

4. **Security**
   - Implement proper authentication for WebSocket connections
   - Validate all incoming messages
   - Use secure WebSocket connections (WSS)
