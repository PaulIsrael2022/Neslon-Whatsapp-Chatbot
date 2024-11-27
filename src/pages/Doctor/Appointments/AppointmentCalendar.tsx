import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AppointmentCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function AppointmentCalendar({ selectedDate, onDateSelect }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock appointments - replace with actual data
  const appointments = [
    { date: new Date(2024, 2, 15), count: 3 },
    { date: new Date(2024, 2, 16), count: 2 },
    { date: new Date(2024, 2, 20), count: 4 }
  ];

  const getAppointmentCount = (date: Date) => {
    const appointment = appointments.find(a => 
      a.date.getDate() === date.getDate() &&
      a.date.getMonth() === date.getMonth() &&
      a.date.getFullYear() === date.getFullYear()
    );
    return appointment?.count || 0;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-white min-h-[100px] p-2 ${
              day ? 'cursor-pointer hover:bg-gray-50' : ''
            } ${
              day && 
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth()
                ? 'ring-2 ring-indigo-600'
                : ''
            }`}
            onClick={() => day && onDateSelect(day)}
          >
            {day && (
              <>
                <p className={`text-sm ${
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth()
                    ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                    : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </p>
                {getAppointmentCount(day) > 0 && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {getAppointmentCount(day)} appts
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}