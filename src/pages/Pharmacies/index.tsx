import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PharmacyList from './PharmacyList';
import PharmacyFilters from './PharmacyFilters';
import PharmacyModal from './PharmacyModal';
import { pharmacies } from '../../services/api';
import type { Pharmacy } from '../../types';

export default function PharmaciesPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [pharmaciesList, setPharmaciesList] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    isPartner: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadPharmacies();
  }, [filters]);

  const loadPharmacies = async () => {
    try {
      console.log('🔄 Loading pharmacies with filters:', filters);
      setLoading(true);
      const response = await pharmacies.list(filters);
      console.log('📥 Pharmacies response:', response);
      setPharmaciesList(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('❌ Error loading pharmacies:', error);
      toast.error('Failed to load pharmacies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = (pharmacy: Pharmacy | null) => {
    console.log('🖊️ Opening pharmacy modal for:', pharmacy?.name || 'new pharmacy');
    setSelectedPharmacy(pharmacy);
    setShowModal(true);
  };

  const handleSave = async (pharmacyData: Partial<Pharmacy>) => {
    try {
      console.log('💾 Saving pharmacy data:', pharmacyData);
      if (selectedPharmacy) {
        await pharmacies.update(selectedPharmacy._id, pharmacyData);
        toast.success('Pharmacy updated successfully');
      } else {
        await pharmacies.create(pharmacyData);
        toast.success('Pharmacy added successfully');
      }
      setShowModal(false);
      loadPharmacies();
    } catch (error) {
      console.error('❌ Error saving pharmacy:', error);
      toast.error('Failed to save pharmacy');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pharmacy?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting pharmacy:', id);
      await pharmacies.delete(id);
      toast.success('Pharmacy deleted successfully');
      loadPharmacies();
    } catch (error) {
      console.error('❌ Error deleting pharmacy:', error);
      toast.error('Failed to delete pharmacy');
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
            Pharmacies Management
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => handleAddEdit(null)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pharmacy
          </button>
        </div>
      </div>

      <PharmacyFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="mt-8">
        <PharmacyList
          pharmacies={pharmaciesList}
          onEdit={handleAddEdit}
          onDelete={handleDelete}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {showModal && (
        <PharmacyModal
          pharmacy={selectedPharmacy}
          onClose={() => {
            setShowModal(false);
            setSelectedPharmacy(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}