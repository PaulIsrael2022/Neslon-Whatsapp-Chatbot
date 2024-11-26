import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-9xl font-bold text-red-600">500</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Server Error</h2>
        <p className="mt-2 text-base text-gray-600">
          Oops! Something went wrong on our end. Please try again later.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}