import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  isActive: { type: Boolean, default: true },
  isPartner: { type: Boolean, default: false },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  specialties: [{ type: String }],
  facilities: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  images: [{
    url: String,
    caption: String
  }],
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  insurance: [{
    provider: String,
    planTypes: [String]
  }],
  emergencyContact: {
    name: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
clinicSchema.index({ name: 1 });
clinicSchema.index({ isActive: 1 });
clinicSchema.index({ isPartner: 1 });
clinicSchema.index({ specialties: 1 });
clinicSchema.index({ location: '2dsphere' });
clinicSchema.index({ 'insurance.provider': 1 });

const Clinic = mongoose.model('Clinic', clinicSchema);

export default Clinic;