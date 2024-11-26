import React from 'react';
import { Eye, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ReportsListProps {
  onDocumentSelect: (document: any) => void;
  filters: {
    type: string;
    status: string;
    dateRange: string;
    search: string;
  };
}

export default function ReportsList({ onDocumentSelect, filters }: ReportsListProps) {
  // Mock data - replace with actual API call
  const documents = [
    {
      id: '1',
      type: 'INVOICE',
      number: 'INV-2024-001',
      orderNumber: 'ORD-2024-001',
      customer: 'John Doe',
      date: '2024-03-10',
      amount: 1500.00,
      status: 'PAID',
    },
    {
      id: '2',
      type: 'QUOTATION',
      number: 'QUO-2024-001',
      orderNumber: 'ORD-2024-002',
      customer: 'Jane Smith',
      date: '2024-03-09',
      amount: 750.00,
      status: 'PENDING',
    },
  ];

  const statusColors = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    OVERDUE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Document
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
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
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {doc.type === 'INVOICE' ? 'Invoice' : 'Quotation'}
                    </div>
                    <div className="text-sm text-gray-500">{doc.number}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.orderNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {doc.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R{doc.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[doc.status]
                }`}>
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onDocumentSelect(doc)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}