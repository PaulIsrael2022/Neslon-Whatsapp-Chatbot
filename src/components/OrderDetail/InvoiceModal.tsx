import React, { useState } from 'react';
import { X, Plus, Trash, Send } from 'lucide-react';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceModalProps {
  onClose: () => void;
  onSubmit: (invoiceData: { 
    invoiceNumber: string;
    items: InvoiceItem[];
  }) => void;
  orderNumber: string;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose, onSubmit, orderNumber }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${orderNumber}`);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmit = () => {
    onSubmit({
      invoiceNumber,
      items
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Generate Invoice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-lg">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Price (P)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Total</label>
                  <div className="mt-2 text-sm">
                    P {(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="col-span-12 text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <div className="flex justify-end text-lg font-medium">
              Total: P {calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Invoice via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;