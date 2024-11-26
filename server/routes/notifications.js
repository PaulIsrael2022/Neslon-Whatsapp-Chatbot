import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import NotificationService from '../services/NotificationService.js';

const router = express.Router();

// Create a new notification
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const notification = await NotificationService.createNotification({
      ...req.body,
      sender: req.user._id
    });

    // If it's an immediate notification, send it right away
    if (!req.body.scheduledFor || new Date(req.body.scheduledFor) <= new Date()) {
      await NotificationService.sendNotification(notification);
    }

    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
});

// Get notifications with filters
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status,
      userId: req.query.userId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const notifications = await NotificationService.getNotifications(filters);
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Get notification by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('recipients.user', 'name email phoneNumber');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message
    });
  }
});

// Update notification
router.patch('/:id', authenticateJWT, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['message', 'subject', 'scheduledFor', 'priority', 'tags'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        notification[key] = req.body[key];
      }
    });

    await notification.save();
    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

// Delete notification
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

export default router;