import React from 'react';
import { Clock, User, Calendar, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AppointmentListProps {
  filters: {
    search: string;
    status: string;
    date: string;
  };
  onAppointmentClick: (appointment: any) => void;
}

export default function AppointmentList({ filters, onAppointmentClick }: AppointmentListProps) {
  // Mock appointments - replace with actual data
  const appointments = [
    {
      id: '1',
      patientName: 'John Doe',
      date: '2024-03-15',
      time: '09:30',
      reason: 'Consultation',
      status: 'PENDING',
      notes: 'Regular checkup'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      date: '2024-03-15',
      time: '10:30',
      reason: 'Follow-up',
      status: 'APPROVED',
      notes: 'Review test results'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      // Replace with your API call
      console.log('Updating status:', appointmentId, newStatus);
      // await updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || appointment.status === filters.status;
    const matchesDate = !filters.date || appointment.date === filters.date;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => (
            <tr 
              key={appointment.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onAppointmentClick(appointment)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  {appointment.date}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  {appointment.time}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{appointment.reason}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(appointment.status)
                }`}>
                  {appointment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">{appointment.notes}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(appointment);
                    }}
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  {appointment.status === 'PENDING' && (
                    <>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleStatusChange(appointment.id, 'APPROVED')}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleStatusChange(appointment.id, 'REJECTED')}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}