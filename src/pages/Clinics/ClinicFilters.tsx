import React from 'react';
import { Search } from 'lucide-react';

interface ClinicFiltersProps {
  filters: {
    search: string;
    isActive: string;
    isPartner: string;
    specialties: string[];
  };
  onFilterChange: (filters: ClinicFiltersProps['filters']) => void;
}

export default function ClinicFilters({ filters, onFilterChange }: ClinicFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Clinics
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
              placeholder="Search by name or address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="isActive"
            name="isActive"
            value={filters.isActive}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="isPartner" className="block text-sm font-medium text-gray-700">
            Partnership
          </label>
          <select
            id="isPartner"
            name="isPartner"
            value={filters.isPartner}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Clinics</option>
            <option value="true">Partner Clinics</option>
            <option value="false">Non-Partner Clinics</option>
          </select>
        </div>

        <div>
          <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
            Specialty
          </label>
          <select
            id="specialties"
            name="specialties"
            value={filters.specialties[0] || ''}
            onChange={(e) => onFilterChange({ ...filters, specialties: e.target.value ? [e.target.value] : [] })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Specialties</option>
            <option value="General">General</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>
      </div>
    </div>
  );
}