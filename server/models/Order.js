import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  orderNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  orderType: {
    type: String,
    enum: ["PRESCRIPTION_REFILL", "NEW_PRESCRIPTION", "OVER_THE_COUNTER"],
    required: true
  },
  orderCategory: {
    type: String,
    enum: ["WHATSAPP_REQUEST", "PHARMACY_PICKUP", "CUSTOMER_PICKUP"],
    default: "WHATSAPP_REQUEST",
    index: true
  },
  scriptNumber: { 
    type: String 
  },
  scriptValue: { 
    type: Number 
  },
  medications: [{
    name: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      default: 1 
    },
    instructions: { 
      type: String 
    }
  }],
  prescriptionImages: [{
    data: Buffer,
    contentType: String,
    filename: String
  }],
  prescriptionFor: {
    type: String,
    enum: ["Main Member", "Dependent Member", "Main & Dependent"],
    default: "Main Member",
    required: true
  },
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    default: null
  },
  linkedMainMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LinkedMainMember",
    default: null
  },
  AssignedDeliveryOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isEmergencyOrder: { 
    type: Boolean, 
    default: false 
  },
  dependent: {
    dependentNumber: { type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    id: { type: String }
  },
  deliveryMethod: {
    type: String,
    enum: ["Delivery", "Pickup"],
    required: true
  },
  deliveryAddress: {
    type: { 
      type: String, 
      enum: ["Work", "Home"], 
      default: "Home" 
    },
    address: { 
      type: String 
    }
  },
  pickupPharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy"
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  assignedPharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy"
  },
  extraNotes: { 
    type: String, 
    default: "" 
  },
  status: {
    type: String,
    enum: [
      "PENDING",
      "PROCESSING",
      "READY_FOR_PICKUP",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "COMPLETED"
    ],
    default: "PENDING"
  },
  statusUpdates: [{
    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "READY_FOR_PICKUP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "COMPLETED"
      ],
      required: true
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deliverySchedule: {
    type: String,
    enum: [
      "9:30 AM - 11:00 AM",
      "11:00 AM - 12:30 PM",
      "1:30 PM - 3:00 PM",
      "3:00 PM - 4:30 PM",
      "4:30 PM - 6:00 PM",
      "Emergency Order"
    ]
  },
  invoice: {
    invoiceNumber: { type: String },
    items: [{
      description: { type: String },
      quantity: { type: Number },
      price: { type: Number }
    }],
    total: { type: Number },
    generatedAt: { type: Date },
    sentViaWhatsApp: { type: Boolean, default: false }
  },
  notifications: {
    type: [{
      type: {
        type: String,
        enum: ["SMS", "WHATSAPP", "EMAIL"],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      sentAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ["PENDING", "SENT", "FAILED"],
        default: "PENDING"
      },
      error: String
    }],
    default: []
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add middleware to update statusUpdates when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    // Add status update entry
    this.statusUpdates.unshift({
      status: this.status,
      updatedBy: this.updatedBy || this.user, // Fallback to order creator if updatedBy not set
      timestamp: new Date()
    });
  }
  next();
});

// Add middleware to handle delivery method changes
orderSchema.pre('save', function(next) {
  if (this.isModified('deliveryMethod')) {
    if (this.deliveryMethod === 'Pickup') {
      if (this.pickupPharmacy) {
        this.orderCategory = 'PHARMACY_PICKUP';
      } else {
        this.orderCategory = 'CUSTOMER_PICKUP';
      }
    } else {
      this.orderCategory = 'WHATSAPP_REQUEST';
    }
  }
  next();
});

// Add middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    });
    
    this.orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Add indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderCategory: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'medications.name': 1 });
orderSchema.index({ pharmacyId: 1 });
orderSchema.index({ 'statusUpdates.timestamp': -1 });
orderSchema.index({ 'notifications.sentAt': -1 });

// Add pagination plugin
orderSchema.plugin(mongoosePaginate);

export default mongoose.model('Order', orderSchema);