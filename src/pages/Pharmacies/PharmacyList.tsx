import React from 'react';
import { Edit2, Trash2, Building2, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { Pharmacy } from '../../types';
import Pagination from '../../components/Pagination';

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  onEdit: (pharmacy: Pharmacy) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  pagination: {
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

export default function PharmacyList({
  pharmacies,
  onEdit,
  onDelete,
  loading,
  pagination,
  onPageChange
}: PharmacyListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pharmacies found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new pharmacy.
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
                Pharmacy Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opening Hours
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pharmacies.map((pharmacy) => (
              <tr key={pharmacy._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pharmacy.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pharmacy.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-1" />
                      {pharmacy.phoneNumber}
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {pharmacy.address}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {pharmacy.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-1.5" />
                    )}
                    <span className={`text-sm ${pharmacy.isActive ? 'text-green-800' : 'text-red-800'}`}>
                      {pharmacy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {pharmacy.isPartner ? 'Partner Pharmacy' : 'Non-Partner'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {pharmacy.openingHours || 'Not specified'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(pharmacy)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(pharmacy._id)}
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