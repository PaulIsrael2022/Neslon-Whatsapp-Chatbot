import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import {
  getDeliveryZones,
  getDeliveryZoneById,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone
} from '../controllers/deliveryZoneController.js';

const router = express.Router();

// Get all delivery zones with filtering
router.get('/', authenticateJWT, getDeliveryZones);

// Get delivery zone by ID
router.get('/:id', authenticateJWT, getDeliveryZoneById);

// Create new delivery zone
router.post('/', 
  authenticateJWT, 
  authorizeRoles('admin', 'deliveryCoordinator'), 
  createDeliveryZone
);

// Update delivery zone
router.patch('/:id', 
  authenticateJWT, 
  authorizeRoles('admin', 'deliveryCoordinator'), 
  updateDeliveryZone
);

// Delete delivery zone
router.delete('/:id', 
  authenticateJWT, 
  authorizeRoles('admin', 'deliveryCoordinator'), 
  deleteDeliveryZone
);

export default router;