import React from 'react';
import { FileText, DollarSign, Users } from 'lucide-react';

interface AccountingTabsProps {
  activeTab: string;
  onTabChange: (tab: 'invoices' | 'expenses' | 'salaries') => void;
}

export default function AccountingTabs({ activeTab, onTabChange }: AccountingTabsProps) {
  const tabs = [
    { id: 'invoices', name: 'Invoices & Quotations', icon: FileText },
    { id: 'expenses', name: 'Expenses', icon: DollarSign },
    { id: 'salaries', name: 'Salaries', icon: Users }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as 'invoices' | 'expenses' | 'salaries')}
            className={`${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <tab.icon className="h-5 w-5 mr-2" />
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}