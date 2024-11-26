import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import {
  getPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy
} from '../controllers/pharmacyController.js';

const router = express.Router();

// Get all pharmacies with filtering
router.get('/', authenticateJWT, getPharmacies);

// Get pharmacy by ID
router.get('/:id', authenticateJWT, getPharmacyById);

// Create new pharmacy (admin only)
router.post('/', authenticateJWT, authorizeRoles('admin'), createPharmacy);

// Update pharmacy (admin only)
router.patch('/:id', authenticateJWT, authorizeRoles('admin'), updatePharmacy);

// Delete pharmacy (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deletePharmacy);

export default router;