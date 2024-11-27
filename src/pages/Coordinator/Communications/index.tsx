import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Clock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Communication {
  id: string;
  type: 'message' | 'call' | 'email';
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
  recipient: {
    name: string;
    contact: string;
    type: 'customer' | 'staff';
  };
  subject?: string;
  content: string;
}

export default function Communications() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // TODO: Load communications from API
    const mockCommunications: Communication[] = [
      {
        id: '1',
        type: 'message',
        timestamp: '2023-12-01T10:30:00',
        status: 'delivered',
        recipient: {
          name: 'Alice Johnson',
          contact: '+1234567890',
          type: 'customer'
        },
        content: 'Your delivery will arrive in 30 minutes.'
      },
      // Add more mock data as needed
    ];
    setCommunications(mockCommunications);
  }, [filterType, filterStatus]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-green-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Communications</h1>
        <div className="flex space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Types</option>
            <option value="message">Messages</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={() => toast.success('Coming soon!')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            New Communication
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {communications.map((comm) => (
            <li key={comm.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getTypeIcon(comm.type)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {comm.recipient.name}
                    </span>
                    <Clock className="ml-4 h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(comm.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(comm.status)}`}>
                      {comm.status}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-700">{comm.content}</p>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{comm.recipient.type}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <span>{comm.recipient.contact}</span>
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
