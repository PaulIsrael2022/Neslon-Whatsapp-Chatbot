import React from 'react';
import { Package, Truck, AlertTriangle, DollarSign, User } from 'lucide-react';

export default function ActivityTimeline() {
  // Mock data - replace with actual API call
  const activities = [
    {
      id: 1,
      type: 'ORDER',
      title: 'New prescription order received',
      description: 'Order #ORD-2024-001 from John Doe',
      time: '10 minutes ago',
      icon: Package,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'DELIVERY',
      title: 'Delivery assigned',
      description: 'Order #ORD-2024-002 assigned to Driver Mike',
      time: '30 minutes ago',
      icon: Truck,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100'
    },
    {
      id: 3,
      type: 'STOCK',
      title: 'Low stock alert',
      description: 'Amoxicillin 500mg below minimum threshold',
      time: '1 hour ago',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100'
    },
    {
      id: 4,
      type: 'PAYMENT',
      title: 'Payment received',
      description: 'R500.00 received for Order #ORD-2024-003',
      time: '2 hours ago',
      icon: DollarSign,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100'
    }
  ];

  return (
    <div className="mt-4 flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`${activity.iconBg} h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                  >
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} aria-hidden="true" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={activity.time}>{activity.time}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}