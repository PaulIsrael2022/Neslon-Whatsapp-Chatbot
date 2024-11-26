import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import {
  getSettings,
  updateSettings,
  updateSettingsSection,
  testEmailIntegration,
  testWhatsAppIntegration,
  triggerSync
} from '../controllers/settingsController.js';

const router = express.Router();

// Get all settings
router.get('/', authenticateJWT, getSettings);

// Update all settings (admin only)
router.patch('/', authenticateJWT, authorizeRoles('admin'), updateSettings);

// Update specific setting section (admin only)
router.patch('/:section', authenticateJWT, authorizeRoles('admin'), updateSettingsSection);

// Test email integration
router.post('/test-email', authenticateJWT, authorizeRoles('admin'), testEmailIntegration);

// Test WhatsApp integration
router.post('/test-whatsapp', authenticateJWT, authorizeRoles('admin'), testWhatsAppIntegration);

// Trigger manual sync
router.post('/sync', authenticateJWT, authorizeRoles('admin'), triggerSync);

export default router;