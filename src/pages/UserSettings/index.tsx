import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PharmacySettings from './PharmacySettings';
import DeliverySettings from './DeliverySettings';
import CustomerSettings from './CustomerSettings';
import ClinicSettings from './ClinicSettings';
import DoctorSettings from './DoctorSettings';
import BaseSettings from './BaseSettings';

export default function UserSettings() {
  const { user } = useAuth();

  const renderSettingsComponent = () => {
    switch (user?.role) {
      case 'pharmacyAdmin':
      case 'pharmacyStaff':
        return <PharmacySettings />;
      case 'deliveryOfficer':
      case 'deliveryCoordinator':
        return <DeliverySettings />;
      case 'customer':
        return <CustomerSettings />;
      case 'clinic':
        return <ClinicSettings />;
      case 'doctor':
        return <DoctorSettings />;
      default:
        return <BaseSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>
        {renderSettingsComponent()}
      </div>
    </div>
  );
}