import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User } from '../../types';

interface PatientModalProps {
  patient: User | null;
  onClose: () => void;
  onSave: (patientData: Partial<User>) => void;
}

export default function PatientModal({ patient, onClose, onSave }: PatientModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    memberType: '',
    medicalAidProvider: '',
    medicalAidNumber: '',
    scheme: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || '',
        middleName: patient.middleName || '',
        surname: patient.surname || '',
        email: patient.email || '',
        phoneNumber: patient.phoneNumber || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        memberType: patient.memberType || '',
        medicalAidProvider: patient.medicalAidProvider || '',
        medicalAidNumber: patient.medicalAidNumber || '',
        scheme: patient.scheme || ''
      });
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      role: 'customer'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Surname</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Member Type</label>
              <select
                value={formData.memberType}
                onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select member type</option>
                <option value="Principal Member">Principal Member</option>
                <option value="Dependent">Dependent</option>
                <option value="PrivateClient">Private Client</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Medical Aid Provider</label>
              <input
                type="text"
                value={formData.medicalAidProvider}
                onChange={(e) => setFormData({ ...formData, medicalAidProvider: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Medical Aid Number</label>
              <input
                type="text"
                value={formData.medicalAidNumber}
                onChange={(e) => setFormData({ ...formData, medicalAidNumber: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Scheme</label>
              <input
                type="text"
                value={formData.scheme}
                onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {patient ? 'Update' : 'Add'} Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}