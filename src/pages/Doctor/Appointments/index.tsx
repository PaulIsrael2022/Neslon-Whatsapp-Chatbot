import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentList from './AppointmentList';
import AppointmentModal from './AppointmentModal';
import AppointmentEditModal from '../../../components/Appointment/AppointmentEditModal';
import AppointmentFilters from './AppointmentFilters';

export default function AppointmentsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date: ''
  });

  const handleEditSubmit = async (data: any) => {
    try {
      // Replace with your API call
      console.log('Updating appointment:', data);
      // await updateAppointment(data);
      setSelectedAppointment(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your patient appointments and schedule
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                view === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                view === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      <AppointmentFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white shadow rounded-lg">
        {view === 'calendar' ? (
          <AppointmentCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        ) : (
          <AppointmentList 
            filters={filters} 
            onAppointmentClick={setSelectedAppointment}
          />
        )}
      </div>

      {showModal && (
        <AppointmentModal
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
        />
      )}

      {selectedAppointment && (
        <AppointmentEditModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}