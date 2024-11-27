import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveryOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryZone',
    required: true
  },
  deliveryAddress: {
    type: {
      type: String,
      enum: ['Home', 'Work'],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specialInstructions: String,
  deliverySchedule: {
    type: String,
    enum: [
      '9:30 AM - 11:00 AM',
      '11:00 AM - 12:30 PM',
      '1:30 PM - 3:00 PM',
      '3:00 PM - 4:30 PM',
      '4:30 PM - 6:00 PM',
      'Emergency Delivery'
    ],
    required: true
  },
  priority: {
    level: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    },
    reason: String,
    updatedAt: { type: Date, default: Date.now }
  },
  performanceMetrics: {
    pickupTime: Date,
    deliveryTime: Date,
    estimatedDuration: Number, // in minutes
    actualDuration: Number,    // in minutes
    distanceCovered: Number,   // in kilometers
    deliveryAttempts: { type: Number, default: 1 },
    customerRating: { type: Number, min: 1, max: 5 },
    issues: [{
      type: { type: String, enum: ['Delay', 'Wrong Address', 'Customer Unavailable', 'Technical', 'Other'] },
      description: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  routeData: {
    sequence: { type: Number, default: 1 }, // Position in delivery route
    estimatedArrival: Date,
    actualArrival: Date,
    optimizationScore: { type: Number, default: 0 }, // 0-100 score based on route efficiency
    waypoints: [{
      location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
      },
      arrivalTime: Date,
      departureTime: Date,
      purpose: { type: String, enum: ['Pickup', 'Delivery', 'Break', 'Other'] }
    }]
  },
  coordinatorManagement: {
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    notes: String,
    statusUpdates: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      comment: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    qualityChecks: [{
      type: { type: String, enum: ['Pre-delivery', 'Post-delivery', 'Customer Feedback'] },
      timestamp: { type: Date, default: Date.now },
      checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      result: { type: String, enum: ['Pass', 'Fail', 'Warning'] },
      notes: String
    }]
  },
  status: {
    type: String,
    enum: [
      'PENDING',
      'ASSIGNED',
      'PICKED_UP',
      'IN_TRANSIT',
      'ARRIVED',
      'DELIVERED',
      'FAILED',
      'CANCELLED'
    ],
    default: 'PENDING'
  },
  startTime: Date,
  completionTime: Date,
  estimatedArrival: Date,
  actualArrival: Date,
  deliveryAttempts: [{
    attemptTime: Date,
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      required: true
    },
    reason: String,
    notes: String
  }],
  proofOfDelivery: {
    signature: {
      data: Buffer,
      contentType: String
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    receivedBy: String,
    timestamp: Date
  },
  trackingUpdates: [{
    status: String,
    location: {
      lat: Number,
      lng: Number,
      address: String
    },
    timestamp: Date,
    notes: String
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
deliverySchema.index({ order: 1 });
deliverySchema.index({ deliveryOfficer: 1 });
deliverySchema.index({ coordinator: 1 });
deliverySchema.index({ zone: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ 'deliverySchedule': 1 });
deliverySchema.index({ createdAt: -1 });

// Virtual for delivery duration
deliverySchema.virtual('duration').get(function() {
  if (this.startTime && this.completionTime) {
    return this.completionTime - this.startTime;
  }
  return null;
});

// Virtual for delivery success rate
deliverySchema.virtual('successRate').get(function() {
  if (!this.deliveryAttempts.length) return null;
  const successful = this.deliveryAttempts.filter(a => a.status === 'SUCCESS').length;
  return (successful / this.deliveryAttempts.length) * 100;
});

// Pre-save middleware to update tracking
deliverySchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.trackingUpdates.push({
      status: this.status,
      timestamp: new Date(),
      notes: `Status updated to ${this.status}`
    });
  }
  next();
});

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;