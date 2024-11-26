import Clinic from '../models/Clinic.js';

export const getClinics = async (req, res) => {
    try {
      console.log('📡 GET /clinics - Fetching clinics...');
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        isActive, 
        isPartner,
        specialties 
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
  
      if (specialties) {
        query.specialties = { 
          $in: Array.isArray(specialties) ? specialties : [specialties] 
        };
      }
  
      console.log('🔍 Query:', query);
  
      const clinics = await Clinic.find(query)
        .sort('name')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('doctors', 'name specialization')
        .populate('services', 'name category');
  
      const total = await Clinic.countDocuments(query);
  
      console.log(`✅ Found ${clinics.length} clinics`);
  
      res.json({
        success: true,
        data: clinics,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('❌ Error fetching clinics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching clinics',
        error: error.message
      });
    }
  };

export const getClinicById = async (req, res) => {
  try {
    console.log(`📡 GET /clinics/${req.params.id} - Fetching clinic...`);
    const clinic = await Clinic.findById(req.params.id)
      .populate('doctors', 'name specialization qualification experience')
      .populate('services', 'name description category price');

    if (!clinic) {
      console.log('❌ Clinic not found');
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }

    console.log('✅ Found clinic:', clinic.name);
    res.json({
      success: true,
      data: clinic
    });
  } catch (error) {
    console.error('❌ Error fetching clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic',
      error: error.message
    });
  }
};

export const createClinic = async (req, res) => {
  try {
    console.log('📡 POST /clinics - Creating new clinic');
    console.log('📦 Request body:', req.body);
    
    const clinic = new Clinic(req.body);
    await clinic.save();

    console.log('✅ Clinic created:', clinic.name);
    res.status(201).json({
      success: true,
      data: clinic
    });
  } catch (error) {
    console.error('❌ Error creating clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating clinic',
      error: error.message
    });
  }
};

export const updateClinic = async (req, res) => {
  try {
    console.log(`📡 PATCH /clinics/${req.params.id} - Updating clinic`);
    console.log('📦 Request body:', req.body);
    
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('doctors', 'name specialization')
      .populate('services', 'name category');

    if (!clinic) {
      console.log('❌ Clinic not found');
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }

    console.log('✅ Clinic updated:', clinic.name);
    res.json({
      success: true,
      data: clinic
    });
  } catch (error) {
    console.error('❌ Error updating clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating clinic',
      error: error.message
    });
  }
};

export const deleteClinic = async (req, res) => {
  try {
    console.log(`📡 DELETE /clinics/${req.params.id} - Deleting clinic`);
    const clinic = await Clinic.findByIdAndDelete(req.params.id);

    if (!clinic) {
      console.log('❌ Clinic not found');
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }

    console.log('✅ Clinic deleted:', clinic.name);
    res.json({
      success: true,
      message: 'Clinic deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting clinic:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting clinic',
      error: error.message
    });
  }
};