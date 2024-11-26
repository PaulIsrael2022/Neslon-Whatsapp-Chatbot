import cron from 'node-cron';
import NotificationService from '../services/NotificationService.js';

// Schedule job to run every minute
const scheduleNotificationJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Running notification scheduler job...');
    try {
      await NotificationService.processScheduledNotifications();
    } catch (error) {
      console.error('Error in notification scheduler job:', error);
    }
  });
};

export default scheduleNotificationJob;