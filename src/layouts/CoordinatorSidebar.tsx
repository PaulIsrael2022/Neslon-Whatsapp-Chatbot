import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Truck, MapPin, Users, Clock, AlertTriangle, 
  BarChart2, Settings, MessageSquare 
} from 'lucide-react';

interface CoordinatorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    to: '/coordinator/dashboard',
    icon: BarChart2
  },
  {
    name: 'Active Deliveries',
    to: '/coordinator/deliveries/active',
    icon: Truck
  },
  {
    name: 'Delivery Zones',
    to: '/coordinator/zones',
    icon: MapPin
  },
  {
    name: 'Staff Management',
    to: '/coordinator/staff',
    icon: Users
  },
  {
    name: 'Schedule',
    to: '/coordinator/schedule',
    icon: Clock
  },
  {
    name: 'Issues',
    to: '/coordinator/issues',
    icon: AlertTriangle
  },
  {
    name: 'Communications',
    to: '/coordinator/communications',
    icon: MessageSquare
  },
  {
    name: 'Settings',
    to: '/coordinator/settings',
    icon: Settings
  }
];

export default function CoordinatorSidebar({ isOpen, onClose }: CoordinatorSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 transition-opacity bg-gray-500 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white border-r border-gray-200 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-indigo-600">
            <h2 className="text-xl font-semibold text-white">Coordinator Panel</h2>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
