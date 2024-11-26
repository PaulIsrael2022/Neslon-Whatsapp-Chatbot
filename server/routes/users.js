import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import User from '../models/User.js';
import Pharmacy from '../models/Pharmacy.js';
import Clinic from '../models/Clinic.js';

const router = express.Router();

// Get all users with filtering
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const users = await User.find(query)
      .populate('pharmacy')
      .populate('clinic')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Create new user with optional pharmacy/clinic creation
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { pharmacyData, clinicData, ...userData } = req.body;
    let pharmacy, clinic;

    // Create pharmacy if data provided
    if (pharmacyData && ['pharmacyStaff', 'pharmacyAdmin'].includes(userData.role)) {
      if (pharmacyData._id) {
        pharmacy = await Pharmacy.findById(pharmacyData._id);
        if (!pharmacy) {
          throw new Error('Pharmacy not found');
        }
      } else {
        pharmacy = await Pharmacy.create(pharmacyData);
      }
      userData.pharmacy = pharmacy._id;
    }

    // Create clinic if data provided
    if (clinicData && userData.role === 'doctor') {
      if (clinicData._id) {
        clinic = await Clinic.findById(clinicData._id);
        if (!clinic) {
          throw new Error('Clinic not found');
        }
      } else {
        clinic = await Clinic.create(clinicData);
      }
      userData.clinic = clinic._id;
    }

    const user = new User(userData);
    await user.save();

    // Populate references
    await user.populate('pharmacy');
    await user.populate('clinic');

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Update user
router.patch('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { pharmacyData, clinicData, ...userData } = req.body;
    let pharmacy, clinic;

    // Update or create pharmacy
    if (pharmacyData && ['pharmacyStaff', 'pharmacyAdmin'].includes(userData.role)) {
      if (pharmacyData._id) {
        pharmacy = await Pharmacy.findByIdAndUpdate(
          pharmacyData._id,
          pharmacyData,
          { new: true }
        );
      } else {
        pharmacy = await Pharmacy.create(pharmacyData);
      }
      userData.pharmacy = pharmacy._id;
    }

    // Update or create clinic
    if (clinicData && userData.role === 'doctor') {
      if (clinicData._id) {
        clinic = await Clinic.findByIdAndUpdate(
          clinicData._id,
          clinicData,
          { new: true }
        );
      } else {
        clinic = await Clinic.create(clinicData);
      }
      userData.clinic = clinic._id;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      userData,
      { new: true }
    ).populate('pharmacy').populate('clinic');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// Delete user
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

export default router;