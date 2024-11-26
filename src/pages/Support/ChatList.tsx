import React from 'react';
import { User, MessageSquare, Clock, Calendar, Pill, Stethoscope } from 'lucide-react';
import type { User as UserType, ChatMessage } from '../../types';

interface ChatListProps {
  selectedChat: UserType | null;
  onChatSelect: (chat: UserType) => void;
  filters: {
    search: string;
    category: string;
    status: string;
    date: string;
  };
}

export default function ChatList({ selectedChat, onChatSelect, filters }: ChatListProps) {
  // Mock data - replace with actual API call
  const chats = [
    {
      user: {
        _id: '1',
        firstName: 'John',
        surname: 'Doe',
        phoneNumber: '+1234567890',
        lastMessage: {
          content: 'I need to schedule an appointment',
          timestamp: new Date(),
          category: 'APPOINTMENT_REQUEST',
          unreadCount: 2
        }
      }
    },
    {
      user: {
        _id: '2',
        firstName: 'Jane',
        surname: 'Smith',
        phoneNumber: '+0987654321',
        lastMessage: {
          content: 'Question about my prescription',
          timestamp: new Date(Date.now() - 3600000),
          category: 'PHARMACIST_CONSULTATION',
          unreadCount: 0
        }
      }
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'APPOINTMENT_REQUEST':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'GENERAL_SUPPORT':
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      case 'PHARMACIST_CONSULTATION':
        return <Pill className="h-4 w-4 text-green-500" />;
      case 'DOCTOR_CONSULTATION':
        return <Stethoscope className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {chats.map(({ user }) => (
        <button
          key={user._id}
          onClick={() => onChatSelect(user)}
          className={`w-full flex items-center px-4 py-4 hover:bg-gray-50 focus:outline-none ${
            selectedChat?._id === user._id ? 'bg-indigo-50' : ''
          }`}
        >
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.surname}
              </p>
              <div className="flex items-center">
                {getCategoryIcon(user.lastMessage.category)}
                {user.lastMessage.unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {user.lastMessage.unreadCount}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm text-gray-500 truncate">{user.lastMessage.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(user.lastMessage.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}