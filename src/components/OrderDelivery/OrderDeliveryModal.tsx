import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Search, MapPin, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderDeliveryModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function OrderDeliveryModal({ onClose, onSubmit }: OrderDeliveryModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientDetails: {
      phoneNumber: '',
      email: '',
      age: '',
      gender: 'MALE',
      address: '',
      medicalHistory: ''
    },
    type: 'NEW_PRESCRIPTION',
    medications: [{ name: '', quantity: 1, instructions: '' }],
    notes: '',
    deliveryMethod: 'DELIVERY',
    deliveryAddress: {
      type: 'HOME',
      address: ''
    },
    deliverySchedule: '',
    specialInstructions: '',
    isEmergencyDelivery: false,
    prescriptionImage: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', quantity: 1, instructions: '' }]
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const renderOrderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
          <div className="mt-1">
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter patient name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1">
            <input
              type="tel"
              value={formData.patientDetails.phoneNumber}
              onChange={(e) => setFormData({
                ...formData,
                patientDetails: { ...formData.patientDetails, phoneNumber: e.target.value }
              })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1">
            <input
              type="email"
              value={formData.patientDetails.email}
              onChange={(e) => setFormData({
                ...formData,
                patientDetails: { ...formData.patientDetails, email: e.target.value }
              })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <div className="mt-1">
            <input
              type="number"
              value={formData.patientDetails.age}
              onChange={(e) => setFormData({
                ...formData,
                patientDetails: { ...formData.patientDetails, age: e.target.value }
              })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter age"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="mt-1">
            <select
              value={formData.patientDetails.gender}
              onChange={(e) => setFormData({
                ...formData,
                patientDetails: { ...formData.patientDetails, gender: e.target.value }
              })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1">
            <textarea
              value={formData.patientDetails.address}
              onChange={(e) => setFormData({
                ...formData,
                patientDetails: { ...formData.patientDetails, address: e.target.value }
              })}
              rows={2}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter patient address"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Medical History</label>
          <div className="mt-1">
            <textarea
              value={formData.patientDetails.medicalHistory}
              onChange={(e) => setFormData({
                ...formData,
                patientDetails: { ...formData.patientDetails, medicalHistory: e.target.value }
              })}
              rows={3}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter relevant medical history, allergies, or ongoing conditions"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Order Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="NEW_PRESCRIPTION">New Prescription</option>
            <option value="PRESCRIPTION_REFILL">Prescription Refill</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Medications</label>
            <button
              type="button"
              onClick={addMedication}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Medication
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.medications.map((med, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    className="block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Medication name"
                    required
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={med.quantity}
                    onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value))}
                    className="block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Qty"
                    min="1"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    className="block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Instructions"
                    required
                  />
                </div>
                {formData.medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Add any additional notes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Prescription</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="prescription-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input
                    id="prescription-upload"
                    name="prescription-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, prescriptionImage: file });
                      }
                    }}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              {formData.prescriptionImage && (
                <p className="text-sm text-gray-500">
                  Selected file: {formData.prescriptionImage.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Delivery Method</label>
        <select
          value={formData.deliveryMethod}
          onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          required
        >
          <option value="DELIVERY">Home Delivery</option>
          <option value="PICKUP">Pharmacy Pickup</option>
        </select>
      </div>

      {formData.deliveryMethod === 'DELIVERY' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address Type</label>
            <select
              value={formData.deliveryAddress.type}
              onChange={(e) => setFormData({
                ...formData,
                deliveryAddress: { ...formData.deliveryAddress, type: e.target.value }
              })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.deliveryAddress.address}
                onChange={(e) => setFormData({
                  ...formData,
                  deliveryAddress: { ...formData.deliveryAddress, address: e.target.value }
                })}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter delivery address"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Schedule</label>
            <select
              value={formData.deliverySchedule}
              onChange={(e) => setFormData({ ...formData, deliverySchedule: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select time slot</option>
              <option value="9:30 AM - 11:00 AM">9:30 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
              <option value="1:30 PM - 3:00 PM">1:30 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:30 PM">3:00 PM - 4:30 PM</option>
              <option value="4:30 PM - 6:00 PM">4:30 PM - 6:00 PM</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="emergency"
              checked={formData.isEmergencyDelivery}
              onChange={(e) => setFormData({ ...formData, isEmergencyDelivery: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="emergency" className="ml-2 block text-sm text-gray-900">
              This is an emergency delivery
            </label>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
        <textarea
          value={formData.specialInstructions}
          onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
          rows={3}
          className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Add any special delivery instructions..."
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4 relative">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">New Order Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
            {step === 1 ? renderOrderDetails() : renderDeliveryDetails()}
          </div>
          
          <div className="p-4 border-t border-gray-200 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Back
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Order'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}