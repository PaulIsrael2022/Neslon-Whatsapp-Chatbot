import React from 'react';
import { X, Download, Printer } from 'lucide-react';

interface DocumentPreviewModalProps {
  document: any;
  onClose: () => void;
}

export default function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {document.type === 'INVOICE' ? 'Invoice' : 'Quotation'} Preview
          </h2>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-500"
              onClick={() => window.print()}
            >
              <Printer className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Download className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Document Header */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {document.type === 'INVOICE' ? 'Invoice' : 'Quotation'}
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-gray-500">From</p>
                <p className="font-medium">Your Pharmacy Name</p>
                <p>123 Pharmacy Street</p>
                <p>City, State 12345</p>
                <p>Phone: (123) 456-7890</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Document Details</p>
                <p><span className="font-medium">Number:</span> {document.number}</p>
                <p><span className="font-medium">Date:</span> {document.date}</p>
                <p><span className="font-medium">Order Ref:</span> {document.orderNumber}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <p className="text-gray-500">Bill To</p>
            <p className="font-medium">{document.customer}</p>
            <p>Customer Address Line 1</p>
            <p>Customer Address Line 2</p>
          </div>

          {/* Items Table */}
          <table className="min-w-full divide-y divide-gray-200 mb-8">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Medication Name
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  1
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  R500.00
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  R500.00
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t pt-8">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Subtotal:</span>
                  <span>R{document.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">VAT (15%):</span>
                  <span>R{(document.amount * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    R{(document.amount * 1.15).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Notes */}
          <div className="mt-8 text-sm text-gray-500">
            <p className="font-medium text-gray-700">Terms & Conditions</p>
            <p>Payment is due within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}