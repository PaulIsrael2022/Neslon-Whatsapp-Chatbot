import React from 'react';
import { Edit2, Trash2, MapPin, Phone, Mail, Users, CheckCircle, XCircle } from 'lucide-react';
import type { Clinic } from '../../types';
import Pagination from '../../components/Pagination';

interface ClinicListProps {
  clinics: Clinic[];
  onEdit: (clinic: Clinic) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  pagination: {
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

export default function ClinicList({
  clinics,
  onEdit,
  onDelete,
  loading,
  pagination,
  onPageChange
}: ClinicListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No clinics found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new clinic.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clinic Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctors
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clinics.map((clinic) => (
              <tr key={clinic._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {clinic.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {clinic.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-1" />
                      {clinic.phoneNumber}
                    </div>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-1" />
                      {clinic.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {clinic.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-1.5" />
                    )}
                    <span className={`text-sm ${clinic.isActive ? 'text-green-800' : 'text-red-800'}`}>
                      {clinic.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {clinic.isPartner ? 'Partner Clinic' : 'Non-Partner'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-900">
                      {clinic.doctors?.length || 0} Doctors
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(clinic)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(clinic._id)}
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

      {pagination.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}