import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Consultation', 'Procedure', 'Test', 'Other']
  },
  duration: { 
    type: Number 
  },
  price: { 
    type: Number, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  requiredDocuments: [String],
  prerequisites: [String],
  clinic: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Clinic' 
  },
  doctors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor' 
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ clinic: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ price: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;