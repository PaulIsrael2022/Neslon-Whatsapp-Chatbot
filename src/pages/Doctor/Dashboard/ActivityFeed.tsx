import React from 'react';
import { Calendar, Package, MessageSquare, Clock } from 'lucide-react';

export default function ActivityFeed() {
  // Mock data - replace with actual API calls
  const activities = [
    {
      id: 1,
      type: 'APPOINTMENT',
      title: 'New appointment scheduled',
      description: 'John Doe - Consultation',
      time: '10 minutes ago',
      icon: Calendar,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'ORDER',
      title: 'Prescription order created',
      description: 'Jane Smith - Amoxicillin',
      time: '30 minutes ago',
      icon: Package,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100'
    },
    {
      id: 3,
      type: 'MESSAGE',
      title: 'New message received',
      description: 'From: Sarah Johnson',
      time: '1 hour ago',
      icon: MessageSquare,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
      </div>

      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 rounded-md p-2 ${activity.iconBg}`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center text-sm text-gray-500">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {activity.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all activity
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  );
}