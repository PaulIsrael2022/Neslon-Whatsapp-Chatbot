import React from 'react';
import { DollarSign, FileText, Tag } from 'lucide-react';

export default function ExpenseList() {
  // Mock data - replace with actual API call
  const expenses = [
    {
      id: '1',
      description: 'Office Supplies',
      category: 'SUPPLIES',
      date: '2024-03-10',
      amount: 250.00,
      status: 'PAID',
      reference: 'EXP-2024-001'
    },
    {
      id: '2',
      description: 'Utility Bills',
      category: 'UTILITIES',
      date: '2024-03-09',
      amount: 1200.00,
      status: 'PENDING',
      reference: 'EXP-2024-002'
    }
  ];

  const statusColors = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    OVERDUE: 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    SUPPLIES: 'bg-blue-100 text-blue-800',
    UTILITIES: 'bg-purple-100 text-purple-800',
    MAINTENANCE: 'bg-orange-100 text-orange-800',
    OTHER: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{expense.reference}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {expense.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  categoryColors[expense.category]
                }`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {expense.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R{expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[expense.status]
                }`}>
                  {expense.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}