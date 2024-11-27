import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Truck, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CoordinatorSidebar from './CoordinatorSidebar';
import NotificationsDropdown from '../components/Header/NotificationsDropdown';
import UserMenu from '../components/Header/UserMenu';
import DeliveryStatusBadge from '../components/Coordinator/DeliveryStatusBadge';

export default function CoordinatorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active deliveries count - to be replaced with real-time data
  const [activeDeliveries, setActiveDeliveries] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 flex items-center">
                  <Truck className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    Delivery Coordinator
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <DeliveryStatusBadge count={activeDeliveries} />
              
              <div className="ml-4 relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Bell className="h-6 w-6" />
                </button>
                {showNotifications && (
                  <NotificationsDropdown
                    notifications={[]}
                    onClose={() => setShowNotifications(false)}
                    onMarkAsRead={() => {}}
                  />
                )}
              </div>

              <div className="ml-4 relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <User className="h-6 w-6" />
                </button>
                {showUserMenu && (
                  <UserMenu
                    user={user}
                    onClose={() => setShowUserMenu(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Container */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <CoordinatorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
