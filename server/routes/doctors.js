import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// Get all doctors with filtering and pagination
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      specialization,
      clinic,
      isActive,
      sort = 'name'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (specialization) query.specialization = specialization;
    if (clinic) query.clinic = clinic;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const doctors = await Doctor.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('clinic', 'name address')
      .populate('services', 'name category');

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
});

// Get doctor by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('clinic', 'name address phoneNumber email')
      .populate('services', 'name description category price');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
});

// Create new doctor (admin only)
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();

    res.status(201).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message
    });
  }
});

// Update doctor (admin only)
router.patch('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('clinic', 'name address')
      .populate('services', 'name category');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
});

// Delete doctor (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: error.message
    });
  }
});

// Add service to doctor
router.post('/:id/services', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const { serviceId } = req.body;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required'
      });
    }

    if (doctor.services.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        message: 'Service is already assigned to this doctor'
      });
    }

    doctor.services.push(serviceId);
    await doctor.save();

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error adding service to doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding service to doctor',
      error: error.message
    });
  }
});

// Remove service from doctor
router.delete('/:id/services/:serviceId', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const serviceIndex = doctor.services.indexOf(req.params.serviceId);
    
    if (serviceIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Service is not assigned to this doctor'
      });
    }

    doctor.services.splice(serviceIndex, 1);
    await doctor.save();

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error removing service from doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing service from doctor',
      error: error.message
    });
  }
});

// Add review for doctor
router.post('/:id/reviews', authenticateJWT, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid rating between 1 and 5 is required'
      });
    }

    doctor.reviews.push({
      user: req.user._id,
      rating,
      comment,
      date: new Date()
    });

    // Update average rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    doctor.rating = totalRating / doctor.reviews.length;

    await doctor.save();

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

// Update doctor availability
router.patch('/:id/availability', authenticateJWT, authorizeRoles('admin', 'doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Only allow doctors to update their own availability
    if (req.user.role === 'doctor' && req.user._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this doctor\'s availability'
      });
    }

    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Availability must be an array'
      });
    }

    doctor.availability = availability;
    await doctor.save();

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
});

export default router;