import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import PatientFilters from './PatientFilters';
import PatientModal from './PatientModal';
import { patients } from '../../services/api';
import type { User } from '../../types';

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [patientsList, setPatientsList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    memberType: '',
    status: ''
  });

  useEffect(() => {
    loadPatients();
  }, [filters]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patients.list(filters);
      setPatientsList(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const handleEditPatient = (patient: User) => {
    setEditingPatient(patient);
    setShowModal(true);
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await patients.delete(patientId);
      toast.success('Patient deleted successfully');
      loadPatients();
      if (selectedPatient?._id === patientId) {
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  const handleSavePatient = async (patientData: Partial<User>) => {
    try {
      if (editingPatient) {
        await patients.update(editingPatient._id, patientData);
        toast.success('Patient updated successfully');
      } else {
        await patients.create(patientData);
        toast.success('Patient added successfully');
      }
      setShowModal(false);
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Failed to save patient');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Patients
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleAddPatient}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Patient
          </button>
        </div>
      </div>

      <PatientFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <PatientList 
            patients={patientsList}
            loading={loading}
            onPatientSelect={setSelectedPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        </div>
        {selectedPatient && (
          <div className="lg:w-1/3">
            <PatientDetails 
              patient={selectedPatient} 
              onClose={() => setSelectedPatient(null)}
              onEdit={() => handleEditPatient(selectedPatient)}
            />
          </div>
        )}
      </div>

      {showModal && (
        <PatientModal
          patient={editingPatient}
          onClose={() => setShowModal(false)}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
}