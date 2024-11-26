import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ClinicList from './ClinicList';
import ClinicFilters from './ClinicFilters';
import ClinicModal from './ClinicModal';
import { clinics } from '../../services/api';
import type { Clinic } from '../../types';

export default function ClinicsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinicsList, setClinicsList] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    isPartner: '',
    specialties: [],
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadClinics();
  }, [filters]);

  const loadClinics = async () => {
    try {
      console.log('🔄 Loading clinics with filters:', filters);
      setLoading(true);
      const response = await clinics.list(filters);
      console.log('📥 Clinics response:', response);
      setClinicsList(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('❌ Error loading clinics:', error);
      toast.error('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = (clinic: Clinic | null) => {
    console.log('🖊️ Opening clinic modal for:', clinic?.name || 'new clinic');
    setSelectedClinic(clinic);
    setShowModal(true);
  };

  const handleSave = async (clinicData: Partial<Clinic>) => {
    try {
      console.log('💾 Saving clinic data:', clinicData);
      if (selectedClinic) {
        await clinics.update(selectedClinic._id, clinicData);
        toast.success('Clinic updated successfully');
      } else {
        await clinics.create(clinicData);
        toast.success('Clinic added successfully');
      }
      setShowModal(false);
      loadClinics();
    } catch (error) {
      console.error('❌ Error saving clinic:', error);
      toast.error('Failed to save clinic');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting clinic:', id);
      await clinics.delete(id);
      toast.success('Clinic deleted successfully');
      loadClinics();
    } catch (error) {
      console.error('❌ Error deleting clinic:', error);
      toast.error('Failed to delete clinic');
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    console.log('🔍 Updating filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    console.log('📄 Changing page to:', newPage);
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Clinics Management
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => handleAddEdit(null)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Clinic
          </button>
        </div>
      </div>

      <ClinicFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="mt-8">
        <ClinicList
          clinics={clinicsList}
          onEdit={handleAddEdit}
          onDelete={handleDelete}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {showModal && (
        <ClinicModal
          clinic={selectedClinic}
          onClose={() => {
            setShowModal(false);
            setSelectedClinic(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}