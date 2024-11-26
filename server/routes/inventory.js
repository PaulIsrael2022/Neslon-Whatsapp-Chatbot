import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import Medication from '../models/Medication.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

const router = express.Router();

// Get all medications with filtering and pagination
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type,
      status,
      pharmacy,
      sort = 'name'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) query.type = type;
    if (status) query.status = status;
    if (pharmacy) query.pharmacy = pharmacy;

    // If user is pharmacy staff, only show their pharmacy's inventory
    if (req.user.role === 'pharmacyStaff' && req.user.pharmacy) {
      query.pharmacy = req.user.pharmacy;
    }

    const medications = await Medication.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('pharmacy', 'name')
      .populate('createdBy', 'firstName surname')
      .populate('updatedBy', 'firstName surname');

    const total = await Medication.countDocuments(query);

    res.json({
      success: true,
      data: medications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medications',
      error: error.message
    });
  }
});

// Get medication by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .populate('pharmacy', 'name')
      .populate('createdBy', 'firstName surname')
      .populate('updatedBy', 'firstName surname');

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medication',
      error: error.message
    });
  }
});

// Create new medication
router.post('/', authenticateJWT, authorizeRoles('admin', 'pharmacyStaff'), async (req, res) => {
  try {
    const medication = new Medication({
      ...req.body,
      createdBy: req.user._id,
      pharmacy: req.user.role === 'pharmacyStaff' ? req.user.pharmacy : req.body.pharmacy
    });

    await medication.save();

    // Create initial inventory transaction
    if (medication.quantity > 0) {
      const transaction = new InventoryTransaction({
        medication: medication._id,
        type: 'RESTOCK',
        quantity: medication.quantity,
        previousQuantity: 0,
        newQuantity: medication.quantity,
        reason: 'Initial stock',
        performedBy: req.user._id,
        pharmacy: medication.pharmacy
      });

      await transaction.save();
    }

    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating medication',
      error: error.message
    });
  }
});

// Update medication
router.patch('/:id', authenticateJWT, authorizeRoles('admin', 'pharmacyStaff'), async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Check if user has permission to update this medication
    if (req.user.role === 'pharmacyStaff' && medication.pharmacy.toString() !== req.user.pharmacy.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this medication'
      });
    }

    const oldQuantity = medication.quantity;
    const newQuantity = req.body.quantity !== undefined ? req.body.quantity : oldQuantity;

    // Update medication
    const updatedMedication = await Medication.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    );

    // Create inventory transaction if quantity changed
    if (newQuantity !== oldQuantity) {
      const transaction = new InventoryTransaction({
        medication: medication._id,
        type: 'ADJUSTMENT',
        quantity: newQuantity - oldQuantity,
        previousQuantity: oldQuantity,
        newQuantity: newQuantity,
        reason: req.body.adjustmentReason || 'Manual adjustment',
        performedBy: req.user._id,
        pharmacy: medication.pharmacy
      });

      await transaction.save();
    }

    res.json({
      success: true,
      data: updatedMedication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating medication',
      error: error.message
    });
  }
});

// Delete medication
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Create final transaction record before deletion
    const transaction = new InventoryTransaction({
      medication: medication._id,
      type: 'ADJUSTMENT',
      quantity: -medication.quantity,
      previousQuantity: medication.quantity,
      newQuantity: 0,
      reason: 'Medication deleted from system',
      performedBy: req.user._id,
      pharmacy: medication.pharmacy
    });

    await transaction.save();
    await medication.deleteOne();

    res.json({
      success: true,
      message: 'Medication deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting medication',
      error: error.message
    });
  }
});

// Get inventory transactions for a medication
router.get('/:id/transactions', authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const transactions = await InventoryTransaction.find({
      medication: req.params.id
    })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('performedBy', 'firstName surname')
      .populate('order', 'orderNumber');

    const total = await InventoryTransaction.countDocuments({
      medication: req.params.id
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

export default router;