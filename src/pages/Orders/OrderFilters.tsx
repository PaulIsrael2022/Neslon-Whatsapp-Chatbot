import React from 'react';
import { Search } from 'lucide-react';
import type { OrderFilters as OrderFiltersType } from '../../types';

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFilterChange: (filters: Partial<OrderFiltersType>) => void;
}

export default function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Orders
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
              placeholder="Search by order number, name or phone"
            />
          </div>
        </div>

        <div>
          <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
            Order Type
          </label>
          <select
            id="orderType"
            name="orderType"
            value={filters.orderType}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            <option value="PRESCRIPTION_REFILL">Prescription Refill</option>
            <option value="NEW_PRESCRIPTION">New Prescription</option>
            <option value="OVER_THE_COUNTER">Over The Counter</option>
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
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Date From
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      </div>
    </div>
  );
}