import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Phone, AlertTriangle, 
  Send, User, Search, Filter 
} from 'lucide-react';

interface Message {
  id: string;
  type: 'WhatsApp' | 'System' | 'Internal';
  sender: {
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
  priority: 'Low' | 'Medium' | 'High';
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Communications() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedTab, setSelectedTab] = useState<'messages' | 'issues'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Status badge styles
  const priorityStyles = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  const statusStyles = {
    'Open': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Resolved': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Communications & Support</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search messages or issues..."
            />
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('messages')}
            className={`${
              selectedTab === 'messages'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </button>
          <button
            onClick={() => setSelectedTab('issues')}
            className={`${
              selectedTab === 'issues'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Issues
          </button>
        </nav>
      </div>

      {/* Messages Tab */}
      {selectedTab === 'messages' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {messages.map((message) => (
              <li key={message.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600">
                          {message.sender.name}
                        </p>
                        <span className="ml-2 text-xs text-gray-500">
                          {message.sender.role}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {message.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      priorityStyles[message.priority]
                    }`}>
                      {message.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues Tab */}
      {selectedTab === 'issues' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <li key={issue.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900">
                        {issue.title}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {issue.description}
                    </p>
                    {issue.assignedTo && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>Assigned to: {issue.assignedTo}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      priorityStyles[issue.priority]
                    }`}>
                      {issue.priority}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusStyles[issue.status]
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated: {issue.updatedAt}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Action Button */}
      <div className="fixed bottom-8 right-8">
        <button
          type="button"
          className="inline-flex items-center p-3 border border-transparent rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {selectedTab === 'messages' ? (
            <Send className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Plus className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
