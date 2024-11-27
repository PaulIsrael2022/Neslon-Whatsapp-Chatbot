import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, User, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeliveryIssue {
  id: string;
  orderNumber: string;
  timestamp: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  description: string;
  officer: {
    name: string;
    id: string;
  };
  customer: {
    name: string;
    phone: string;
  };
}

export default function IssuesManagement() {
  const [issues, setIssues] = useState<DeliveryIssue[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    // TODO: Load issues from API
    const mockIssues: DeliveryIssue[] = [
      {
        id: '1',
        orderNumber: 'DEL-001',
        timestamp: '2023-12-01T10:30:00',
        status: 'open',
        priority: 'high',
        description: 'Customer not available at delivery location',
        officer: {
          name: 'John Smith',
          id: 'OFF-001'
        },
        customer: {
          name: 'Alice Johnson',
          phone: '+1234567890'
        }
      },
      // Add more mock data as needed
    ];
    setIssues(mockIssues);
  }, [filterStatus, filterPriority]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Delivery Issues</h1>
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={() => toast.success('Coming soon!')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Report Issue
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {issues.map((issue) => (
            <li key={issue.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {issue.orderNumber}
                    </span>
                    <Clock className="ml-4 h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(issue.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  {issue.description}
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="font-medium">{issue.officer.name}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <MessageCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{issue.customer.phone}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Coming soon!')}
                    className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
