import React from 'react';
import { Truck } from 'lucide-react';

interface DeliveryStatusBadgeProps {
  count: number;
}

export default function DeliveryStatusBadge({ count }: DeliveryStatusBadgeProps) {
  return (
    <div className="flex items-center px-3 py-1 bg-indigo-50 rounded-full">
      <Truck className="h-5 w-5 text-indigo-600" />
      <span className="ml-2 text-sm font-medium text-indigo-700">
        {count} Active {count === 1 ? 'Delivery' : 'Deliveries'}
      </span>
    </div>
  );
}
