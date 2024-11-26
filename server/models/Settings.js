import mongoose from 'mongoose';

const openingHoursSchema = new mongoose.Schema({
  open: { type: String, default: '09:00' },
  close: { type: String, default: '17:00' },
  closed: { type: Boolean, default: false }
});

const settingsSchema = new mongoose.Schema({
  businessInfo: {
    name: { type: String },
    registrationNumber: { type: String },
    vatNumber: { type: String },
    taxNumber: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String }
  },

  openingHours: {
    monday: { type: openingHoursSchema, default: () => ({}) },
    tuesday: { type: openingHoursSchema, default: () => ({}) },
    wednesday: { type: openingHoursSchema, default: () => ({}) },
    thursday: { type: openingHoursSchema, default: () => ({}) },
    friday: { type: openingHoursSchema, default: () => ({}) },
    saturday: { type: openingHoursSchema, default: () => ({}) },
    sunday: { type: openingHoursSchema, default: () => ({}) }
  },

  bankingInfo: {
    bankName: { type: String },
    accountNumber: { type: String },
    branchCode: { type: String },
    swiftCode: { type: String }
  },

  invoiceSettings: {
    autoGenerate: { type: Boolean, default: true },
    autoSend: { type: Boolean, default: true },
    prefix: { type: String, default: "INV" },
    nextNumber: { type: Number, default: 1 }
  },

  integrations: {
    whatsapp: {
      enabled: { type: Boolean, default: true },
      apiKey: { type: String },
      phoneNumberId: { type: String }
    },
    email: {
      enabled: { type: Boolean, default: true },
      host: { type: String },
      port: { type: Number },
      secure: { type: Boolean },
      user: { type: String },
      password: { type: String }
    },
    payment: {
      enabled: { type: Boolean, default: false },
      provider: { type: String },
      apiKey: { type: String },
      secretKey: { type: String }
    }
  },

  notificationPreferences: {
    orderNotifications: { type: Boolean, default: true },
    deliveryUpdates: { type: Boolean, default: true },
    notificationChannels: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true }
    }
  },

  syncSettings: {
    autoSync: { type: Boolean, default: true },
    frequency: { 
      type: String, 
      enum: ['5min', '15min', '30min', '1hour', 'manual'],
      default: '15min'
    },
    lastSync: { type: Date }
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure the settings are properly converted to JSON
settingsSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;