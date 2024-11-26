import React from 'react';
import { Bell, X, Circle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationsDropdown({ notifications, onClose, onMarkAsRead }: NotificationsDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
      <div className="py-2">
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-700">Notifications</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              No new notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="ml-2 text-blue-600 hover:text-blue-700"
                    >
                      <Circle className="h-2 w-2 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}