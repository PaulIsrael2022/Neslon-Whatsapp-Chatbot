import React from 'react';
import { Search } from 'lucide-react';

interface ChatFiltersProps {
  filters: {
    search: string;
    category: string;
    status: string;
    date: string;
  };
  onFilterChange: (filters: ChatFiltersProps['filters']) => void;
}

export default function ChatFilters({ filters, onFilterChange }: ChatFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="p-4 border-b space-y-4">
      <div>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search conversations..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            <option value="APPOINTMENT_REQUEST">Appointment</option>
            <option value="GENERAL_SUPPORT">General Support</option>
            <option value="PHARMACIST_CONSULTATION">Pharmacist</option>
            <option value="DOCTOR_CONSULTATION">Doctor</option>
          </select>
        </div>

        <div>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Status</option>
            <option value="UNREAD">Unread</option>
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
}