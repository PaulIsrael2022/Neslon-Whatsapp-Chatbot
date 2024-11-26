import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import type { User, Pharmacy, Clinic } from '../../types';

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  pharmacies: Pharmacy[];
  clinics: Clinic[];
}

export default function UserModal({ user, onClose, onSave, pharmacies, clinics }: UserModalProps) {
  const initialAddressesState = {
    home: [{ address: '', isSaved: false }],
    work: [{ address: '', isSaved: false }]
  };

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    password: '',
    role: 'customer',
    phoneNumber: '',
    isActive: true,
    pharmacy: '',
    clinic: '',
    dateOfBirth: '',
    gender: '',
    memberType: '',
    medicalAidProvider: '',
    medicalAidNumber: '',
    scheme: '',
    addresses: initialAddressesState,
    preferences: {
      notificationPreference: 'WhatsApp',
      language: 'English'
    },
    medicalAidCardFront: null as File | null,
    medicalAidCardBack: null as File | null
  });

  useEffect(() => {
    if (user) {
      // Ensure addresses have the correct structure
      const addresses = {
        home: user.addresses?.home?.length ? user.addresses.home : [{ address: '', isSaved: false }],
        work: user.addresses?.work?.length ? user.addresses.work : [{ address: '', isSaved: false }]
      };

      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        surname: user.surname || '',
        email: user.email || '',
        password: '',
        role: user.role || 'customer',
        phoneNumber: user.phoneNumber || '',
        isActive: user.isActive ?? true,
        pharmacy: user.pharmacy?._id || '',
        clinic: user.clinic?._id || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        memberType: user.memberType || '',
        medicalAidProvider: user.medicalAidProvider || '',
        medicalAidNumber: user.medicalAidNumber || '',
        scheme: user.scheme || '',
        addresses: addresses,
        preferences: user.preferences || {
          notificationPreference: 'WhatsApp',
          language: 'English'
        },
        medicalAidCardFront: null,
        medicalAidCardBack: null
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { ...formData };
    
    // Only include password if it's a new user or password is being changed
    if (!userData.password) {
      delete userData.password;
    }

    // Only include relevant linking fields based on role
    if (!['pharmacyStaff', 'pharmacyAdmin'].includes(userData.role)) {
      delete userData.pharmacy;
    }
    if (userData.role !== 'doctor') {
      delete userData.clinic;
    }

    // Convert medical aid card files to base64 if they exist
    if (formData.medicalAidCardFront) {
      userData.medicalAidCardFront = await fileToBase64(formData.medicalAidCardFront);
    }
    if (formData.medicalAidCardBack) {
      userData.medicalAidCardBack = await fileToBase64(formData.medicalAidCardBack);
    }

    onSave(userData);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'medicalAidCardFront' | 'medicalAidCardBack') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const showMedicalAidFields = formData.role === 'customer';
  const showPharmacyField = ['pharmacyStaff', 'pharmacyAdmin'].includes(formData.role);
  const showClinicField = formData.role === 'doctor';

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="pharmacyStaff">Pharmacy Staff</option>
                <option value="pharmacyAdmin">Pharmacy Admin</option>
                <option value="doctor">Doctor</option>
                <option value="deliveryOfficer">Delivery Officer</option>
                <option value="deliveryCoordinator">Delivery Coordinator</option>
              </select>
            </div>

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
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {showPharmacyField && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Linked Pharmacy</label>
                <select
                  value={formData.pharmacy}
                  onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Pharmacy</option>
                  {pharmacies.map((pharmacy) => (
                    <option key={pharmacy._id} value={pharmacy._id}>
                      {pharmacy.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showClinicField && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Linked Clinic</label>
                <select
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic._id} value={clinic._id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
                {...(!user && { required: true })}
              />
            </div>

            {showMedicalAidFields && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Type</label>
                  <select
                    value={formData.memberType}
                    onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
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

                <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Home Address</label>
                  <input
                    type="text"
                    value={formData.addresses.home[0].address}
                    onChange={(e) => setFormData({
                      ...formData,
                      addresses: {
                        ...formData.addresses,
                        home: [{ address: e.target.value, isSaved: true }]
                      }
                    })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Work Address</label>
                  <input
                    type="text"
                    value={formData.addresses.work[0].address}
                    onChange={(e) => setFormData({
                      ...formData,
                      addresses: {
                        ...formData.addresses,
                        work: [{ address: e.target.value, isSaved: true }]
                      }
                    })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Aid Card (Front)</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'medicalAidCardFront')}
                      className="sr-only"
                      id="medicalAidCardFront"
                    />
                    <label
                      htmlFor="medicalAidCardFront"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Front
                    </label>
                    {formData.medicalAidCardFront && (
                      <span className="ml-2 text-sm text-gray-500">
                        {formData.medicalAidCardFront.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Aid Card (Back)</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'medicalAidCardBack')}
                      className="sr-only"
                      id="medicalAidCardBack"
                    />
                    <label
                      htmlFor="medicalAidCardBack"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Back
                    </label>
                    {formData.medicalAidCardBack && (
                      <span className="ml-2 text-sm text-gray-500">
                        {formData.medicalAidCardBack.name}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  User is active
                </label>
              </div>
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
              {user ? 'Update' : 'Add'} User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}