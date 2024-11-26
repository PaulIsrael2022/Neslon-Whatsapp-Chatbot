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
  Stethoscope
} from 'lucide-react';

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
  { name: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:flex-shrink-0`}>
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">MedDelivery</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
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