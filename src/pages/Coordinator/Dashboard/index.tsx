import React, { useState, useEffect } from 'react';
import { 
  Truck, Users, MapPin, AlertTriangle,
  TrendingUp, Clock, CheckCircle, XCircle 
} from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
}

export default function CoordinatorDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      title: 'Active Deliveries',
      value: '12',
      change: '+2.5%',
      icon: Truck,
      color: 'text-blue-600'
    },
    {
      title: 'Delivery Staff',
      value: '8',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Active Zones',
      value: '5',
      icon: MapPin,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Issues',
      value: '3',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    onTimeDeliveries: 95,
    averageDeliveryTime: '45 mins',
    customerSatisfaction: 4.8,
    deliveryEfficiency: 92
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Coordinator Dashboard</h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Generate Report
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {metric.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metric.value}
                        </div>
                        {metric.change && (
                          <div className="ml-2 text-sm font-medium text-green-600">
                            {metric.change}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Performance Overview
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">On-Time Deliveries</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {performanceMetrics.onTimeDeliveries}%
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Avg. Delivery Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {performanceMetrics.averageDeliveryTime}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Customer Satisfaction</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {performanceMetrics.customerSatisfaction}/5
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Delivery Efficiency</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {performanceMetrics.deliveryEfficiency}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts will be added here */}
    </div>
  );
}
