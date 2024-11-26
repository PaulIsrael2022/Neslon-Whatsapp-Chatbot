import React, { useState } from 'react';
import { Download, Filter, FileText, DollarSign } from 'lucide-react';
import ReportsList from './ReportsList';
import ReportsFilters from './ReportsFilters';
import DocumentPreviewModal from './DocumentPreviewModal';

export default function ReportsPage() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: '',
    search: ''
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reports & Accounting
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Reports
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Summary
          </button>
        </div>
      </div>

      <ReportsFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="mt-8">
        <ReportsList onDocumentSelect={setSelectedDocument} filters={filters} />
      </div>

      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}