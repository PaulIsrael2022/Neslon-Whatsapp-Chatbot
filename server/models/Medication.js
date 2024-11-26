import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    index: true
  },
  description: { 
    type: String 
  },
  type: {
    type: String,
    enum: ['PRESCRIPTION', 'OVER_THE_COUNTER'],
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minimumQuantity: {
    type: Number,
    default: 10
  },
  unit: {
    type: String,
    required: true,
    enum: ['TABLETS', 'CAPSULES', 'ML', 'MG', 'PIECES']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  manufacturer: {
    type: String
  },
  expiryDate: {
    type: Date
  },
  batchNumber: {
    type: String
  },
  location: {
    type: String
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true,
    index: true
  },
  instructions: {
    type: String
  },
  sideEffects: [String],
  contraindications: [String],
  status: {
    type: String,
    enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
    default: 'IN_STOCK',
    index: true
  },
  lastRestockDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to update status based on quantity
medicationSchema.pre('save', function(next) {
  if (this.isModified('quantity')) {
    if (this.quantity <= 0) {
      this.status = 'OUT_OF_STOCK';
    } else if (this.quantity <= this.minimumQuantity) {
      this.status = 'LOW_STOCK';
    } else {
      this.status = 'IN_STOCK';
    }
  }
  next();
});

// Virtual for checking if restock is needed
medicationSchema.virtual('needsRestock').get(function() {
  return this.quantity <= this.minimumQuantity;
});

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;