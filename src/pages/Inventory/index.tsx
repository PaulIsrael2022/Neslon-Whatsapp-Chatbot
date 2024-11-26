import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import InventoryList from './InventoryList';
import InventoryFilters from './InventoryFilters';
import InventoryModal from './InventoryModal';
import { inventory } from '../../services/api';
import type { Medication } from '../../types';

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Medication | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadInventory();
  }, [filters]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await inventory.list(filters);
      setMedications(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = (medication: Medication | null) => {
    setSelectedItem(medication);
    setIsModalOpen(true);
  };

  const handleSave = async (medicationData: Partial<Medication>) => {
    try {
      if (selectedItem) {
        await inventory.update(selectedItem._id, medicationData);
        toast.success('Medication updated successfully');
      } else {
        await inventory.create(medicationData);
        toast.success('Medication added successfully');
      }
      setIsModalOpen(false);
      loadInventory();
    } catch (error) {
      console.error('Error saving medication:', error);
      toast.error('Failed to save medication');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      await inventory.delete(id);
      toast.success('Medication deleted successfully');
      loadInventory();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Failed to delete medication');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Inventory Management
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => handleAddEdit(null)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </button>
        </div>
      </div>

      <InventoryFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="mt-8">
        <InventoryList
          medications={medications}
          onEdit={handleAddEdit}
          loading={loading}
          filters={filters}
        />
      </div>

      {isModalOpen && (
        <InventoryModal
          medication={selectedItem}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}