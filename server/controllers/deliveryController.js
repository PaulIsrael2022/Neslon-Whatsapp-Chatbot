import Delivery from '../models/Delivery.js';
import DeliveryZone from '../models/DeliveryZone.js';
import Order from '../models/Order.js';

export const getDeliveries = async (req, res) => {
  try {
    console.log('📡 GET /deliveries - Fetching deliveries...');
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status,
      startDate,
      endDate,
      zone,
      deliveryOfficer 
    } = req.query;

    const query = {};

    if (search) {
      const orderQuery = { orderNumber: { $regex: search, $options: 'i' } };
      const orders = await Order.find(orderQuery).select('_id');
      const orderIds = orders.map(order => order._id);
      
      query.$or = [
        { order: { $in: orderIds } },
        { 'deliveryAddress.address': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (zone) query.zone = zone;
    if (deliveryOfficer) query.deliveryOfficer = deliveryOfficer;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    console.log('🔍 Query:', query);

    const deliveries = await Delivery.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('order', 'orderNumber')
      .populate('deliveryOfficer', 'firstName surname phoneNumber')
      .populate('coordinator', 'firstName surname')
      .populate('zone', 'name');

    const total = await Delivery.countDocuments(query);

    console.log(`✅ Found ${deliveries.length} deliveries`);

    res.json({
      success: true,
      data: deliveries,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching deliveries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message
    });
  }
};

export const getDeliveryById = async (req, res) => {
  try {
    console.log(`📡 GET /deliveries/${req.params.id} - Fetching delivery...`);
    const delivery = await Delivery.findById(req.params.id)
      .populate('order')
      .populate('deliveryOfficer', 'firstName surname phoneNumber')
      .populate('coordinator', 'firstName surname')
      .populate('zone', 'name basePrice pricePerKm');

    if (!delivery) {
      console.log('❌ Delivery not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    console.log('✅ Found delivery for order:', delivery.order.orderNumber);
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('❌ Error fetching delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery',
      error: error.message
    });
  }
};

export const createDelivery = async (req, res) => {
  try {
    console.log('📡 POST /deliveries - Creating new delivery');
    console.log('📦 Request body:', req.body);

    // Validate zone and calculate price if needed
    if (req.body.zone && req.body.deliveryAddress?.coordinates) {
      const zone = await DeliveryZone.findById(req.body.zone);
      if (!zone) {
        throw new Error('Invalid delivery zone');
      }

      // Check if delivery address is within zone boundaries
      const isInZone = await zone.containsPoint(
        req.body.deliveryAddress.coordinates.lat,
        req.body.deliveryAddress.coordinates.lng
      );

      if (!isInZone) {
        throw new Error('Delivery address is outside the selected zone');
      }
    }

    const delivery = new Delivery(req.body);
    await delivery.save();

    // Update order status if needed
    if (delivery.order) {
      await Order.findByIdAndUpdate(delivery.order, {
        status: 'OUT_FOR_DELIVERY',
        AssignedDeliveryOfficer: delivery.deliveryOfficer
      });
    }

    console.log('✅ Delivery created:', delivery._id);
    res.status(201).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('❌ Error creating delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating delivery',
      error: error.message
    });
  }
};

export const updateDelivery = async (req, res) => {
  try {
    console.log(`📡 PATCH /deliveries/${req.params.id} - Updating delivery`);
    console.log('📦 Request body:', req.body);

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      console.log('❌ Delivery not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Handle status changes
    if (req.body.status && req.body.status !== delivery.status) {
      switch (req.body.status) {
        case 'DELIVERED':
          delivery.completionTime = new Date();
          delivery.actualArrival = new Date();
          delivery.deliveryAttempts.push({
            attemptTime: new Date(),
            status: 'SUCCESS',
            notes: 'Delivery completed successfully'
          });
          // Update order status
          await Order.findByIdAndUpdate(delivery.order, { status: 'COMPLETED' });
          break;

        case 'FAILED':
          delivery.deliveryAttempts.push({
            attemptTime: new Date(),
            status: 'FAILED',
            reason: req.body.failureReason || 'Delivery attempt failed',
            notes: req.body.notes
          });
          break;

        case 'IN_TRANSIT':
          if (!delivery.startTime) {
            delivery.startTime = new Date();
          }
          break;
      }
    }

    // Update fields
    Object.assign(delivery, req.body);
    await delivery.save();

    console.log('✅ Delivery updated:', delivery._id);
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('❌ Error updating delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating delivery',
      error: error.message
    });
  }
};

export const deleteDelivery = async (req, res) => {
  try {
    console.log(`📡 DELETE /deliveries/${req.params.id} - Deleting delivery`);
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      console.log('❌ Delivery not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Update associated order if needed
    if (delivery.order) {
      await Order.findByIdAndUpdate(delivery.order, {
        status: 'PENDING',
        AssignedDeliveryOfficer: null
      });
    }

    console.log('✅ Delivery deleted:', delivery._id);
    res.json({
      success: true,
      message: 'Delivery deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery',
      error: error.message
    });
  }
};

export const updateDeliveryLocation = async (req, res) => {
  try {
    console.log(`📡 POST /deliveries/${req.params.id}/location - Updating delivery location`);
    console.log('📦 Request body:', req.body);

    const { lat, lng, address } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      console.log('❌ Delivery not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    delivery.trackingUpdates.push({
      status: delivery.status,
      location: { lat, lng, address },
      timestamp: new Date()
    });

    await delivery.save();

    console.log('✅ Delivery location updated:', delivery._id);
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('❌ Error updating delivery location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating delivery location',
      error: error.message
    });
  }
};

export const addDeliveryFeedback = async (req, res) => {
  try {
    console.log(`📡 POST /deliveries/${req.params.id}/feedback - Adding delivery feedback`);
    console.log('📦 Request body:', req.body);

    const { rating, comment } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      console.log('❌ Delivery not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    delivery.feedback = {
      rating,
      comment,
      timestamp: new Date()
    };

    await delivery.save();

    // Update zone statistics
    const zone = await DeliveryZone.findById(delivery.zone);
    if (zone) {
      zone.stats.customerRating = (
        (zone.stats.customerRating * zone.stats.totalDeliveries + rating) /
        (zone.stats.totalDeliveries + 1)
      );
      await zone.save();
    }

    console.log('✅ Delivery feedback added:', delivery._id);
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('❌ Error adding delivery feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding delivery feedback',
      error: error.message
    });
  }
};