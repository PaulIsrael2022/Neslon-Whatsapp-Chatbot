import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, CreditCard, MapPin, Bell, Package } from 'lucide-react';
import type { User as UserType, Order } from '../../types';
import { orders, images } from '../../services/api';
import { toast } from 'react-hot-toast';
import DebugImage from '../../components/common/DebugImage';
import NotificationForm from './components/NotificationForm';

interface PatientDetailsProps {
  patient: UserType;
  onClose: () => void;
  onEdit: () => void;
}

export default function PatientDetails({ patient, onClose, onEdit }: PatientDetailsProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [patientOrders, setPatientOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && patient._id) {
      loadPatientOrders();
    }
  }, [activeTab, patient._id]);

  const loadPatientOrders = async () => {
    try {
      setLoading(true);
      const response = await orders.list({ userId: patient._id });
      setPatientOrders(response.data);
    } catch (error) {
      console.error('Error loading patient orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Details</h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { id: 'details', name: 'Details' },
              { id: 'documents', name: 'Documents' },
              { id: 'notifications', name: 'Notifications' },
              { id: 'orders', name: 'Orders' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {patient.firstName} {patient.middleName} {patient.surname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Type</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.memberType || 'N/A'}</p>
                  </div>
                  {patient.dateOfBirth && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.gender || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Medical Aid Information */}
              <div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-500">Medical Aid Information</h4>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Provider</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.medicalAidProvider || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Number</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.medicalAidNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Scheme</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.scheme || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{patient.phoneNumber}</p>
                  </div>
                  {patient.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{patient.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Medical Aid Card Images</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Front</p>
                  <DebugImage
                    src={images.getMedicalAidCard(patient._id, 'front')}
                    alt="Medical Aid Card Front"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Back</p>
                  <DebugImage
                    src={images.getMedicalAidCard(patient._id, 'back')}
                    alt="Medical Aid Card Back"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Send Notification or Set Reminder</h4>
              <NotificationForm patientId={patient._id} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Order History</h4>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : patientOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This patient hasn't placed any orders yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Order Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {patientOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[order.status]
                            }`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.orderType.replace(/_/g, ' ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}