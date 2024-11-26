import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  onClose: () => void;
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleUserSettingsClick = () => {
    navigate('/user-settings');
    onClose();
  };

  const handleSystemSettingsClick = () => {
    navigate('/settings');
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <div className="px-4 py-2 text-sm text-gray-700 border-b">
          <div className="font-medium">{user?.firstName} {user?.surname}</div>
          <div className="text-gray-500">{user?.email}</div>
        </div>
        
        <button
          onClick={handleUserSettingsClick}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Account Settings
          </div>
        </button>

        {(user?.role === 'admin' || user?.role === 'pharmacyAdmin') && (
          <button
            onClick={handleSystemSettingsClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </div>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <div className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </div>
        </button>
      </div>
    </div>
  );
}