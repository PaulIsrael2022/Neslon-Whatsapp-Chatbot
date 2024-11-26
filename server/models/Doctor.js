import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  isActive: { type: Boolean, default: true },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  availability: [{
    day: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    isAvailable: { type: Boolean, default: true }
  }],
  consultationFee: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
doctorSchema.index({ name: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ clinic: 1 });
doctorSchema.index({ isActive: 1 });
doctorSchema.index({ 'contactInfo.email': 1 });
doctorSchema.index({ licenseNumber: 1 }, { unique: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;