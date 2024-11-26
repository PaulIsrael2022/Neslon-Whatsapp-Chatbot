import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Get prescription image for an order
router.get('/orders/:id/prescription-image/:index', authenticateJWT, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const imageIndex = parseInt(req.params.index);
    
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= order.prescriptionImages.length) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const image = order.prescriptionImages[imageIndex];
    
    if (!image || !image.data) {
      return res.status(404).json({ message: 'Image data not found' });
    }

    // Set cache control headers
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.set('Content-Type', image.contentType);
    res.send(image.data);

  } catch (error) {
    console.error('Error fetching prescription image:', error);
    res.status(500).json({ 
      message: 'Error fetching prescription image',
      error: error.message 
    });
  }
});

// Get medical aid card image (front or back)
router.get('/users/:userId/medical-aid-card/:side', authenticateJWT, async (req, res) => {
  try {
    const { userId, side } = req.params;

    if (side !== 'front' && side !== 'back') {
      return res.status(400).json({ 
        message: "Invalid side specified. Use 'front' or 'back'." 
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const image = side === 'front' ? user.medicalAidCardFront : user.medicalAidCardBack;

    if (!image || !image.data) {
      return res.status(404).json({ 
        message: `Medical aid card ${side} image not found` 
      });
    }

    // Set cache control headers
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.set('Content-Type', image.contentType);
    res.send(image.data);

  } catch (error) {
    console.error(`Error fetching medical aid card ${req.params.side} image:`, error);
    res.status(500).json({
      message: 'Error fetching medical aid card image',
      error: error.message
    });
  }
});

export default router;