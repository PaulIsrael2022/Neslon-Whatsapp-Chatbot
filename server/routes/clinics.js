import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import {
  getClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic
} from '../controllers/clinicController.js';

const router = express.Router();

// Get all clinics with filtering
router.get('/', authenticateJWT, getClinics);

// Get clinic by ID
router.get('/:id', authenticateJWT, getClinicById);

// Create new clinic (admin only)
router.post('/', authenticateJWT, authorizeRoles('admin'), createClinic);

// Update clinic (admin only)
router.patch('/:id', authenticateJWT, authorizeRoles('admin'), updateClinic);

// Delete clinic (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteClinic);

export default router;