import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Clinic } from '../../types';

interface ClinicModalProps {
  clinic: Clinic | null;
  onClose: () => void;
  onSave: (clinicData: Partial<Clinic>) => void;
}

export default function ClinicModal({ clinic, onClose, onSave }: ClinicModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
    isActive: true,
    isPartner: false,
    specialties: [''],
    facilities: [''],
    openingHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { open: '', close: '' }
    },
    emergencyContact: {
      name: '',
      phone: '',
      email: ''
    },
    insurance: [{
      provider: '',
      planTypes: ['']
    }]
  });

  useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name || '',
        address: clinic.address || '',
        phoneNumber: clinic.phoneNumber || '',
        email: clinic.email || '',
        website: clinic.website || '',
        isActive: clinic.isActive ?? true,
        isPartner: clinic.isPartner ?? false,
        specialties: clinic.specialties?.length ? clinic.specialties : [''],
        facilities: clinic.facilities?.length ? clinic.facilities : [''],
        openingHours: clinic.openingHours || {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '09:00', close: '13:00' },
          sunday: { open: '', close: '' }
        },
        emergencyContact: clinic.emergencyContact || {
          name: '',
          phone: '',
          email: ''
        },
        insurance: clinic.insurance?.length ? clinic.insurance : [{
          provider: '',
          planTypes: ['']
        }]
      });
    }
  }, [clinic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values from arrays
    const cleanedData = {
      ...formData,
      specialties: formData.specialties.filter(s => s.trim()),
      facilities: formData.facilities.filter(f => f.trim()),
      insurance: formData.insurance.filter(i => i.provider.trim()).map(i => ({
        ...i,
        planTypes: i.planTypes.filter(p => p.trim())
      }))
    };

    onSave(cleanedData);
  };

  const addArrayItem = (field: 'specialties' | 'facilities') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field: 'specialties' | 'facilities', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addInsurance = () => {
    setFormData({
      ...formData,
      insurance: [...formData.insurance, { provider: '', planTypes: [''] }]
    });
  };

  const removeInsurance = (index: number) => {
    const newInsurance = formData.insurance.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      insurance: newInsurance
    });
  };

  const addPlanType = (insuranceIndex: number) => {
    const newInsurance = [...formData.insurance];
    newInsurance[insuranceIndex].planTypes.push('');
    setFormData({
      ...formData,
      insurance: newInsurance
    });
  };

  const removePlanType = (insuranceIndex: number, planIndex: number) => {
    const newInsurance = [...formData.insurance];
    newInsurance[insuranceIndex].planTypes = newInsurance[insuranceIndex].planTypes.filter((_, i) => i !== planIndex);
    setFormData({
      ...formData,
      insurance: newInsurance
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {clinic ? 'Edit Clinic' : 'Add New Clinic'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
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
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPartner}
                  onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Partner Clinic</span>
              </label>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Specialties</label>
              <button
                type="button"
                onClick={() => addArrayItem('specialties')}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add Specialty
              </button>
            </div>
            {formData.specialties.map((specialty, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => {
                    const newSpecialties = [...formData.specialties];
                    newSpecialties[index] = e.target.value;
                    setFormData({ ...formData, specialties: newSpecialties });
                  }}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formData.specialties.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('specialties', index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Facilities */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Facilities</label>
              <button
                type="button"
                onClick={() => addArrayItem('facilities')}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add Facility
              </button>
            </div>
            {formData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => {
                    const newFacilities = [...formData.facilities];
                    newFacilities[index] = e.target.value;
                    setFormData({ ...formData, facilities: newFacilities });
                  }}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formData.facilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('facilities', index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
            {Object.entries(formData.openingHours).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-3 gap-4 mb-2">
                <div className="text-sm font-medium text-gray-700 capitalize">{day}</div>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => setFormData({
                    ...formData,
                    openingHours: {
                      ...formData.openingHours,
                      [day]: { ...hours, open: e.target.value }
                    }
                  })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => setFormData({
                    ...formData,
                    openingHours: {
                      ...formData.openingHours,
                      [day]: { ...hours, close: e.target.value }
                    }
                  })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.emergencyContact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, email: e.target.value }
                })}
                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Insurance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Insurance Providers</label>
              <button
                type="button"
                onClick={addInsurance}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add Insurance Provider
              </button>
            </div>
            {formData.insurance.map((ins, insIndex) => (
              <div key={insIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    placeholder="Provider Name"
                    value={ins.provider}
                    onChange={(e) => {
                      const newInsurance = [...formData.insurance];
                      newInsurance[insIndex].provider = e.target.value;
                      setFormData({ ...formData, insurance: newInsurance });
                    }}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formData.insurance.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInsurance(insIndex)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-600">Plan Types</label>
                    <button
                      type="button"
                      onClick={() => addPlanType(insIndex)}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Add Plan Type
                    </button>
                  </div>
                  {ins.planTypes.map((plan, planIndex) => (
                    <div key={planIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={plan}
                        onChange={(e) => {
                          const newInsurance = [...formData.insurance];
                          newInsurance[insIndex].planTypes[planIndex] = e.target.value;
                          setFormData({ ...formData, insurance: newInsurance });
                        }}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {ins.planTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlanType(insIndex, planIndex)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
              {clinic ? 'Update' : 'Add'} Clinic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}