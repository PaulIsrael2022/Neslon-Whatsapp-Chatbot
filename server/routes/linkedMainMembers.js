import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import LinkedMainMember from '../models/LinkedMainMember.js';

const router = express.Router();

// Get all linked main members with filtering and pagination
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'lastName',
      search,
      medicalAidNumber
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { medicalAidNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (medicalAidNumber) {
      query.medicalAidNumber = medicalAidNumber;
    }

    const members = await LinkedMainMember.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await LinkedMainMember.countDocuments(query);

    res.json({
      success: true,
      data: members,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching linked main members',
      error: error.message
    });
  }
});

// Get linked main member by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const member = await LinkedMainMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Linked main member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching linked main member',
      error: error.message
    });
  }
});

// Create new linked main member
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const member = new LinkedMainMember(req.body);
    await member.save();

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating linked main member',
      error: error.message
    });
  }
});

// Update linked main member
router.patch('/:id', authenticateJWT, async (req, res) => {
  try {
    const member = await LinkedMainMember.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Linked main member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating linked main member',
      error: error.message
    });
  }
});

// Delete linked main member (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const member = await LinkedMainMember.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Linked main member not found'
      });
    }

    res.json({
      success: true,
      message: 'Linked main member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting linked main member',
      error: error.message
    });
  }
});

export default router;