import React, { useState } from 'react';
import { Plus, FileText, DollarSign, Users } from 'lucide-react';
import AccountingTabs from './AccountingTabs';
import InvoiceList from './InvoiceList';
import ExpenseList from './ExpenseList';
import SalaryList from './SalaryList';
import CreateInvoiceModal from './CreateInvoiceModal';
import CreateQuotationModal from './CreateQuotationModal';
import CreateExpenseModal from './CreateExpenseModal';
import CreateSalaryModal from './CreateSalaryModal';

type TabType = 'invoices' | 'expenses' | 'salaries';
type ModalType = 'invoice' | 'quotation' | 'expense' | 'salary' | null;

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const renderActionButtons = () => {
    switch (activeTab) {
      case 'invoices':
        return (
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveModal('quotation')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </button>
            <button
              onClick={() => setActiveModal('invoice')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </button>
          </div>
        );
      case 'expenses':
        return (
          <button
            onClick={() => setActiveModal('expense')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        );
      case 'salaries':
        return (
          <button
            onClick={() => setActiveModal('salary')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Salary Record
          </button>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'invoices':
        return <InvoiceList />;
      case 'expenses':
        return <ExpenseList />;
      case 'salaries':
        return <SalaryList />;
      default:
        return null;
    }
  };

  const renderModal = () => {
    switch (activeModal) {
      case 'invoice':
        return <CreateInvoiceModal onClose={() => setActiveModal(null)} />;
      case 'quotation':
        return <CreateQuotationModal onClose={() => setActiveModal(null)} />;
      case 'expense':
        return <CreateExpenseModal onClose={() => setActiveModal(null)} />;
      case 'salary':
        return <CreateSalaryModal onClose={() => setActiveModal(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Accounting
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {renderActionButtons()}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <AccountingTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {renderModal()}
    </div>
  );
}