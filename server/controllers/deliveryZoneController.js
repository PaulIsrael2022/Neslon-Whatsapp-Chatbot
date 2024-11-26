import DeliveryZone from '../models/DeliveryZone.js';

export const getDeliveryZones = async (req, res) => {
  try {
    console.log('📡 GET /delivery-zones - Fetching delivery zones...');
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      isActive 
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { areas: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    console.log('🔍 Query:', query);

    const zones = await DeliveryZone.find(query)
      .sort('name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('assignedDrivers.driver', 'firstName surname phoneNumber');

    const total = await DeliveryZone.countDocuments(query);

    console.log(`✅ Found ${zones.length} delivery zones`);

    res.json({
      success: true,
      data: zones,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching delivery zones:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery zones',
      error: error.message
    });
  }
};

export const getDeliveryZoneById = async (req, res) => {
  try {
    console.log(`📡 GET /delivery-zones/${req.params.id} - Fetching delivery zone...`);
    const zone = await DeliveryZone.findById(req.params.id)
      .populate('assignedDrivers.driver', 'firstName surname phoneNumber');

    if (!zone) {
      console.log('❌ Delivery zone not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    console.log('✅ Found delivery zone:', zone.name);
    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    console.error('❌ Error fetching delivery zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery zone',
      error: error.message
    });
  }
};

export const createDeliveryZone = async (req, res) => {
  try {
    console.log('📡 POST /delivery-zones - Creating new delivery zone');
    console.log('📦 Request body:', req.body);

    const zone = new DeliveryZone(req.body);
    await zone.save();

    console.log('✅ Delivery zone created:', zone.name);
    res.status(201).json({
      success: true,
      data: zone
    });
  } catch (error) {
    console.error('❌ Error creating delivery zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating delivery zone',
      error: error.message
    });
  }
};

export const updateDeliveryZone = async (req, res) => {
  try {
    console.log(`📡 PATCH /delivery-zones/${req.params.id} - Updating delivery zone`);
    console.log('📦 Request body:', req.body);

    const zone = await DeliveryZone.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('assignedDrivers.driver', 'firstName surname phoneNumber');

    if (!zone) {
      console.log('❌ Delivery zone not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    console.log('✅ Delivery zone updated:', zone.name);
    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    console.error('❌ Error updating delivery zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating delivery zone',
      error: error.message
    });
  }
};

export const deleteDeliveryZone = async (req, res) => {
  try {
    console.log(`📡 DELETE /delivery-zones/${req.params.id} - Deleting delivery zone`);
    const zone = await DeliveryZone.findByIdAndDelete(req.params.id);

    if (!zone) {
      console.log('❌ Delivery zone not found');
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    console.log('✅ Delivery zone deleted:', zone.name);
    res.json({
      success: true,
      message: 'Delivery zone deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting delivery zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery zone',
      error: error.message
    });
  }
};