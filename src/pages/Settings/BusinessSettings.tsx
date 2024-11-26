import React, { useState, useEffect } from 'react';
import { Building2, Clock, CreditCard, Phone } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function BusinessSettings() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    businessInfo: {
      name: '',
      registrationNumber: '',
      vatNumber: '',
      taxNumber: '',
      address: '',
      phone: '',
      email: ''
    },
    bankingInfo: {
      bankName: '',
      accountNumber: '',
      branchCode: '',
      swiftCode: ''
    },
    invoiceSettings: {
      autoGenerate: true,
      autoSend: true,
      prefix: 'INV',
      nextNumber: 1
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        businessInfo: settings.businessInfo || formData.businessInfo,
        bankingInfo: settings.bankingInfo || formData.bankingInfo,
        invoiceSettings: settings.invoiceSettings || formData.invoiceSettings
      });
    }
  }, [settings]);

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [name]: value
      }
    }));
  };

  const handleBankingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankingInfo: {
        ...prev.bankingInfo,
        [name]: value
      }
    }));
  };

  const handleInvoiceSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      invoiceSettings: {
        ...prev.invoiceSettings,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = async () => {
    await updateSettings('business', formData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Business Information</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              name="name"
              id="businessName"
              value={formData.businessInfo.name}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              id="registrationNumber"
              value={formData.businessInfo.registrationNumber}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Business Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.businessInfo.address}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.businessInfo.phone}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.businessInfo.email}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Tax Information</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
              VAT Number
            </label>
            <input
              type="text"
              name="vatNumber"
              id="vatNumber"
              value={formData.businessInfo.vatNumber}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700">
              Tax Number
            </label>
            <input
              type="text"
              name="taxNumber"
              id="taxNumber"
              value={formData.businessInfo.taxNumber}
              onChange={handleBusinessInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Banking Information</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              id="bankName"
              value={formData.bankingInfo.bankName}
              onChange={handleBankingInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              value={formData.bankingInfo.accountNumber}
              onChange={handleBankingInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700">
              Branch Code
            </label>
            <input
              type="text"
              name="branchCode"
              id="branchCode"
              value={formData.bankingInfo.branchCode}
              onChange={handleBankingInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">
              SWIFT Code
            </label>
            <input
              type="text"
              name="swiftCode"
              id="swiftCode"
              value={formData.bankingInfo.swiftCode}
              onChange={handleBankingInfoChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Invoice Settings</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="autoInvoice"
                name="autoGenerate"
                type="checkbox"
                checked={formData.invoiceSettings.autoGenerate}
                onChange={handleInvoiceSettingChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="autoInvoice" className="font-medium text-gray-700">
                Automatic Invoice Generation
              </label>
              <p className="text-gray-500 text-sm">
                Automatically generate invoices when orders are completed
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="autoSend"
                name="autoSend"
                type="checkbox"
                checked={formData.invoiceSettings.autoSend}
                onChange={handleInvoiceSettingChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="autoSend" className="font-medium text-gray-700">
                Automatic Invoice Sending
              </label>
              <p className="text-gray-500 text-sm">
                Automatically send invoices to customers via WhatsApp or email
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">
              Invoice Prefix
            </label>
            <input
              type="text"
              name="prefix"
              id="prefix"
              value={formData.invoiceSettings.prefix}
              onChange={handleInvoiceSettingChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="nextNumber" className="block text-sm font-medium text-gray-700">
              Next Invoice Number
            </label>
            <input
              type="number"
              name="nextNumber"
              id="nextNumber"
              value={formData.invoiceSettings.nextNumber}
              onChange={handleInvoiceSettingChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={handleSubmit}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}