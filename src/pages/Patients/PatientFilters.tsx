import React from 'react';
import { Search } from 'lucide-react';

interface PatientFiltersProps {
  filters: {
    search: string;
    memberType: string;
    status: string;
  };
  onFilterChange: (filters: PatientFiltersProps['filters']) => void;
}

export default function PatientFilters({ filters, onFilterChange }: PatientFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Patients
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={filters.search}
              onChange={handleChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by name, number or email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="memberType" className="block text-sm font-medium text-gray-700">
            Member Type
          </label>
          <select
            id="memberType"
            name="memberType"
            value={filters.memberType}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            <option value="Principal Member">Principal Member</option>
            <option value="Dependent">Dependent</option>
            <option value="PrivateClient">Private Client</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Registration Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
}