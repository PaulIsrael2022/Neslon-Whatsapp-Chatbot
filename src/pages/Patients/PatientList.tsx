import React from 'react';
import { User, Phone, Mail, Calendar, Edit2, Trash2 } from 'lucide-react';
import type { User as UserType } from '../../types';

interface PatientListProps {
  patients: UserType[];
  loading: boolean;
  onPatientSelect: (patient: UserType) => void;
  onEditPatient: (patient: UserType) => void;
  onDeletePatient: (patientId: string) => void;
}

export default function PatientList({ 
  patients, 
  loading, 
  onPatientSelect, 
  onEditPatient, 
  onDeletePatient 
}: PatientListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <li key={patient._id}>
            <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.firstName} {patient.surname}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.memberType || 'No member type'}
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {patient.phoneNumber}
                    </div>
                    {patient.email && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {patient.email}
                      </div>
                    )}
                  </div>
                  {patient.medicalAidNumber && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      Medical Aid: {patient.medicalAidNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                <button
                  onClick={() => onEditPatient(patient)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeletePatient(patient._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}