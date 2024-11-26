import React, { useState } from 'react';
import { Calendar, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { notifications } from '../../../services/api';

interface NotificationFormProps {
  patientId: string;
}

export default function NotificationForm({ patientId }: NotificationFormProps) {
  const [notificationText, setNotificationText] = useState('');
  const [notificationType, setNotificationType] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [reminderType, setReminderType] = useState('none');
  const [customDays, setCustomDays] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!notificationText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setLoading(true);

      let scheduledFor = new Date();
      if (reminderType !== 'none') {
        const days = reminderType === 'custom' ? parseInt(customDays) : parseInt(reminderType);
        if (isNaN(days)) {
          toast.error('Invalid number of days');
          return;
        }
        scheduledFor = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }

      const response = await notifications.create({
        type: notificationType,
        recipients: [patientId],
        message: notificationText,
        priority: 'MEDIUM',
        scheduledFor: scheduledFor.toISOString(),
        isRecurring: false
      });

      if (response.success) {
        toast.success(reminderType === 'none' ? 
          'Notification sent successfully' : 
          `Reminder scheduled for ${scheduledFor.toLocaleDateString()}`
        );
        setNotificationText('');
        setReminderType('none');
        setCustomDays('');
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notification Type
        </label>
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value as 'WHATSAPP' | 'EMAIL')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reminder Schedule
        </label>
        <select
          value={reminderType}
          onChange={(e) => setReminderType(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="none">Send Immediately</option>
          <option value="15">15 Days Reminder</option>
          <option value="30">30 Days Reminder</option>
          <option value="custom">Custom Days</option>
        </select>
      </div>

      {reminderType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Days
          </label>
          <input
            type="number"
            min="1"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter number of days"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          rows={4}
          value={notificationText}
          onChange={(e) => setNotificationText(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your message here..."
        />
      </div>

      <button
        onClick={handleSendNotification}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        {reminderType === 'none' ? 'Send Notification' : 'Schedule Reminder'}
      </button>
    </div>
  );
}