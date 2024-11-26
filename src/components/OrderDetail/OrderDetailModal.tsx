import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, Clock, MapPin, AlertTriangle, CreditCard, User, FileText, Download, Send, History, Phone } from 'lucide-react';
import type { Order, OrderStatus, StatusUpdate } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { orders, pharmacies, images, users } from '../../services/api';
import { toast } from 'react-hot-toast';
import DebugImage from '../common/DebugImage';
import InvoiceModal from './InvoiceModal';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: OrderStatus, note?: string) => void;
  onAssignOrder: (userId: string) => void;
  onAssignPharmacy: (pharmacyId: string) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  onAssignOrder,
  onAssignPharmacy,
}: OrderDetailModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availablePharmacies, setAvailablePharmacies] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [prescriptionImageUrls, setPrescriptionImageUrls] = useState<string[]>([]);
  const [medicalAidCardUrls, setMedicalAidCardUrls] = useState({ front: '', back: '' });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    loadPharmacies();
    loadDrivers();
    loadImages();
    
    // Poll for order updates every 30 seconds
    const pollInterval = setInterval(pollOrderUpdates, 30000);
    
    return () => {
      clearInterval(pollInterval);
    };
  }, [order._id]);

  // Update local state when parent order prop changes
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  const pollOrderUpdates = async () => {
    try {
      const response = await orders.getById(order._id);
      if (response.data && response.data._id === currentOrder._id) {
        setCurrentOrder(response.data);
      }
    } catch (error) {
      console.error('Error polling order updates:', error);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await users.list({ role: 'deliveryOfficer', isActive: true });
      setAvailableDrivers(response.data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      toast.error('Failed to load delivery officers');
    }
  };

  const loadPharmacies = async () => {
    try {
      const response = await pharmacies.list({ isActive: true });
      setAvailablePharmacies(response.data);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    }
  };

  const loadImages = () => {
    // Load prescription images
    if (order.prescriptionImages?.length > 0) {
      console.log('Loading prescription images for order:', order._id);
      const urls = order.prescriptionImages.map((_, index) => {
        const url = images.getPrescriptionImage(order._id, index);
        console.log(`Generated prescription image URL ${index}:`, url);
        return url;
      });
      setPrescriptionImageUrls(urls);
    }

    // Load medical aid card images
    if (order.user?._id) {
      console.log('Loading medical aid card images for user:', order.user._id);
      const frontUrl = images.getMedicalAidCard(order.user._id, 'front');
      const backUrl = images.getMedicalAidCard(order.user._id, 'back');
      console.log('Generated medical aid card URLs:', { frontUrl, backUrl });
      setMedicalAidCardUrls({
        front: frontUrl,
        back: backUrl
      });
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setLoading(true);

      // Optimistically update UI
      setCurrentOrder(prev => ({
        ...prev,
        status: newStatus,
        statusUpdates: [
          {
            status: newStatus,
            note: statusNote,
            updatedBy: user,
            timestamp: new Date()
          },
          ...(prev.statusUpdates || [])
        ]
      }));

      // Update status with note
      await orders.updateStatus(currentOrder._id, {
        status: newStatus,
        note: statusNote
      });
      
      // Send notifications based on status change
      try {
        await sendStatusNotifications(newStatus);
      } catch (error) {
        console.warn('Failed to send notifications:', error);
      }
      
      setStatusNote('');
      toast.success('Order status updated successfully');
    } catch (error) {
      // Revert optimistic update on error
      setCurrentOrder(order);
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDeliveryOfficer = async (deliveryOfficerId: string) => {
    try {
      setLoading(true);
      await orders.assignDeliveryOfficer(currentOrder._id, deliveryOfficerId);
      toast.success('Delivery officer assigned successfully');
      pollOrderUpdates(); // Refresh order data
    } catch (error) {
      console.error('Error assigning delivery officer:', error);
      toast.error('Failed to assign delivery officer');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPharmacy = async (pharmacyId: string) => {
    try {
      setLoading(true);
      await orders.assignPharmacy(currentOrder._id, pharmacyId);
      toast.success('Pharmacy assigned successfully');
      pollOrderUpdates(); // Refresh order data
    } catch (error) {
      console.error('Error assigning pharmacy:', error);
      toast.error('Failed to assign pharmacy');
    } finally {
      setLoading(false);
    }
  };

  const canUpdateStatus = () => {
    return user?.role === 'admin' || user?.role === 'pharmacyStaff' || user?.role === 'deliveryOfficer';
  };

  const canAssignDeliveryOfficer = () => {
    return user?.role === 'admin' || user?.role === 'pharmacyStaff';
  };

  const canAssignPharmacy = () => {
    return user?.role === 'admin' || user?.role === 'pharmacyStaff';
  };

  const sendStatusNotifications = async (newStatus: OrderStatus) => {
    const statusMessages = {
      PROCESSING: 'Your order is now being processed',
      READY_FOR_PICKUP: 'Your order is ready for pickup',
      OUT_FOR_DELIVERY: 'Your order is out for delivery',
      DELIVERED: 'Your order has been delivered',
      COMPLETED: 'Your order is complete',
      CANCELLED: 'Your order has been cancelled'
    };

    const message = statusMessages[newStatus];
    if (message) {
      try {
        await orders.sendNotification(currentOrder._id, {
          type: 'WHATSAPP',
          message
        });
      } catch (error) {
        console.warn('Failed to send status notification:', error);
      }
    }
  };

  const handleInvoiceSubmit = async (invoiceData: { 
    invoiceNumber: string;
    items: Array<{ description: string; quantity: number; price: number }>;
  }) => {
    try {
      setLoading(true);
      // Here you would typically send this to your backend
      await orders.update(order._id, {
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceItems: invoiceData.items
      });
      
      // Format WhatsApp message
      const message = `Invoice ${invoiceData.invoiceNumber} for Order ${order.orderNumber}\n\n` +
        `Items:\n${invoiceData.items.map(item => 
          `${item.description}: ${item.quantity} x P${item.price} = P${(item.quantity * item.price).toFixed(2)}`
        ).join('\n')}\n\n` +
        `Total: P${invoiceData.items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)}`;

      // You would typically have an API endpoint for this
      // await sendWhatsAppMessage(order.user.phoneNumber, message);
      
      toast.success('Invoice generated and sent successfully');
      setShowInvoiceModal(false);
    } catch (error) {
      toast.error('Error generating invoice');
      console.error('Error generating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusHistory = () => {
    if (!showStatusHistory) return null;

    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Status History</h4>
        {currentOrder.statusUpdates?.map((update: StatusUpdate, index: number) => (
          <div key={index} className="mb-2 last:mb-0 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">{update.status.replace(/_/g, ' ')}</span>
              <span className="text-gray-500">
                {new Date(update.timestamp).toLocaleString()}
              </span>
            </div>
            {update.note && (
              <p className="text-gray-600 mt-1">{update.note}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
              {
                PENDING: 'bg-yellow-100 text-yellow-800',
                PROCESSING: 'bg-blue-100 text-blue-800',
                READY_FOR_PICKUP: 'bg-green-100 text-green-800',
                OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
                DELIVERED: 'bg-green-100 text-green-800',
                CANCELLED: 'bg-red-100 text-red-800',
                COMPLETED: 'bg-gray-100 text-gray-800'
              }[currentOrder.status]
            }`}>
              {currentOrder.status.replace(/_/g, ' ')}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">First Name</p>
                <p className="mt-1">{currentOrder.user?.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Middle Name</p>
                <p className="mt-1">{currentOrder.user?.middleName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Name</p>
                <p className="mt-1">{currentOrder.user?.surname}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="mt-1">
                  {currentOrder.user?.dateOfBirth 
                    ? new Date(currentOrder.user.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Medical Aid Provider</p>
                <p className="mt-1">{currentOrder.user?.medicalAidProvider || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Medical Aid Number</p>
                <p className="mt-1">{currentOrder.user?.medicalAidNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Scheme</p>
                <p className="mt-1">{currentOrder.user?.scheme || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order Number</p>
                <p className="mt-1">{currentOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Order</p>
                <p className="mt-1">{new Date(currentOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order Type</p>
                <p className="mt-1">{currentOrder.orderType.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Method</p>
                <p className="mt-1">{currentOrder.deliveryMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Schedule</p>
                <p className="mt-1">{currentOrder.deliverySchedule || 'Not scheduled'}</p>
              </div>
              {currentOrder.deliveryAddress && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p className="mt-1">{currentOrder.deliveryAddress.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Medications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medications</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {currentOrder.medications.map((medication, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{medication.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {medication.quantity}</p>
                    </div>
                    {medication.instructions && (
                      <p className="text-sm text-gray-500 max-w-md">
                        Instructions: {medication.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Generation */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Generation</h3>
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowInvoiceModal(true)}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Invoice
            </button>
          </div>

          {/* Prescription Images */}
          {prescriptionImageUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Prescription Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {prescriptionImageUrls.map((url, index) => (
                  <DebugImage
                    key={index}
                    src={url}
                    alt={`Prescription ${index + 1}`}
                    className="rounded-lg shadow-sm w-full h-auto"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Medical Aid Card Images */}
          {(medicalAidCardUrls.front || medicalAidCardUrls.back) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Aid Card Images</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Front</p>
                  <DebugImage
                    src={medicalAidCardUrls.front}
                    alt="Medical Aid Card Front"
                    className="rounded-lg shadow-sm w-full h-auto"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Back</p>
                  <DebugImage
                    src={medicalAidCardUrls.back}
                    alt="Medical Aid Card Back"
                    className="rounded-lg shadow-sm w-full h-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Order Management Section (Staff Only) */}
          {(user?.role === 'pharmacyStaff' || user?.role === 'admin') && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Management</h3>
              <div className="grid grid-cols-1 gap-4">
                {canUpdateStatus() && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Update Status
                    </label>
                    <div className="flex space-x-4">
                      <select
                        value={currentOrder.status}
                        onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={loading}
                      >
                        {[
                          'PENDING',
                          'PROCESSING',
                          'READY_FOR_PICKUP',
                          'OUT_FOR_DELIVERY',
                          'DELIVERED',
                          'COMPLETED',
                          'CANCELLED'
                        ].map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="Add a note (optional)"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      />
                    </div>
                  </div>
                )}

                {canAssignDeliveryOfficer() && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Assign Delivery Officer
                    </label>
                    <select
                      value={currentOrder.AssignedDeliveryOfficer || ''}
                      onChange={(e) => handleAssignDeliveryOfficer(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      disabled={loading}
                    >
                      <option value="">Select Delivery Officer</option>
                      {availableDrivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.firstName} {driver.surname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {canAssignPharmacy() && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Assign Pharmacy
                    </label>
                    <select
                      value={currentOrder.assignedPharmacy || ''}
                      onChange={(e) => handleAssignPharmacy(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      disabled={loading}
                    >
                      <option value="">Select Pharmacy</option>
                      {availablePharmacies.map((pharmacy) => (
                        <option key={pharmacy._id} value={pharmacy._id}>
                          {pharmacy.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-4 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => window.open(`tel:${currentOrder.user?.phoneNumber}`)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Special Notes */}
          {currentOrder.extraNotes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Special Notes From Client</h3>
              <p className="text-gray-700">{currentOrder.extraNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          onClose={() => setShowInvoiceModal(false)}
          onSubmit={handleInvoiceSubmit}
          orderNumber={order.orderNumber}
        />
      )}
    </div>
  );
}