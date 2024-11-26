import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  areas: [{
    type: String,
    required: true
  }],
  boundaries: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon'
    },
    coordinates: [[Number]] // Array of [longitude, latitude] pairs
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKm: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrder: {
    type: Number,
    required: true,
    min: 0
  },
  maxDistance: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedTime: {
    min: Number, // minutes
    max: Number  // minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  restrictions: {
    maxWeight: Number,
    maxItems: Number,
    excludedItems: [String]
  },
  deliverySchedule: {
    monday: {
      available: { type: Boolean, default: true },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    },
    tuesday: {
      available: { type: Boolean, default: true },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    },
    wednesday: {
      available: { type: Boolean, default: true },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    },
    thursday: {
      available: { type: Boolean, default: true },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    },
    friday: {
      available: { type: Boolean, default: true },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    },
    saturday: {
      available: { type: Boolean, default: true },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      slots: [{
        time: String,
        maxDeliveries: Number
      }]
    }
  },
  assignedDrivers: [{
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    priority: {
      type: Number,
      default: 0
    }
  }],
  stats: {
    totalDeliveries: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }, // minutes
    customerRating: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
deliveryZoneSchema.index({ name: 1 });
deliveryZoneSchema.index({ isActive: 1 });
deliveryZoneSchema.index({ 'assignedDrivers.driver': 1 });
deliveryZoneSchema.index({ boundaries: '2dsphere' });

// Virtual for delivery success rate
deliveryZoneSchema.virtual('successRate').get(function() {
  if (this.stats.totalDeliveries === 0) return 0;
  return (this.stats.successfulDeliveries / this.stats.totalDeliveries) * 100;
});

// Method to check if a point is within the zone
deliveryZoneSchema.methods.containsPoint = function(lat, lng) {
  // Implementation would use MongoDB's $geoWithin operator
  return mongoose.model('DeliveryZone').findOne({
    _id: this._id,
    boundaries: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    }
  }).exec();
};

// Method to calculate delivery price
deliveryZoneSchema.methods.calculatePrice = function(distance) {
  if (distance > this.maxDistance) {
    throw new Error('Distance exceeds maximum allowed for this zone');
  }
  return this.basePrice + (distance * this.pricePerKm);
};

const DeliveryZone = mongoose.model('DeliveryZone', deliveryZoneSchema);

export default DeliveryZone;