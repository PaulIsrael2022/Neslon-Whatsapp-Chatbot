import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import NotificationsDropdown from './Header/NotificationsDropdown';
import { toast } from 'react-hot-toast';

// Mock notifications - replace with actual data from your backend
const mockNotifications = [
  {
    id: '1',
    title: 'New Order',
    message: 'Order #123 has been placed',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    title: 'Delivery Update',
    message: 'Order #120 has been delivered',
    time: '1 hour ago',
    read: true
  }
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(mockNotifications);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleSettingsClick = () => {
    navigate('/settings');
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
                  <span className="sr-only">Open sidebar</span>
                  <Menu className="h-6 w-6" />
                </button>
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
              <button
                onClick={handleSettingsClick}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Open settings</span>
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Log out</span>
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}