import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Pill } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PharmacySidebar from './PharmacySidebar';
import NotificationsDropdown from '../components/Header/NotificationsDropdown';
import UserMenu from '../components/Header/UserMenu';
import { toast } from 'react-hot-toast';

export default function PharmacyLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock notifications - replace with actual data
  const notifications = [
    {
      id: '1',
      title: 'New Order',
      message: 'New prescription order received',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Amoxicillin stock below threshold',
      time: '1 hour ago',
      read: true
    }
  ];

  const handleMarkAsRead = (id: string) => {
    // Implement notification read logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 flex items-center">
                  <Pill className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">PharmPortal</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                  )}
                </button>
                {showNotifications && (
                  <NotificationsDropdown
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onMarkAsRead={handleMarkAsRead}
                  />
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">User menu</span>
                  <User className="h-6 w-6" />
                </button>
                {showUserMenu && (
                  <UserMenu onClose={() => setShowUserMenu(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <PharmacySidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}