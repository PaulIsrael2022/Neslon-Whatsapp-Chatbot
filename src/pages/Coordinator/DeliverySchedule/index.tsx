import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ScheduledDelivery {
  id: string;
  orderNumber: string;
  timeSlot: string;
  date: string;
  officer: {
    name: string;
    id: string;
  };
  zone: string;
  customer: {
    name: string;
    address: string;
  };
}

export default function DeliverySchedule() {
  const [schedules, setSchedules] = useState<ScheduledDelivery[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedZone, setSelectedZone] = useState('all');

  useEffect(() => {
    // TODO: Load schedules from API
    const mockSchedules: ScheduledDelivery[] = [
      {
        id: '1',
        orderNumber: 'DEL-001',
        timeSlot: '09:00 - 10:00',
        date: '2023-12-01',
        officer: {
          name: 'John Smith',
          id: 'OFF-001'
        },
        zone: 'Zone A',
        customer: {
          name: 'Alice Johnson',
          address: '456 Oak St, City'
        }
      },
      // Add more mock data as needed
    ];
    setSchedules(mockSchedules);
  }, [selectedDate, selectedZone]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Delivery Schedule</h1>
        <div className="flex space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>
          <button
            onClick={() => toast.success('Coming soon!')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Schedule
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {new Date(schedule.date).toLocaleDateString()}
                    </span>
                    <Clock className="ml-4 h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">
                      {schedule.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {schedule.zone}
                    </span>
                  </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="font-medium">{schedule.officer.name}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {schedule.customer.address}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span className="font-medium text-indigo-600">
                      {schedule.orderNumber}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
