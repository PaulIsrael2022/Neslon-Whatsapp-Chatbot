import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Package, 
  MessageSquare, 
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DoctorSidebarProps {
  isOpen: boolean;
}

export default function DoctorSidebar({ isOpen }: DoctorSidebarProps) {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Orders', icon: Package, path: '/doctor/orders' },
    { name: 'Support', icon: MessageSquare, path: '/doctor/support' },
    { name: 'Settings', icon: Settings, path: '/doctor/settings' }
  ];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:flex-shrink-0`}>
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow h-screen bg-white border-r border-gray-200">
          {/* Profile Section */}
          <div className="flex items-center px-4 py-6 border-b border-gray-200">
            <div className="flex-shrink-0">
              {user?.photoURL ? (
                <img
                  className="h-12 w-12 rounded-full"
                  src={user.photoURL}
                  alt={user.name || 'User'}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                Dr. {user?.firstName} {user?.surname}
              </p>
              <p className="text-xs text-gray-500">{user?.specialization || 'Specialist'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    location.pathname === item.path
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}