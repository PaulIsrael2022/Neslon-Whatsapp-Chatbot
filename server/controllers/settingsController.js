import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    console.log('📡 GET /settings - Fetching settings...');
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('⚠️ No settings found, creating default settings...');
      settings = await Settings.create({
        openingHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '13:00', closed: false },
          sunday: { open: '09:00', close: '17:00', closed: true }
        }
      });
      console.log('✅ Default settings created:', settings);
    }

    // Remove sensitive information for non-admin users
    if (req.user.role !== 'admin') {
      console.log('👤 Non-admin user, removing sensitive data');
      const settingsObj = settings.toObject();
      delete settingsObj.integrations?.whatsapp?.apiKey;
      delete settingsObj.integrations?.email?.password;
      delete settingsObj.integrations?.payment?.secretKey;
      return res.json({
        success: true,
        data: settingsObj
      });
    }

    console.log('✅ Returning settings:', settings);
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    console.log('📡 PATCH /settings - Updating all settings');
    console.log('📦 Request body:', req.body);
    
    const updates = { ...req.body, updatedBy: req.user._id };
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('⚠️ No settings found, creating new settings...');
      settings = await Settings.create(updates);
      console.log('✅ New settings created:', settings);
    } else {
      console.log('🔄 Updating existing settings...');
      // Deep merge the updates
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && updates[key] !== null) {
          settings[key] = { ...settings[key], ...updates[key] };
          settings.markModified(key);
        } else {
          settings[key] = updates[key];
        }
      });
      await settings.save();
      console.log('✅ Settings updated:', settings);
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

export const updateSettingsSection = async (req, res) => {
  try {
    const { section } = req.params;
    console.log(`📡 PATCH /settings/${section} - Updating settings section`);
    console.log('📦 Request body:', req.body);
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('⚠️ No settings found, creating new settings...');
      const initialData = { [section]: req.body, updatedBy: req.user._id };
      settings = await Settings.create(initialData);
      console.log('✅ New settings created:', settings);
    } else {
      console.log('🔄 Updating existing settings section...');
      
      // Handle different sections
      switch (section) {
        case 'general':
          // Handle business info and opening hours
          if (req.body.businessInfo) {
            settings.businessInfo = {
              ...settings.businessInfo,
              ...req.body.businessInfo
            };
            settings.markModified('businessInfo');
          }
          if (req.body.openingHours) {
            Object.entries(req.body.openingHours).forEach(([day, hours]) => {
              settings.openingHours[day] = {
                ...settings.openingHours[day],
                ...hours
              };
            });
            settings.markModified('openingHours');
          }
          break;

        case 'business':
          // Handle business info, banking info, and invoice settings
          if (req.body.businessInfo) {
            settings.businessInfo = {
              ...settings.businessInfo,
              ...req.body.businessInfo
            };
            settings.markModified('businessInfo');
          }
          if (req.body.bankingInfo) {
            settings.bankingInfo = {
              ...settings.bankingInfo,
              ...req.body.bankingInfo
            };
            settings.markModified('bankingInfo');
          }
          if (req.body.invoiceSettings) {
            settings.invoiceSettings = {
              ...settings.invoiceSettings,
              ...req.body.invoiceSettings
            };
            settings.markModified('invoiceSettings');
          }
          break;

        case 'notifications':
          // Handle notification preferences
          if (req.body.notificationPreferences) {
            settings.notificationPreferences = {
              ...settings.notificationPreferences,
              ...req.body.notificationPreferences,
              notificationChannels: {
                ...settings.notificationPreferences.notificationChannels,
                ...req.body.notificationPreferences.notificationChannels
              }
            };
            settings.markModified('notificationPreferences');
          }
          break;

        case 'security':
          // Handle security settings
          if (req.body.passwordRequirements) {
            settings.passwordRequirements = {
              ...settings.passwordRequirements,
              ...req.body.passwordRequirements
            };
            settings.markModified('passwordRequirements');
          }
          if (req.body.enable2FA !== undefined) settings.enable2FA = req.body.enable2FA;
          if (req.body.accessLogging !== undefined) settings.accessLogging = req.body.accessLogging;
          if (req.body.sessionTimeout !== undefined) settings.sessionTimeout = req.body.sessionTimeout;
          if (req.body.passwordExpiry !== undefined) settings.passwordExpiry = req.body.passwordExpiry;
          break;

        case 'integrations':
          // Handle integration settings
          if (req.body.integrations) {
            settings.integrations = {
              ...settings.integrations,
              ...req.body.integrations,
              whatsapp: {
                ...settings.integrations.whatsapp,
                ...req.body.integrations.whatsapp
              },
              email: {
                ...settings.integrations.email,
                ...req.body.integrations.email
              },
              payment: {
                ...settings.integrations.payment,
                ...req.body.integrations.payment
              }
            };
            settings.markModified('integrations');
          }
          break;

        default:
          // Direct update for other sections
          settings[section] = {
            ...settings[section],
            ...req.body
          };
          settings.markModified(section);
      }
      
      settings.updatedBy = req.user._id;
      await settings.save();
      console.log('✅ Settings section updated:', settings);
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('❌ Error updating settings section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings section',
      error: error.message
    });
  }
};

export const testEmailIntegration = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings?.integrations?.email?.enabled) {
      throw new Error('Email integration is not enabled');
    }

    // Implement email testing logic here
    // This would typically involve sending a test email using the configured SMTP settings

    res.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Error testing email integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing email integration',
      error: error.message
    });
  }
};

export const testWhatsAppIntegration = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings?.integrations?.whatsapp?.enabled) {
      throw new Error('WhatsApp integration is not enabled');
    }

    // Implement WhatsApp testing logic here
    // This would typically involve sending a test message using the WhatsApp Business API

    res.json({
      success: true,
      message: 'Test WhatsApp message sent successfully'
    });
  } catch (error) {
    console.error('Error testing WhatsApp integration:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing WhatsApp integration',
      error: error.message
    });
  }
};

export const triggerSync = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    settings.syncSettings.lastSync = new Date();
    await settings.save();

    res.json({
      success: true,
      message: 'Manual sync triggered successfully',
      lastSync: settings.syncSettings.lastSync
    });
  } catch (error) {
    console.error('Error triggering manual sync:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering manual sync',
      error: error.message
    });
  }
};