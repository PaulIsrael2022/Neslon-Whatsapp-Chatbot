import Pharmacy from '../models/Pharmacy.js';

export const getPharmacies = async (req, res) => {
    try {
      console.log('📡 GET /pharmacies - Fetching pharmacies...');
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        isActive, 
        isPartner 
      } = req.query;
  
      const query = {};
  
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Only add isActive/isPartner to query if explicitly set
      if (isActive === 'true') query.isActive = true;
      if (isActive === 'false') query.isActive = false;
      if (isPartner === 'true') query.isPartner = true;
      if (isPartner === 'false') query.isPartner = false;
  
      console.log('🔍 Query:', query);
  
      const pharmacies = await Pharmacy.find(query)
        .sort('name')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const total = await Pharmacy.countDocuments(query);
  
      console.log(`✅ Found ${pharmacies.length} pharmacies`);
  
      res.json({
        success: true,
        data: pharmacies,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('❌ Error fetching pharmacies:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching pharmacies',
        error: error.message
      });
    }
  };

export const getPharmacyById = async (req, res) => {
  try {
    console.log(`📡 GET /pharmacies/${req.params.id} - Fetching pharmacy...`);
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      console.log('❌ Pharmacy not found');
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    console.log('✅ Found pharmacy:', pharmacy.name);
    res.json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('❌ Error fetching pharmacy:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pharmacy',
      error: error.message
    });
  }
};

export const createPharmacy = async (req, res) => {
  try {
    console.log('📡 POST /pharmacies - Creating new pharmacy');
    console.log('📦 Request body:', req.body);
    
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();

    console.log('✅ Pharmacy created:', pharmacy.name);
    res.status(201).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('❌ Error creating pharmacy:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating pharmacy',
      error: error.message
    });
  }
};

export const updatePharmacy = async (req, res) => {
  try {
    console.log(`📡 PATCH /pharmacies/${req.params.id} - Updating pharmacy`);
    console.log('📦 Request body:', req.body);
    
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!pharmacy) {
      console.log('❌ Pharmacy not found');
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    console.log('✅ Pharmacy updated:', pharmacy.name);
    res.json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('❌ Error updating pharmacy:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pharmacy',
      error: error.message
    });
  }
};

export const deletePharmacy = async (req, res) => {
  try {
    console.log(`📡 DELETE /pharmacies/${req.params.id} - Deleting pharmacy`);
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      console.log('❌ Pharmacy not found');
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    console.log('✅ Pharmacy deleted:', pharmacy.name);
    res.json({
      success: true,
      message: 'Pharmacy deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting pharmacy:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pharmacy',
      error: error.message
    });
  }
};