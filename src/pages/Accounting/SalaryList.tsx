import React from 'react';
import { Users, Calendar, DollarSign } from 'lucide-react';

export default function SalaryList() {
  // Mock data - replace with actual API call
  const salaries = [
    {
      id: '1',
      employee: 'John Smith',
      position: 'Pharmacist',
      month: 'March 2024',
      baseSalary: 25000.00,
      overtime: 1500.00,
      deductions: 2000.00,
      netSalary: 24500.00,
      status: 'PAID'
    },
    {
      id: '2',
      employee: 'Jane Doe',
      position: 'Delivery Officer',
      month: 'March 2024',
      baseSalary: 15000.00,
      overtime: 800.00,
      deductions: 1200.00,
      netSalary: 14600.00,
      status: 'PENDING'
    }
  ];

  const statusColors = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Base Salary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Overtime
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deductions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Salary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {salaries.map((salary) => (
            <tr key={salary.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {salary.employee}
                    </div>
                    <div className="text-sm text-gray-500">{salary.position}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {salary.month}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R{salary.baseSalary.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R{salary.overtime.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R{salary.deductions.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R{salary.netSalary.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[salary.status]
                }`}>
                  {salary.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}