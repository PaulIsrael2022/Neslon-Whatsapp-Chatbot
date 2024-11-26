import React, { useState } from 'react';
import { Send, User, Phone, Tag, Clock } from 'lucide-react';
import type { User as UserType, ChatMessage } from '../../types';

interface ChatWindowProps {
  chat: UserType;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [quickReplies] = useState([
    'How can I help you today?',
    'Please provide your medical aid number.',
    'Let me check that for you.',
    'Would you like to schedule an appointment?'
  ]);

  // Mock messages - replace with actual API call
  const messages: ChatMessage[] = [
    {
      _id: '1',
      sender: 'user',
      content: 'Hello, I need help with my prescription',
      timestamp: new Date(Date.now() - 3600000),
      category: 'PHARMACIST_CONSULTATION'
    },
    {
      _id: '2',
      sender: 'admin',
      content: 'Hi! I\'d be happy to help. Could you please provide your prescription number?',
      timestamp: new Date(Date.now() - 3500000),
      category: 'PHARMACIST_CONSULTATION'
    }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Handle message sending
    setMessage('');
  };

  const getCategoryBadge = (category: string) => {
    const categories = {
      APPOINTMENT_REQUEST: 'bg-blue-100 text-blue-800',
      GENERAL_SUPPORT: 'bg-gray-100 text-gray-800',
      PHARMACIST_CONSULTATION: 'bg-green-100 text-green-800',
      DOCTOR_CONSULTATION: 'bg-red-100 text-red-800'
    };
    return categories[category] || categories.GENERAL_SUPPORT;
  };

  return (
    <>
      {/* Chat Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {chat.firstName} {chat.surname}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Phone className="h-3 w-3 mr-1" />
                {chat.phoneNumber}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <Tag className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <Clock className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              <div
                className={`mt-1 flex items-center text-xs text-gray-500 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                <span
                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(
                    msg.category
                  )}`}
                >
                  {msg.category.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="flex-shrink-0 p-4 bg-white border-t">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => setMessage(reply)}
              className="flex-shrink-0 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex-shrink-0 p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="inline-flex items-center p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </>
  );
}