import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    openingHours: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isPartner: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
pharmacySchema.index({ name: 1 });
pharmacySchema.index({ isActive: 1 });
pharmacySchema.index({ isPartner: 1 });

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;