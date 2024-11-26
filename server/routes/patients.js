import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all patients (users with role 'customer')
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { search, memberType, status } = req.query;
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { medicalAidNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (memberType) {
      query.memberType = memberType;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const patients = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
});

// Get patient by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      role: 'customer'
    }).select('-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
});

// Create new patient
router.post('/', authenticateJWT, authorizeRoles('admin', 'pharmacyStaff'), async (req, res) => {
  try {
    const newPatient = new User({
      ...req.body,
      role: 'customer',
      isActive: true,
      isRegistrationComplete: true
    });

    await newPatient.save();

    // Remove password from response
    newPatient.password = undefined;

    res.status(201).json({
      success: true,
      data: newPatient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      error: error.message
    });
  }
});

// Update patient
router.patch('/:id', authenticateJWT, authorizeRoles('admin', 'pharmacyStaff'), async (req, res) => {
  try {
    const patient = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'customer' },
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
});

// Delete patient
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const patient = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'customer'
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
      error: error.message
    });
  }
});

export default router;