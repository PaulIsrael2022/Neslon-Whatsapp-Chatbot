import React from 'react';
import { Package, Clock, Truck, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import type { Stats } from '../../types';

interface StatsCardProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardProps) {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Out for Delivery',
      value: stats.outForDelivery,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Processing',
      value: stats.processingOrders,
      icon: RotateCcw,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Completed',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Cancelled',
      value: stats.cancelledOrders,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((card) => (
        <div key={card.title} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}