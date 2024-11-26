import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  updateDeliveryLocation,
  addDeliveryFeedback
} from '../controllers/deliveryController.js';

const router = express.Router();

// Get all deliveries with filtering
router.get('/', authenticateJWT, getDeliveries);

// Get delivery by ID
router.get('/:id', authenticateJWT, getDeliveryById);

// Create new delivery
router.post('/', 
  authenticateJWT, 
  authorizeRoles('admin', 'deliveryCoordinator'), 
  createDelivery
);

// Update delivery
router.patch('/:id', 
  authenticateJWT, 
  authorizeRoles('admin', 'deliveryCoordinator', 'deliveryOfficer'), 
  updateDelivery
);

// Delete delivery
router.delete('/:id', 
  authenticateJWT, 
  authorizeRoles('admin', 'deliveryCoordinator'), 
  deleteDelivery
);

// Update delivery location
router.post('/:id/location', 
  authenticateJWT, 
  authorizeRoles('deliveryOfficer'), 
  updateDeliveryLocation
);

// Add delivery feedback
router.post('/:id/feedback', 
  authenticateJWT, 
  addDeliveryFeedback
);

export default router;