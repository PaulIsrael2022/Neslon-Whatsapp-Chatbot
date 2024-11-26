import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, UserPlus, Settings } from 'lucide-react';
import UserModal from './UserModal';
import { users, pharmacies, clinics } from '../../services/api';
import { toast } from 'react-hot-toast';
import type { User, Pharmacy, Clinic } from '../../types';

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pharmaciesList, setPharmaciesList] = useState<Pharmacy[]>([]);
  const [clinicsList, setClinicsList] = useState<Clinic[]>([]);

  useEffect(() => {
    loadUsers();
    loadPharmacies();
    loadClinics();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await users.list({
        search: searchQuery,
        role: roleFilter
      });
      setUsersList(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadPharmacies = async () => {
    try {
      const response = await pharmacies.list({ isActive: true });
      setPharmaciesList(response.data);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    }
  };

  const loadClinics = async () => {
    try {
      const response = await clinics.list({ isActive: true });
      setClinicsList(response.data);
    } catch (error) {
      console.error('Error loading clinics:', error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await users.delete(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        await users.update(selectedUser._id, userData);
        toast.success('User updated successfully');
      } else {
        await users.create(userData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      pharmacyStaff: 'bg-blue-100 text-blue-800',
      pharmacyAdmin: 'bg-purple-100 text-purple-800',
      doctor: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800',
      deliveryOfficer: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getLinkedEntityName = (user: User) => {
    if (user.pharmacy) {
      return `Pharmacy: ${user.pharmacy.name}`;
    }
    if (user.clinic) {
      return `Clinic: ${user.clinic.name}`;
    }
    return '-';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search users..."
          />
        </div>
        <div className="flex space-x-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="pharmacyStaff">Pharmacy Staff</option>
            <option value="pharmacyAdmin">Pharmacy Admin</option>
            <option value="doctor">Doctor</option>
            <option value="deliveryOfficer">Delivery Officer</option>
            <option value="customer">Customer</option>
          </select>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linked To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersList.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.surname}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getLinkedEntityName(user)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          pharmacies={pharmaciesList}
          clinics={clinicsList}
        />
      )}
    </div>
  );
}