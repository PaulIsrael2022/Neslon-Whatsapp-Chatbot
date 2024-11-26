import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import NotificationService from '../services/NotificationService.js';
import WebSocketService from '../services/WebSocketService.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all orders with filtering, pagination, and sorting
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status,
      orderType,
      orderCategory,
      startDate,
      endDate,
      search
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const userSearchQuery = {
        $or: [
          { firstName: searchRegex },
          { surname: searchRegex },
          { phoneNumber: searchRegex },
          { email: searchRegex }
        ]
      };

      const matchingUsers = await User.find(userSearchQuery).select('_id');
      const userIds = matchingUsers.map(user => user._id);

      query.$or = [
        { orderNumber: searchRegex },
        { 'medications.name': searchRegex },
        { user: { $in: userIds } }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Order type filter
    if (orderType) {
      query.orderType = orderType;
    }

    // Order category filter
    if (orderCategory) {
      query.orderCategory = orderCategory;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Role-based filtering
    if (req.user.role === 'pharmacyStaff') {
      query.assignedPharmacy = req.user.pharmacy;
    } else if (req.user.role === 'deliveryOfficer') {
      query.AssignedDeliveryOfficer = req.user._id;
    } else if (req.user.role === 'customer') {
      query.user = req.user._id;
    }

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [
        {
          path: 'user',
          select: 'firstName surname email phoneNumber medicalAidProvider medicalAidNumber scheme dateOfBirth middleName'
        },
        {
          path: 'AssignedDeliveryOfficer',
          select: 'firstName surname phoneNumber'
        },
        {
          path: 'assignedPharmacy',
          select: 'name address'
        },
        {
          path: 'statusUpdates.updatedBy',
          select: 'firstName surname role'
        }
      ],
      lean: true
    };

    const result = await Order.paginate(query, options);

    // Get category counts
    const categoryCounts = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$orderCategory',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      total: result.totalDocs,
      whatsappRequests: 0,
      pharmacyPickups: 0,
      customerPickups: 0
    };

    categoryCounts.forEach(({ _id, count }) => {
      switch (_id) {
        case 'WHATSAPP_REQUEST':
          counts.whatsappRequests = count;
          break;
        case 'PHARMACY_PICKUP':
          counts.pharmacyPickups = count;
          break;
        case 'CUSTOMER_PICKUP':
          counts.customerPickups = count;
          break;
      }
    });

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pages: result.totalPages
      },
      counts
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get a single order by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID provided'
      });
    }

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id)
      .populate('user', 'firstName surname email phoneNumber medicalAidProvider medicalAidNumber scheme dateOfBirth middleName')
      .populate('AssignedDeliveryOfficer', 'firstName surname phoneNumber')
      .populate('assignedPharmacy', 'name address')
      .populate('statusUpdates.updatedBy', 'firstName surname role');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Create new order
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      user: req.user._id
    });
    
    const savedOrder = await newOrder.save();
    
    // Emit real-time update for new order
    WebSocketService.emitOrderUpdate(savedOrder, 'created');
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', authenticateJWT, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Role-based permission check
    const allowedRoles = ['admin', 'pharmacyStaff', 'deliveryOfficer'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update order status'
      });
    }

    // Update status
    order.status = status;
    order.statusUpdates.push({
      status,
      note,
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    const updatedOrder = await order.save();

    // Emit real-time updates
    WebSocketService.emitStatusUpdate(order._id, status, req.user._id);
    WebSocketService.emitOrderUpdate(updatedOrder, 'updated');

    // Try to send notification, but don't fail if it fails
    try {
      await NotificationService.sendOrderStatusNotification(order, req.user._id);
    } catch (notificationError) {
      console.warn('Failed to send notification:', notificationError);
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Assign delivery officer
router.patch('/:id/assign-delivery', authenticateJWT, async (req, res) => {
  try {
    const { deliveryOfficerId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const deliveryOfficer = await User.findById(deliveryOfficerId);
    if (!deliveryOfficer || deliveryOfficer.role !== 'deliveryOfficer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery officer'
      });
    }

    order.AssignedDeliveryOfficer = deliveryOfficerId;
    const updatedOrder = await order.save();

    // Emit real-time update
    WebSocketService.emitOrderUpdate(updatedOrder, 'updated');

    // Try to send notification, but don't fail if it fails
    try {
      await NotificationService.sendDeliveryAssignmentNotification(order, deliveryOfficer, req.user._id);
    } catch (notificationError) {
      console.warn('Failed to send notification:', notificationError);
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error assigning delivery officer:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning delivery officer',
      error: error.message
    });
  }
});

// Assign pharmacy
router.patch('/:id/assign-pharmacy', authenticateJWT, async (req, res) => {
  try {
    const { pharmacyId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.assignedPharmacy = pharmacyId;
    const updatedOrder = await order.save();

    // Emit real-time update
    WebSocketService.emitOrderUpdate(updatedOrder, 'updated');

    // Try to send notification, but don't fail if it fails
    try {
      await NotificationService.sendPharmacyAssignmentNotification(order, req.user._id);
    } catch (notificationError) {
      console.warn('Failed to send notification:', notificationError);
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error assigning pharmacy:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning pharmacy',
      error: error.message
    });
  }
});

// Send custom notification
router.post('/:id/notifications', authenticateJWT, async (req, res) => {
  try {
    const { type, message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Role-based permission check
    const allowedRoles = ['admin', 'pharmacyStaff'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send notifications'
      });
    }

    // Try to send notification
    try {
      const notification = await NotificationService.sendCustomNotification(order, type, message, req.user._id);
      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending notification',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error processing notification request:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing notification request',
      error: error.message
    });
  }
});

// Get order statistics
router.get('/stats/overview', authenticateJWT, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'PROCESSING'] }, 1, 0] }
          },
          outForDelivery: {
            $sum: { $cond: [{ $eq: ['$status', 'OUT_FOR_DELIVERY'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] }
          },
          whatsappRequests: {
            $sum: { $cond: [{ $eq: ['$orderCategory', 'WHATSAPP_REQUEST'] }, 1, 0] }
          },
          pharmacyPickups: {
            $sum: { $cond: [{ $eq: ['$orderCategory', 'PHARMACY_PICKUP'] }, 1, 0] }
          },
          customerPickups: {
            $sum: { $cond: [{ $eq: ['$orderCategory', 'CUSTOMER_PICKUP'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        outForDelivery: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        whatsappRequests: 0,
        pharmacyPickups: 0,
        customerPickups: 0
      }
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
});

export default router;