import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Pill, 
  Truck, 
  MessageSquare, 
  Settings, 
  FileText, 
  DollarSign,
  Package,
  Building2,
  Stethoscope,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getSettingsPath = (role: string) => {
  return role === 'admin' ? '/settings' : '/user-settings';
};

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { user } = useAuth();
  const role = user?.role || '';

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Orders', icon: Package, path: '/orders' },
    { name: 'Patients', icon: Users, path: '/patients' },
    { name: 'Inventory', icon: Pill, path: '/inventory' },
    { name: 'Deliveries', icon: Truck, path: '/deliveries' },
    { name: 'Support', icon: MessageSquare, path: '/support' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Accounting', icon: DollarSign, path: '/accounting' },
    { name: 'Pharmacies', icon: Building2, path: '/pharmacies' },
    { name: 'Clinics', icon: Stethoscope, path: '/clinics' },
    { name: 'Settings', icon: Settings, path: getSettingsPath(role) }
  ];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:flex-shrink-0`}>
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow h-screen bg-white border-r border-gray-200">
          {/* Logo/Branding Section */}
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-gray-50 border-b border-gray-200">
            <img
              src="/logo.png"
              alt="MedDelivery Logo"
              className="h-8 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <h1 className="text-xl font-bold text-gray-900 ml-2">MedDelivery</h1>
          </div>

          {/* Profile Snippet */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <div className="flex-shrink-0">
              {user?.photoURL ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.photoURL}
                  alt={user.name || 'User'}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User Name'}</p>
              <p className="text-xs text-gray-500 capitalize">{role || 'Role'}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-grow overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}